import { IsEmail, IsNotEmpty, IsString, Length, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({
    message: '用户名不能为空'
  })
  @Length(2, 5, {
    message: '用户名长度必须在2-5个字符之间'
  })
  @Matches(/^[\u4e00-\u9fa5]+$/, {
    message: '用户名只能包含中文汉字'
  })
  username: string;

  @IsString()
  @IsNotEmpty({
    message: '密码不能为空'
  })
  @Length(6, 20, {
    message: '密码长度必须在6-20个字符之间'
  })
  password: string;

  @IsEmail(
    {},
    {
      message: '邮箱格式不正确'
    }
  )
  @IsNotEmpty({
    message: '邮箱不能为空'
  })
  email: string;

  @IsNotEmpty({
    message: '验证码不能为空'
  })
  captcha: string;
}
