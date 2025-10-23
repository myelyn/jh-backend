import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { FEEDBACK_MESSAGES } from '@/common/constants/feedback-messages';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException(FEEDBACK_MESSAGES.AUTH.UNAUTHORIZED);
    }

    // 检查 Bearer 格式
    if (!authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(FEEDBACK_MESSAGES.AUTH.AUTH_FAILED);
    }

    // 提取 token
    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException(FEEDBACK_MESSAGES.AUTH.TOKEN_INVALID);
    }

    try {
      const decoded = this.jwtService.verify(token);

      // 检查服务器启动时间，如果token是在服务器重启前生成的，则拒绝
      const currentServerStartTime = process.env.SERVER_START_TIME || Date.now();
      if (decoded.serverStartTime && decoded.serverStartTime < currentServerStartTime) {
        throw new UnauthorizedException('Token已过期，请重新登录');
      }

      request.user = decoded;
      return true;
    } catch (error) {
      throw new UnauthorizedException(FEEDBACK_MESSAGES.AUTH.TOKEN_INVALID);
    }
  }
}
