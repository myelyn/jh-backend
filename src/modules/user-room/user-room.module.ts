import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRoomService } from './user-room.service';
import { User } from '@/modules/user/entities/user.entity';
import { Room } from '@/modules/room/entities/room.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Room])],
  providers: [UserRoomService],
  exports: [UserRoomService]
})
export class UserRoomModule {}
