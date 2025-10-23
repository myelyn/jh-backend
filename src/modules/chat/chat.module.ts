import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { UserRoomModule } from '../user-room/user-room.module';
import { WsJwtAuthGuard } from '@/common/guards/ws-jwt-auth.guard';

@Module({
  imports: [UserRoomModule],
  providers: [ChatGateway, ChatService, WsJwtAuthGuard]
})
export class ChatModule {}
