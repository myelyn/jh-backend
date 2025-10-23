import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const WsCurrentUser = createParamDecorator((key: string, ctx: ExecutionContext) => {
  console.log('WsCurrentUser 装饰器开始执行');
  const client = ctx.switchToWs().getClient();
  const user = client.user;
  console.log('WsCurrentUser 获取到的 user:', user);

  return key ? user?.[key] : user;
});
