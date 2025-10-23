import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const databaseConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'mysql',
  host: configService.get('MYSQL_HOST', 'localhost'),
  port: configService.get('MYSQL_PORT', 3306),
  username: configService.get('MYSQL_USERNAME', 'root'),
  password: configService.get('MYSQL_PASSWORD', '111'),
  database: configService.get('MYSQL_NAME', 'jh-game'),
  entities: [__dirname + '/../modules/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations',
  synchronize: false, // 生产环境必须为 false
  logging: false,
  poolSize: 10
});
