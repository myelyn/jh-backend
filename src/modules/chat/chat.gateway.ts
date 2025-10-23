import { MessageBody, SubscribeMessage, WebSocketGateway, ConnectedSocket, WsException } from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';
import { Socket } from 'socket.io';
import { WsJwtAuthGuard } from '@/common/guards/ws-jwt-auth.guard';
import { WsCurrentUser } from '@/common/decorators/ws-current-user.decorator';
import { UserRoomService } from '../user-room/user-room.service';
import { WebSocketBaseGateway } from '@/core/websocket/websocket-base.gateway';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from '@/core/redis/redis.service';
import { SOCKET_EVENTS } from '@/common/constants/feedback-messages';
import { MessageType } from '@/common/constants/message-templates';
import { WsExceptions } from '@/common/exceptions/ws-exceptions';

interface AuthenticatedSocket extends Socket {
  user?: {
    id: number;
    username: string;
    email: string;
    [key: string]: any;
  };
}

@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: ['http://localhost:3000'],
    credentials: true
  }
})
export class ChatGateway extends WebSocketBaseGateway {
  constructor(
    protected readonly userRoomService: UserRoomService,
    protected readonly redisService: RedisService,
    protected readonly jwtService: JwtService
  ) {
    super(redisService, jwtService);
  }

  // 客户端连接
  async handleConnection(client: AuthenticatedSocket) {
    try {
      await this.authenticateClient(client);

      // 记录用户socket连接
      this.redisService.set(`user:${client.user!.id}:socket`, client.id);

      // 设置默认的在线列表更新状态（默认启用）
      client.data.receiveOnlineListUpdates = true;

      const userId = client.user!.id;
      const fromRoomId = (await this.userRoomService.getCurrentRoom(userId)) ?? null;

      // 如果用户有当前房间信息，只需要更新socket连接信息就行，不用处理房间相关逻辑
      if (fromRoomId) {
        await this.joinSocketRoom(client, fromRoomId);
        await this.broadcastOnlineListToUser(fromRoomId, client.id);
        console.log(`用户 ${userId} 重连成功`);
      } else {
        await this.autoJoinRoom(client, 1);
      }
    } catch (error) {
      client.disconnect();
      throw WsExceptions.internalError();
    }
  }

  async handleDisconnect(client: AuthenticatedSocket) {
    try {
      const userId = client.user?.id;
      const currentRoom = client.data.currentRoom;

      // 从房间在线列表中移除用户
      if (currentRoom && userId) {
        await this.leaveSocketRoom(client, currentRoom);
      }

      await this.redisService.del(`user:${userId}:socket`);
    } catch (error) {
      console.error('处理用户断开连接时出错:', error);
    }
  }

  //登录自动加入房间
  private async autoJoinRoom(client: AuthenticatedSocket, roomId: number) {
    try {
      const userId = client.user!.id;

      await this.userRoomService.joinRoom(userId, roomId);
      await this.joinSocketRoom(client, roomId);
      // 添加到房间在线列表
      await this.userRoomService.addUserToRoomOnlineList(roomId, { id: userId, username: client.user!.username });

      const roomName = await this.userRoomService.getRoomName(roomId);

      // 向房间内其他用户发送消息（排除自己）
      this.emitMessageToRoom(
        `room_${roomId}`,
        MessageType.USER_LOGIN,
        {
          username: client.user?.username,
          roomName,
          userId: userId
        },
        client.id,
        userId
      );

      // 向自己发送个人消息
      this.emitMessageToUser(
        client.id,
        MessageType.USER_JOIN_ROOM_SELF,
        {
          username: client.user?.username,
          toRoom: roomName,
          userId: userId
        },
        userId
      );
      // 通知房间内所有用户更新在线列表
      await this.broadcastOnlineListToRoom(roomId);
      await this.broadcastOnlineListToUser(roomId, client.id);

      console.log(`用户 ${userId} 登录成功，自动加入房间 ${roomId}成功`);
    } catch (error) {
      console.log('autoJoinRoom error', error);
      throw WsExceptions.internalError();
    }
  }

  // 切换房间
  @SubscribeMessage(SOCKET_EVENTS.SWITCH_ROOM)
  @UseGuards(WsJwtAuthGuard)
  async handleJoinRoom(@ConnectedSocket() client: AuthenticatedSocket, @MessageBody() data: { roomId: number }, @WsCurrentUser() user: any) {
    console.log('handleJoinRoom 开始执行', { data, user });
    try {
      const { roomId: toRoomId } = data;
      const userId = user.id;

      const fromRoomId = (await this.userRoomService.getCurrentRoom(userId)) ?? null;
      if (fromRoomId) {
        await this.userRoomService.leaveRoom(userId);
        await this.leaveSocketRoom(client, fromRoomId);
        // 从旧房间在线列表中移除
        await this.userRoomService.removeUserFromRoomOnlineList(fromRoomId, userId);
      }

      await this.userRoomService.joinRoom(userId, toRoomId);
      await this.joinSocketRoom(client, toRoomId);
      // 添加到新房间在线列表
      await this.userRoomService.addUserToRoomOnlineList(toRoomId, { id: userId, username: client.user?.username });

      // 获取房间名称
      const fromRoomName = fromRoomId ? await this.userRoomService.getRoomName(fromRoomId) : '未知房间';
      const toRoomName = await this.userRoomService.getRoomName(toRoomId);

      // 向两个房间发送消息（排除自己）
      this.emitMessageToRoom(
        `room_${fromRoomId}`,
        MessageType.USER_LEAVE_ROOM,
        {
          username: client.user?.username,
          fromRoom: fromRoomName,
          toRoom: toRoomName,
          userId: userId
        },
        client.id,
        userId
      );

      this.emitMessageToRoom(
        `room_${toRoomId}`,
        MessageType.USER_JOIN_ROOM,
        {
          username: client.user?.username,
          fromRoom: fromRoomName,
          toRoom: toRoomName,
          userId: userId
        },
        client.id,
        userId
      );

      // 向自己发送个人消息
      this.emitMessageToUser(
        client.id,
        MessageType.USER_JOIN_ROOM_SELF,
        {
          username: client.user?.username,
          fromRoom: fromRoomName,
          toRoom: toRoomName,
          sex: client.user?.sex,
          userId: userId
        },
        userId
      );

      // 通知两个房间的用户更新在线列表
      if (fromRoomId) {
        await this.broadcastOnlineListToRoom(fromRoomId, client.id);
      }
      await this.broadcastOnlineListToRoom(toRoomId);
    } catch (error) {
      console.error('处理 joinRoom 时出错:', error);
      // 如果是 WsException，直接重新抛出
      if (error instanceof WsException) {
        throw error;
      }
      // 其他错误转换为 WsException
      throw WsExceptions.internalError('加入房间失败');
    }
  }

  @SubscribeMessage(SOCKET_EVENTS.SEND_MESSAGE)
  @UseGuards(WsJwtAuthGuard)
  async handleSendMessage(@ConnectedSocket() client: AuthenticatedSocket, @MessageBody() data: { content: string }, @WsCurrentUser() user: any) {
    try {
      const { content } = data;
      const userId = user.id;

      console.log('收到 sendMessage 请求:', { clientId: client?.id, room: client.data.currentRoom, userId, content });

      this.emitMessageToRoom(
        `room_${client.data.currentRoom}`,
        MessageType.CHAT_MESSAGE,
        {
          username: user.username,
          content,
          userId: userId
        },
        undefined,
        userId
      );
    } catch (error) {
      console.error('处理 sendMessage 时出错:', error);
      if (error instanceof WsException) {
        throw error;
      }
      throw WsExceptions.internalError('发送消息失败');
    }
  }

  @SubscribeMessage(SOCKET_EVENTS.USER_EXIT)
  @UseGuards(WsJwtAuthGuard)
  async handleExit(@ConnectedSocket() client: AuthenticatedSocket, @WsCurrentUser() user: any) {
    console.log('handleExit 开始执行', { client, user });
    try {
      const userId = user.id;
      if (!userId) {
        throw WsExceptions.unauthorized();
      }

      const currentRoom = client.data.currentRoom;
      const roomName = await this.userRoomService.getRoomName(currentRoom);

      await this.userRoomService.leaveRoom(userId);
      await this.leaveSocketRoom(client, currentRoom);
      // 从房间在线列表中移除
      await this.userRoomService.removeUserFromRoomOnlineList(currentRoom, userId);

      // 向房间内其他用户发送消息（排除自己）
      this.emitMessageToRoom(
        `room_${currentRoom}`,
        MessageType.USER_EXIT,
        {
          username: client.user?.username,
          roomName,
          userId: userId
        },
        undefined,
        userId
      );

      // 向自己发送个人消息
      this.emitMessageToUser(
        client.id,
        MessageType.USER_EXIT,
        {
          roomName,
          userId: userId
        },
        userId
      );

      // 通知房间内其他用户更新在线列表
      await this.broadcastOnlineListToRoom(currentRoom);
    } catch (error) {
      console.log('handleExit error', error);
      throw WsExceptions.internalError();
    }
  }

  /**
   * 客户端请求获取当前房间在线列表
   */
  @SubscribeMessage('getOnlineList')
  @UseGuards(WsJwtAuthGuard)
  async handleGetOnlineList(@ConnectedSocket() client: AuthenticatedSocket, @WsCurrentUser() user: any) {
    try {
      const currentRoom = client.data.currentRoom;
      if (!currentRoom) {
        throw WsExceptions.roomNotJoined();
      }

      const onlineUsers = await this.userRoomService.getRoomOnlineUsers(currentRoom);

      // 向请求的用户发送在线列表
      client.emit('onlineListUpdate', {
        roomId: currentRoom,
        onlineUsers,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('获取在线列表失败:', error);
      if (error instanceof WsException) {
        throw error;
      }
      throw WsExceptions.internalError('获取在线列表失败');
    }
  }

  /**
   * 客户端控制是否接收在线列表更新
   */
  @SubscribeMessage('toggleOnlineListUpdates')
  @UseGuards(WsJwtAuthGuard)
  async handleToggleOnlineListUpdates(@ConnectedSocket() client: AuthenticatedSocket, @MessageBody() data: { enabled: boolean }) {
    try {
      const { enabled } = data;
      client.data.receiveOnlineListUpdates = enabled;

      console.log(`用户 ${client.user?.id} ${enabled ? '启用' : '禁用'}在线列表更新`);

      // 如果启用，立即发送当前房间的在线列表
      if (enabled) {
        const currentRoom = client.data.currentRoom;
        if (currentRoom) {
          const onlineUsers = await this.userRoomService.getRoomOnlineUsers(currentRoom);
          client.emit('onlineListUpdate', {
            roomId: currentRoom,
            onlineUsers,
            timestamp: new Date().toISOString()
          });
        }
      }
    } catch (error) {
      console.error('切换在线列表更新状态失败:', error);
      throw WsExceptions.internalError('切换在线列表更新状态失败');
    }
  }
}
