import { Entity, Column } from 'typeorm';
import { MysqlBaseEntity } from '../../../core/mysql/mysql-base.entity';

@Entity('room')
export class Room extends MysqlBaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: 0 })
  maxUsers: number;

  @Column({ default: true })
  isActive: boolean;
}
