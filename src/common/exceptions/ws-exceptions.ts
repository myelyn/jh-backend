import { WsException } from '@nestjs/websockets';
import { FEEDBACK_MESSAGES } from '@/common/constants/feedback-messages';

export class WsExceptions {
  // 认证相关异常
  static unauthorized(message?: string): WsException {
    return new WsException(message || FEEDBACK_MESSAGES.AUTH.UNAUTHORIZED);
  }

  static authFailed(): WsException {
    return new WsException(FEEDBACK_MESSAGES.AUTH.AUTH_FAILED);
  }

  // 用户相关异常
  static userNotFound(): WsException {
    return new WsException(FEEDBACK_MESSAGES.AUTH.USER_NOT_FOUND);
  }

  // 房间相关异常
  static roomNotFound(): WsException {
    return new WsException(FEEDBACK_MESSAGES.AUTH.ROOM_NOT_FOUND);
  }

  static roomFull(): WsException {
    return new WsException(FEEDBACK_MESSAGES.ROOM.ROOM_FULL);
  }

  static roomNotAccessible(): WsException {
    return new WsException(FEEDBACK_MESSAGES.ROOM.ROOM_NOT_ACCESSIBLE);
  }

  static roomNotJoined(): WsException {
    return new WsException(FEEDBACK_MESSAGES.ROOM.ROOM_NOT_JOINED);
  }

  // 消息相关异常
  static messageEmpty(): WsException {
    return new WsException(FEEDBACK_MESSAGES.MESSAGE.MESSAGE_EMPTY);
  }

  static messageTooLong(): WsException {
    return new WsException(FEEDBACK_MESSAGES.MESSAGE.MESSAGE_TOO_LONG);
  }

  // 通用异常
  static badRequest(message?: string): WsException {
    return new WsException(message || FEEDBACK_MESSAGES.ERROR.BAD_REQUEST);
  }

  static forbidden(message?: string): WsException {
    return new WsException(message || FEEDBACK_MESSAGES.ERROR.FORBIDDEN);
  }

  static internalError(message?: string): WsException {
    return new WsException(message || FEEDBACK_MESSAGES.ERROR.INTERNAL_ERROR);
  }

  // 自定义异常
  static custom(message: string): WsException {
    return new WsException(message);
  }
}
