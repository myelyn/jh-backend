import { Controller, Get, Post, Body, UseGuards, Param, ParseIntPipe } from '@nestjs/common';
import { RoomService } from './room.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { UserRoomService } from '../user-room/user-room.service';

@Controller('room')
@UseGuards(JwtAuthGuard)
export class RoomController {
  constructor(
    private readonly roomService: RoomService,
    private readonly userRoomService: UserRoomService
  ) {}

  @Get('list')
  async getRooms() {
    return this.roomService.findAll();
  }

  @Post('create')
  async createRoom(@Body() createRoomDto: { name: string; description?: string }) {
    return this.roomService.createOne(createRoomDto);
  }

  @Get(':id/online-users')
  async getRoomOnlineUsers(@Param('id', ParseIntPipe) roomId: number) {
    const onlineUsers = await this.userRoomService.getRoomOnlineUsers(roomId);
    const userCount = await this.userRoomService.getRoomOnlineUserCount(roomId);

    return {
      roomId,
      onlineUsers,
      userCount,
      timestamp: new Date().toISOString()
    };
  }

  @Get(':id/online-count')
  async getRoomOnlineUserCount(@Param('id', ParseIntPipe) roomId: number) {
    const userCount = await this.userRoomService.getRoomOnlineUserCount(roomId);

    return {
      roomId,
      userCount,
      timestamp: new Date().toISOString()
    };
  }
}
