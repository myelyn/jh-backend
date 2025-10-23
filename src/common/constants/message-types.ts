// WebSocket 消息类型常量
export const MESSAGE_TYPES = {
  // 用户相关
  USER_LOGIN: 'userLogin',
  USER_LOGOUT: 'userLogout',

  // 房间相关
  ROOM_SWITCH: 'roomSwitch',

  // 消息相关
  CHAT_MESSAGE: 'chatMessage',

  // 系统相关
  SYSTEM: 'system',
  ANNOUNCEMENT: 'announcement',
  WARNING: 'warning',
  ERROR: 'error',
  SUCCESS: 'success',
  INFO: 'info',

  // PK相关
  PK_USE_CARD: 'pkUseCard',
  PK_USE_SKILL: 'pkUseSkill'
} as const;

// 消息类型别名
export type MessageType = (typeof MESSAGE_TYPES)[keyof typeof MESSAGE_TYPES];

// 消息数据结构
export interface MessageData {
  id: string;
  type: MessageType;
  timestamp: number;
  content: string;
  data: {
    userId?: number;
    username?: string;
    roomId?: number;
    roomName?: string;
    [key: string]: any;
  };
}
