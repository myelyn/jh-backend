import { Injectable } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RedisService } from '../redis/redis.service';
import { JwtService } from '@nestjs/jwt';
import { extractTokenFromSocket } from '@/utils/auth.util';
import { WsExceptions } from '@/common/exceptions/ws-exceptions';
import { MessageTemplateRenderer, MessageType } from '@/common/constants/message-templates';

interface AuthenticatedSocket extends Socket {
  user?: {
    id: number;
    username: string;
    email: string;
    [key: string]: any;
  };
}

@Injectable()
export abstract class WebSocketBaseGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  protected readonly server: Server;

  constructor(
    protected readonly redisService: RedisService,
    protected readonly jwtService: JwtService
  ) {}

  abstract handleConnection(client: Socket): void;
  abstract handleDisconnect(client: Socket): void;

  /**
   * 向多个房间发送消息
   * @param rooms 房间
   * @param messageType 消息类型
   * @param data 模板数据
   * @param excludeSocketId 排除的 socket ID（可选）
   * @param senderUserId 发送者用户ID（用于动态判断messageCategory）
   */
  protected emitMessageToRoom(room: string, messageType: MessageType, data: Record<string, any>, excludeSocketId?: string, senderUserId?: number) {
    const message = MessageTemplateRenderer.render(messageType, data, senderUserId);

    if (excludeSocketId) {
      // 向房间内除了指定用户外的所有用户发送
      this.server.to(room).except(excludeSocketId).emit('message', message);
    } else {
      // 向房间内所有用户发送
      this.server.to(room).emit('message', message);
    }
  }

  /**
   * 向特定用户发送个人消息
   * @param socketId socket ID
   * @param messageType 消息类型
   * @param data 模板数据
   * @param currentUserId 当前用户ID（用于动态判断messageCategory）
   */
  protected emitMessageToUser(socketId: string, messageType: MessageType, data: Record<string, any>, currentUserId?: number) {
    const message = MessageTemplateRenderer.render(messageType, data, currentUserId);
    this.server.to(socketId).emit('message', message);
  }

  /**
   * 向房间内所有用户广播在线列表更新
   * @param roomId 房间ID
   * @param excludeUserId 排除的用户ID（可选）
   */
  protected async broadcastOnlineListToRoom(roomId: number, excludeSocketId?: string) {
    try {
      const onlineUsers = await this.redisService.hgetall(`room:${roomId}:users`);

      const parsedOnlineUsers = onlineUsers ? Object.values(onlineUsers).map((user) => JSON.parse(user)) : [];
      const emitData = {
        roomId,
        onlineUsers: parsedOnlineUsers
      };
      if (excludeSocketId) {
        this.server.to(`room_${roomId}`).except(excludeSocketId).emit('onlineListUpdate', emitData);
      } else {
        this.server.to(`room_${roomId}`).emit('onlineListUpdate', emitData);
      }

      console.log(`房间 ${roomId} 在线列表已更新，当前在线用户数: ${parsedOnlineUsers.length}`);
    } catch (error) {
      console.error('广播在线列表更新失败:', error);
    }
  }

  protected async broadcastOnlineListToUser(roomId: number, socketId: string) {
    const onlineUsers = await this.redisService.hgetall(`room:${roomId}:users`);
    const parsedOnlineUsers = onlineUsers ? Object.values(onlineUsers).map((user) => JSON.parse(user)) : [];
    const emitData = {
      roomId,
      onlineUsers: parsedOnlineUsers
    };
    this.server.to(socketId).emit('onlineListUpdate', emitData);
  }

  protected async joinSocketRoom(client: Socket, roomId: number) {
    client.join(`room_${roomId}`);
    client.data.currentRoom = roomId;
  }

  protected async leaveSocketRoom(client: Socket, roomId: number) {
    client.leave(`room_${roomId}`);
    client.data.currentRoom = null;
  }

  protected async getUserRoom(client: Socket) {
    const room = await this.redisService.get(`user:${client.id}:room`);
    if (!room) {
      throw WsExceptions.roomNotJoined();
    }
    return room;
  }

  protected async authenticateClient(client: AuthenticatedSocket): Promise<void> {
    const token = extractTokenFromSocket(client);
    if (!token) {
      throw WsExceptions.unauthorized();
    }

    const payload = this.jwtService.verify(token);
    client.user = payload;

    const userId = client.user?.id;
    if (!userId) {
      throw WsExceptions.unauthorized();
    }
  }
}
