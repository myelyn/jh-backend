import { Entity, Column } from 'typeorm';
import { MysqlBaseEntity } from '../../../core/mysql/mysql-base.entity';

@Entity()
export class SectRole extends MysqlBaseEntity {
  @Column({
    length: 20,
    comment: '角色名称'
  })
  name: '成员' | '堂主' | '护法' | '长老' | '副掌门' | '掌门';

  @Column({
    length: 100,
    comment: '角色介绍'
  })
  introduction: string;
}
