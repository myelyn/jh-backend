import { Injectable, NotFoundException } from '@nestjs/common';
import { DeepPartial, FindOptionsWhere, Repository, FindManyOptions } from 'typeorm';
import { MysqlBaseEntity } from './mysql-base.entity';

@Injectable()
export class MysqlBaseService<T extends MysqlBaseEntity> {
  constructor(private readonly repository: Repository<T>) {}

  // 查询所有记录
  async findAll(): Promise<T[]>;
  // 按条件查询
  async findAll(where: FindOptionsWhere<T>): Promise<T[]>;
  // 完整查询选项
  async findAll(options: FindManyOptions<T>): Promise<T[]>;
  
  async findAll(whereOrOptions?: FindOptionsWhere<T> | FindManyOptions<T>): Promise<T[]> {
    if (!whereOrOptions) {
      return this.repository.find();
    }
    
    // 判断是简单条件还是完整选项
    if ('where' in whereOrOptions || 'order' in whereOrOptions || 'skip' in whereOrOptions || 'take' in whereOrOptions) {
      return this.repository.find(whereOrOptions as FindManyOptions<T>);
    } else {
      return this.repository.find({ where: whereOrOptions as FindOptionsWhere<T> });
    }
  }

  async findOneById(id: number): Promise<T | null> {
    return this.repository.findOneBy({ id } as FindOptionsWhere<T>);
  }

  async findOne(where: FindOptionsWhere<T>): Promise<T | null> {
    return this.repository.findOneBy(where);
  }

  async createOne(dto: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(dto);
    return this.repository.save(entity);
  }

  async updateOne(id: number, dto: DeepPartial<T>): Promise<T> {
    const entity = await this.repository.findOneBy({
      id
    } as FindOptionsWhere<T>);
    if (!entity) {
      throw new NotFoundException('您要修改的资源不存在');
    }
    Object.assign(entity, dto);
    return this.repository.save(entity);
  }

  async delete(id: number): Promise<void> {
    const entity = await this.repository.findOneBy({
      id
    } as FindOptionsWhere<T>);
    if (!entity) {
      throw new NotFoundException('您要删除的资源不存在');
    }
    await this.repository.delete(id);
  }
}
