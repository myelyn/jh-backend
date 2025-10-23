import { Module } from '@nestjs/common';
import { SectController } from './sect.controller';
import { SectService } from './sect.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sect } from './entities/sect.entity';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
@Module({
  imports: [TypeOrmModule.forFeature([Sect])],
  controllers: [SectController],
  providers: [SectService, JwtAuthGuard]
})
export class SectModule {}
