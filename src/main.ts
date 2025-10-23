import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { RedisService } from './core/redis/redis.service';

async function bootstrap() {
  // 设置服务器启动时间戳
  process.env.SERVER_START_TIME = Date.now().toString();

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true
  });

  app.useWebSocketAdapter(new IoAdapter(app));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true
    })
  );

  // 清理Redis中的过期数据
  const redisService = app.get(RedisService);
  await redisService.clearExpiredDataOnStartup();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch(console.error);
