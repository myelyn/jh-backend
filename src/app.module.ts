import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MysqlModule } from './core/mysql/mysql.module';
import { RedisModule } from './core/redis/redis.module';
import { JwtModule } from '@nestjs/jwt';
import { FormatResponseInterceptor } from './common/interceptors/format-response.interceptor';
import { UserModule } from './modules/user/user.module';
import { SectModule } from './modules/sect/sect.module';
import { RoomModule } from './modules/room/room.module';
import { ChatModule } from './modules/chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'src/env/.env'
    }),
    JwtModule.registerAsync({
      global: true,
      useFactory(configService: ConfigService) {
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            expiresIn: configService.get('JWT_EXPIRES_IN')
          }
        };
      },
      inject: [ConfigService]
    }),
    MysqlModule,
    RedisModule,
    UserModule,
    SectModule,
    RoomModule,
    ChatModule
  ],
  providers: [
    {
      provide: 'APP_INTERCEPTOR',
      useClass: FormatResponseInterceptor
    }
  ]
})
export class AppModule {}
