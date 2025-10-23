import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MysqlBaseService } from '@/core/mysql/mysql-base.service';
import { Room } from './entities/room.entity';

@Injectable()
export class RoomService extends MysqlBaseService<Room> {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>
  ) {
    super(roomRepository);
  }
}
