import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { MysqlBaseService } from '@/core/mysql/mysql-base.service';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService extends MysqlBaseService<User> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {
    super(userRepository);
  }
}
