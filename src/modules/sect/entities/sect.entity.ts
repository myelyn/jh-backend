import { Entity, Column, OneToMany } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { MysqlBaseEntity } from '../../../core/mysql/mysql-base.entity';

@Entity()
export class Sect extends MysqlBaseEntity {
  @Column({
    length: 20,
    comment: '门派名称'
  })
  name: string;

  @Column({
    length: 100,
    comment: '门派介绍'
  })
  introduction: string;

  @OneToMany(() => User, (user) => user.sect)
  users: User[];
}
