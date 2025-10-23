import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsExceptions } from '@/common/exceptions/ws-exceptions';
import { extractTokenFromSocket } from '@/utils/auth.util';
import { FEEDBACK_MESSAGES } from '@/common/constants/feedback-messages';

@Injectable()
export class WsJwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const client = context.switchToWs().getClient();

    try {
      const token = extractTokenFromSocket(client);

      if (!token) {
        throw WsExceptions.unauthorized();
      }

      // 验证 JWT token
      const payload = this.jwtService.verify(token);
      console.log('payload', payload);

      // 检查服务器启动时间，如果token是在服务器重启前生成的，则拒绝
      const currentServerStartTime = process.env.SERVER_START_TIME || Date.now();
      if (payload.serverStartTime && payload.serverStartTime < currentServerStartTime) {
        throw new Error('Token已过期，请重新登录');
      }

      client.user = payload;
      return true;
    } catch (error) {
      throw WsExceptions.authFailed();
    }
  }
}
