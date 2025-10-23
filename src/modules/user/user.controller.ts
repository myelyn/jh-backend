import { BadRequestException, Body, Controller, Get, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRoomService } from '../user-room/user-room.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserResponseVo } from './vos/user-response.vo';
import { RedisService } from '@/core/redis/redis.service';
import { plainToClass } from 'class-transformer';
import { LoginUserDto } from './dtos/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly redisService: RedisService,
    private readonly jwtService: JwtService,
    private readonly userRoomService: UserRoomService
  ) {}

  @Post('register')
  async register(@Body() registerUserDto: CreateUserDto) {
    const { captcha, ...createUserDto } = registerUserDto;
    const cachedCaptcha = await this.redisService.get(`captcha_${createUserDto.email}`);
    // if (!cachedCaptcha) {
    //   throw new BadRequestException('验证码已过期');
    // }
    // if (cachedCaptcha !== captcha) {
    //   throw new BadRequestException('验证码不正确');
    // }
    // await this.redisService.del(`captcha_${createUserDto.email}`);

    const foundUserByUsername = await this.userService.findOne({ username: createUserDto.username });
    if (foundUserByUsername) {
      throw new BadRequestException('用户已存在');
    }

    const foundUserByEmail = await this.userService.findOne({ email: createUserDto.email });
    if (foundUserByEmail) {
      throw new BadRequestException('邮箱已存在');
    }

    const user = await this.userService.createOne(createUserDto);
    return plainToClass(UserResponseVo, user, { excludeExtraneousValues: true });
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    const { username, password } = loginUserDto;
    const user = await this.userService.findOne({ username });
    if (!user) {
      throw new BadRequestException('用户不存在');
    }
    if (user.password !== password) {
      throw new BadRequestException('密码不正确');
    }
    const token = this.jwtService.sign({
      id: user.id,
      username: user.username,
      serverStartTime: process.env.SERVER_START_TIME || Date.now() // 添加服务器启动时间戳
    });
    // 用户重新登录，自动离开之前的房间
    await this.userRoomService.leaveRoom(user.id);
    return {
      token,
      user: plainToClass(UserResponseVo, user, { excludeExtraneousValues: true })
    };
  }

  @Get('info')
  @UseGuards(JwtAuthGuard)
  async userinfo(@Req() req: any) {
    return req.user;
  }
}
