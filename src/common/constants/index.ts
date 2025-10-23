// 导出所有常量
export * from './feedback-messages';
export * from './message-types';

// 应用配置常量
export const APP_CONFIG = {
  NAME: '江湖游戏后端',
  VERSION: '1.0.0',
  DESCRIPTION: '江湖游戏后端API服务',
  PORT: 3021
} as const;

// 数据库配置常量
export const DATABASE_CONFIG = {
  TYPE: 'mysql',
  HOST: process.env.MYSQL_HOST || 'localhost',
  PORT: parseInt(process.env.MYSQL_PORT || '3306'),
  USERNAME: process.env.MYSQL_USERNAME || 'root',
  PASSWORD: process.env.MYSQL_PASSWORD || '111',
  DATABASE: process.env.MYSQL_NAME || 'jh-game'
} as const;

// Redis 配置常量
export const REDIS_CONFIG = {
  HOST: process.env.REDIS_HOST || 'localhost',
  PORT: parseInt(process.env.REDIS_PORT || '6379'),
  PASSWORD: process.env.REDIS_PASSWORD || '',
  DB: parseInt(process.env.REDIS_DB || '0')
} as const;

// JWT 配置常量
export const JWT_CONFIG = {
  SECRET: process.env.JWT_SECRET || 'your-secret-key',
  EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '30d'
} as const;

// Socket 配置常量
export const SOCKET_CONFIG = {
  NAMESPACE: '/chat',
  CORS_ORIGIN: ['http://localhost:3000'],
  CONNECTION_TIMEOUT: 20000,
  RECONNECTION_ATTEMPTS: 5,
  RECONNECTION_DELAY: 3000
} as const;
