import { Module } from '@nestjs/common';
import { DeployModule } from './modules/deploy/deploy.module';
import { DockerService } from './modules/docker/docker.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from './modules/config/config.module';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { ServerModule } from './modules/server/server.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'mysql',
          host: configService.get<string>('DATABASE_HOST'),
          port: configService.get<number>('DATABASE_PORT'),
          username: configService.get<string>('DATABASE_USERNAME'),
          password: configService.get<string>('DATABASE_PASSWORD'),
          database: configService.get<string>('DATABASE_SCHEMA'),
          entities: [join(__dirname, '/modules/**/entities/*.entity{.ts,.js}')],
          logging: false,
          synchronize: true,
        };
      },
    }),
    DeployModule, 
    ConfigModule, 
    ServerModule,
  ],
  providers: [DockerService],
})
export class AppModule {}
