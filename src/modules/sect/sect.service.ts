import { Injectable } from '@nestjs/common';
import { MysqlBaseService } from '@/core/mysql/mysql-base.service';
import { Sect } from './entities/sect.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SectService extends MysqlBaseService<Sect> {
  constructor(
    @InjectRepository(Sect)
    private readonly sectRepository: Repository<Sect>
  ) {
    super(sectRepository);
  }
}
