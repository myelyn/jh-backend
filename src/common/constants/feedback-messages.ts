// 系统反馈消息常量
export const FEEDBACK_MESSAGES = {
  // 认证相关
  AUTH: {
    USER_NOT_FOUND: '用户不存在',
    ROOM_NOT_FOUND: '房间不存在',
    AUTH_FAILED: '认证失败，请重新登录',
    TOKEN_INVALID: '登录信息失效，请重新登录',
    UNAUTHORIZED: '您还没有登录，不能进入聊天室'
  },

  // 用户相关
  USER: {
    USER_OR_PASSWORD_INCORRECT: '用户名或密码错误',
    USERNAME_EXISTS: '用户名已存在',
    EMAIL_EXISTS: '邮箱已存在',
    PASSWORD_INCORRECT: '密码错误',
    USER_CREATED: '用户创建成功',
    USER_UPDATED: '用户信息更新成功',
    USER_DELETED: '用户删除成功'
  },

  // 房间相关
  ROOM: {
    ROOM_CREATED: '房间创建成功',
    ROOM_UPDATED: '房间信息更新成功',
    ROOM_DELETED: '房间删除成功',
    ROOM_JOINED: '加入房间成功',
    ROOM_LEFT: '离开房间成功',
    ROOM_SWITCHED: '切换房间成功',
    ROOM_FULL: '房间已满',
    ROOM_NOT_ACCESSIBLE: '房间不可访问',
    ROOM_NOT_JOINED: '还没有加入房间'
  },

  // 消息相关
  MESSAGE: {
    MESSAGE_SENT: '消息发送成功',
    MESSAGE_DELETED: '消息删除成功',
    MESSAGE_UPDATED: '消息更新成功',
    MESSAGE_TOO_LONG: '消息内容过长',
    MESSAGE_EMPTY: '消息内容不能为空'
  },

  // 门派相关
  SECT: {
    SECT_CREATED: '门派创建成功',
    SECT_UPDATED: '门派信息更新成功',
    SECT_DELETED: '门派删除成功',
    SECT_JOINED: '加入门派成功',
    SECT_LEFT: '离开门派成功',
    SECT_NOT_FOUND: '门派不存在',
    SECT_FULL: '门派已满'
  },

  // 角色相关
  ROLE: {
    ROLE_CREATED: '角色创建成功',
    ROLE_UPDATED: '角色信息更新成功',
    ROLE_DELETED: '角色删除成功',
    ROLE_NOT_FOUND: '角色不存在',
    ROLE_ASSIGNED: '角色分配成功'
  },

  // 通用错误
  ERROR: {
    INTERNAL_ERROR: '服务器内部错误',
    VALIDATION_ERROR: '数据验证失败',
    NOT_FOUND: '资源不存在',
    CONFLICT: '资源冲突',
    BAD_REQUEST: '请求参数错误',
    FORBIDDEN: '禁止访问',
    RATE_LIMIT: '请求过于频繁'
  },

  // 成功消息
  SUCCESS: {
    OPERATION_SUCCESS: '操作成功',
    DATA_SAVED: '数据保存成功',
    DATA_DELETED: '数据删除成功',
    DATA_UPDATED: '数据更新成功'
  }
} as const;

// Socket 事件名常量
export const SOCKET_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  MESSAGE: 'message',
  USER_JOINED: 'userJoined',
  USER_LOGIN: 'userLogin',
  USER_LEFT: 'userLeft',
  SWITCH_ROOM: 'switchRoom',
  LEAVE_ROOM: 'leaveRoom',
  SEND_MESSAGE: 'sendMessage',
  USER_EXIT: 'userExit'
} as const;
