import { Inject, Injectable } from '@nestjs/common';
import { UserRoomService } from '../user-room/user-room.service';

@Injectable()
export class ChatService {
  constructor(
    @Inject(UserRoomService)
    private readonly UserRoomService: UserRoomService
  ) {}

  // async joinRoom(userId: number, roomId: number) {
  //   await this.UserRoomService.joinRoom(userId, roomId);
  // }
}
