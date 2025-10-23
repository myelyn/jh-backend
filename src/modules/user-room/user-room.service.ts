import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Room } from '../room/entities/room.entity';
import { RedisService } from '@/core/redis/redis.service';
import { WsExceptions } from '@/common/exceptions/ws-exceptions';

@Injectable()
export class UserRoomService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    private readonly redisService: RedisService
  ) {}
  async joinRoom(userId: number, roomId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const room = await this.roomRepository.findOne({ where: { id: roomId } });
    if (!user) {
      throw WsExceptions.userNotFound();
    }
    if (!room) {
      throw WsExceptions.roomNotFound();
    }

    user.currentRoom = room;
    user.currentRoomEnteredAt = new Date();
    await this.userRepository.update(userId, { currentRoom: room, currentRoomEnteredAt: new Date() });

    await this.redisService.set(`user:${userId}:room`, roomId.toString());

    console.log('joinRoom success', userId, roomId);
  }

  async leaveRoom(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw WsExceptions.userNotFound();
    }

    // todo 复活时间没到，不能离开房间；在天牢，不能离开房间

    // 更新数据库
    await this.userRepository.update(userId, {
      currentRoom: undefined,
      currentRoomEnteredAt: undefined
    });

    // 更新redis
    await this.redisService.del(`user:${userId}:room`);
    console.log('leaveRoom success', userId);
  }

  async getCurrentRoom(userId: number): Promise<number | null> {
    const roomId = await this.redisService.get(`user:${userId}:room`);
    return roomId ? parseInt(roomId, 10) : null;
  }

  /**
   * 获取房间名称
   */
  async getRoomName(roomId: number): Promise<string> {
    const room = await this.roomRepository.findOne({ where: { id: roomId } });
    return room?.name || `房间${roomId}`;
  }

  /**
   * 添加用户到房间在线列表
   */
  async addUserToRoomOnlineList(roomId: number, user: DeepPartial<User>): Promise<void> {
    const key = `room:${roomId}:users`;
    const userInfoString = JSON.stringify({
      ...user,
      joinedAt: new Date().toISOString()
    });

    // 使用 Hash 结构存储用户信息，key 为 userId
    await this.redisService.hset(key, user.id!.toString(), userInfoString);

    console.log(`用户 ${user.username} 加入房间 ${roomId} 在线列表`);
  }

  /**
   * 从房间在线列表中移除用户
   */
  async removeUserFromRoomOnlineList(roomId: number, userId: number): Promise<void> {
    const key = `room:${roomId}:users`;
    await this.redisService.hdel(key, userId.toString());

    console.log(`用户 ${userId} 从房间 ${roomId} 在线列表移除`);
  }

  /**
   * 获取房间在线用户列表
   */
  async getRoomOnlineUsers(roomId: number): Promise<Array<{ id: number; username: string; joinedAt: string }>> {
    const key = `room:${roomId}:users`;
    const users = await this.redisService.hgetall(key);
    console.log('getRoomOnlineUsers', users);
    return Object.values(users)
      .map((userInfo) => {
        try {
          const parsed = JSON.parse(userInfo);
          return {
            id: parsed.id,
            username: parsed.username,
            joinedAt: parsed.joinedAt
          };
        } catch (error) {
          console.error('解析用户信息失败:', userInfo);
          return null;
        }
      })
      .filter((user): user is { id: number; username: string; joinedAt: string } => user !== null);
  }

  /**
   * 获取房间在线用户数量
   */
  async getRoomOnlineUserCount(roomId: number): Promise<number> {
    const key = `room:${roomId}:users`;
    return await this.redisService.hlen(key);
  }

  /**
   * 检查用户是否在房间在线列表中
   */
  async isUserOnlineInRoom(roomId: number, userId: number): Promise<boolean> {
    const key = `room:${roomId}:users`;
    const userInfo = await this.redisService.hget(key, userId.toString());
    return !!userInfo;
  }

  /**
   * 清理房间在线列表（当房间被删除时使用）
   */
  async clearRoomOnlineList(roomId: number): Promise<void> {
    const key = `room:${roomId}:users`;
    await this.redisService.del(key);

    console.log(`清理房间 ${roomId} 的在线用户列表`);
  }
}
