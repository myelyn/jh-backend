import { Controller, Get, UseGuards } from '@nestjs/common';
import { SectService } from './sect.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('sect')
@UseGuards(JwtAuthGuard)
export class SectController {
  constructor(private readonly sectService: SectService) {}

  @Get('list')
  async findAll() {
    return this.sectService.findAll();
  }
}
