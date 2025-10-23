import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: RedisClientType) {}

  async get(key: string) {
    return await this.redisClient.get(key);
  }

  async set(key: string, value: string | number, ttl?: number) {
    await this.redisClient.set(key, value);

    if (ttl) {
      await this.redisClient.expire(key, ttl);
    }
  }

  async del(key: string) {
    return this.redisClient.del(key);
  }

  async keys(pattern: string) {
    return this.redisClient.keys(pattern);
  }

  // Hash 操作
  async hset(key: string, field: string, value: string) {
    return this.redisClient.hSet(key, field, value);
  }

  async hget(key: string, field: string) {
    return this.redisClient.hGet(key, field);
  }

  async hgetall(key: string) {
    return this.redisClient.hGetAll(key);
  }

  async hdel(key: string, field: string) {
    return this.redisClient.hDel(key, field);
  }

  async hlen(key: string) {
    return this.redisClient.hLen(key);
  }

  // 清理服务重启时的过期数据
  async clearExpiredDataOnStartup() {
    try {
      const [userSocketKeys, userRoomKeys, roomUserKeys] = await Promise.all([
        this.keys('user:*:socket'),
        this.keys('user:*:room'),
        this.keys('room:*:users')
      ]);

      const allKeys = [...userSocketKeys, ...userRoomKeys, ...roomUserKeys];

      if (allKeys.length > 0) {
        await this.redisClient.del(allKeys);
        console.log(`清理完成:`);
        console.log(`- 用户socket映射: ${userSocketKeys.length} 个`);
        console.log(`- 用户房间映射: ${userRoomKeys.length} 个`);
        console.log(`- 房间在线用户列表: ${roomUserKeys.length} 个`);
        console.log(`- 总计清理: ${allKeys.length} 个Redis键`);
      } else {
        console.log('没有发现需要清理的过期数据');
      }

      console.log('Redis过期数据清理完成');
    } catch (error) {
      console.error('清理Redis过期数据时出错:', error);
    }
  }
}
