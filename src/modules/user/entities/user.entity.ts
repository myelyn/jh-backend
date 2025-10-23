import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Sect } from '../../sect/entities/sect.entity';
import { Room } from '../../room/entities/room.entity';
import { SectRole } from '../../sect/entities/sect-role.entity';
import { MysqlBaseEntity } from '../../../core/mysql/mysql-base.entity';

@Entity()
export class User extends MysqlBaseEntity {
  @Column({
    length: 20,
    unique: true,
    comment: '用户名，唯一，用于登录'
  })
  username: string;

  @Column({
    length: 50,
    comment: '密码'
  })
  password: string;

  @Column({
    length: 50,
    unique: true,
    comment: '邮箱，用于验证'
  })
  email: string;

  @Column({
    length: 100,
    comment: '头像',
    nullable: true
  })
  avatar: string;

  @Column({
    default: false,
    comment: '是否冻结'
  })
  isFrozen: boolean;

  @Column({
    default: false,
    comment: '是否是管理员'
  })
  isAdmin: boolean;

  @ManyToOne(() => Sect, (sect) => sect.users, {
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  })
  @JoinColumn({
    name: 'sectId'
  })
  sect: Sect;

  @ManyToOne(() => SectRole)
  @JoinColumn({ name: 'sectRoleId' })
  sectRole: SectRole;

  @ManyToOne(() => Room, {
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  })
  @JoinColumn({ name: 'currentRoomId' })
  currentRoom: Room;

  @Column({
    type: 'timestamp',
    nullable: true,
    comment: '当前房间进入时间'
  })
  currentRoomEnteredAt: Date;
}
