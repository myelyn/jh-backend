import { Expose } from 'class-transformer';

export class UserResponseVo {
  @Expose()
  id: number;
  @Expose()
  username: string;
  @Expose()
  email: string;
  @Expose()
  createdAt: Date;
  @Expose()
  updatedAt: Date;
  @Expose()
  current_room_id: number;
}
