// 消息模板常量
export const MESSAGE_TEMPLATES = {
  // 用户登录
  USER_LOGIN: {
    template: '少侠 {username} 踏足江湖，进入【{roomName}】',
    type: 'system',
    color: '#4CAF50',
    messageCategory: 'others' // 他人消息
  },

  // 用户离开房间（其他人看到的消息）
  USER_LEAVE_ROOM: {
    template: '少侠 {username} 从【{fromRoom}】离开, 行至【{toRoom}】',
    type: 'system',
    color: '#FF9800',
    messageCategory: 'others' // 他人消息
  },

  // 用户加入房间（其他人看到的消息）
  USER_JOIN_ROOM: {
    template: '少侠 {username} 从【{fromRoom}】来到【{toRoom}】',
    type: 'system',
    color: '#4CAF50',
    messageCategory: 'others' // 他人消息
  },

  // 用户加入房间（自己看到的消息）
  USER_JOIN_ROOM_SELF: {
    template: '欢迎【{username}】来到【{toRoom}】',
    type: 'system',
    color: '#4CAF50',
    messageCategory: 'self' // 与我相关
  },

  USER_EXIT: {
    template: '少侠【{username}】离开了【{roomName}】，后会有期',
    type: 'system',
    color: '#4CAF50',
    messageCategory: 'others' // 他人消息
  },

  // 聊天消息
  CHAT_MESSAGE: {
    template: '{username}: {content}',
    type: 'chat',
    color: '#333333',
    messageCategory: 'dynamic' // 动态判断：自己发送的是与我相关，别人发送的是他人消息
  },

  // 系统公告
  SYSTEM_ANNOUNCEMENT: {
    template: '【系统】{content}',
    type: 'system',
    color: '#F44336',
    messageCategory: 'others' // 他人消息
  },

  // 门派消息
  SECT_MESSAGE: {
    template: '【{sectName}】{username}: {content}',
    type: 'sect',
    color: '#795548',
    messageCategory: 'dynamic' // 动态判断：自己发送的是与我相关，别人发送的是他人消息
  },

  // 私聊消息
  PRIVATE_MESSAGE: {
    template: '【私聊】{username}: {content}',
    type: 'private',
    color: '#607D8B',
    messageCategory: 'dynamic' // 动态判断：自己发送的是与我相关，别人发送的是他人消息
  }
} as const;

// 消息类型枚举
export enum MessageType {
  USER_LOGIN = 'USER_LOGIN',
  USER_LEAVE_ROOM = 'USER_LEAVE_ROOM',
  USER_JOIN_ROOM = 'USER_JOIN_ROOM',
  USER_JOIN_ROOM_SELF = 'USER_JOIN_ROOM_SELF',
  USER_EXIT = 'USER_EXIT',
  CHAT_MESSAGE = 'CHAT_MESSAGE',
  SYSTEM_ANNOUNCEMENT = 'SYSTEM_ANNOUNCEMENT',
  SECT_MESSAGE = 'SECT_MESSAGE',
  PRIVATE_MESSAGE = 'PRIVATE_MESSAGE'
}

// 消息模板渲染器
export class MessageTemplateRenderer {
  /**
   * 渲染消息模板
   * @param messageType 消息类型
   * @param data 模板数据
   * @param currentUserId 当前用户ID（用于动态判断messageCategory）
   * @returns 渲染后的消息对象
   */
  static render(messageType: MessageType, data: Record<string, any>, currentUserId?: number) {
    const template = MESSAGE_TEMPLATES[messageType];
    if (!template) {
      throw new Error(`Unknown message type: ${messageType}`);
    }

    // 渲染模板内容
    const content = this.renderTemplate(template.template, data);

    // 确定消息分类
    let messageCategory = template.messageCategory;
    if (messageCategory === 'dynamic') {
      // 动态判断：如果消息中的用户ID与当前用户ID相同，则是与我相关，否则是他人消息
      const messageUserId = data.userId || data.id;
      messageCategory = messageUserId && currentUserId && messageUserId === currentUserId ? 'self' : 'others';
    }

    return {
      type: messageType,
      content,
      templateType: template.type,
      color: template.color,
      messageCategory,
      timestamp: new Date().toISOString(),
      data
    };
  }

  /**
   * 渲染模板字符串
   * @param template 模板字符串
   * @param data 数据对象
   */
  private static renderTemplate(template: string, data: Record<string, any>): string {
    return template.replace(/\{(\w+)\}/g, (match, key) => {
      return data[key] || '';
    });
  }

  /**
   * 批量渲染消息
   * @param messages 消息数组
   * @param currentUserId 当前用户ID（用于动态判断messageCategory）
   * @returns 渲染后的消息数组
   */
  static renderBatch(messages: Array<{ type: MessageType; data: Record<string, any> }>, currentUserId?: number) {
    return messages.map((msg) => this.render(msg.type, msg.data, currentUserId));
  }
}
