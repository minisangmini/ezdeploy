import { Module, forwardRef } from '@nestjs/common';
import { ServerService } from './server.service';
import { ServerController } from './server.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServerEntity } from './entities/server.entity';
import { DeployModule } from '../deploy/deploy.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ServerEntity]),
    forwardRef(() => DeployModule),
  ],
  controllers: [ServerController],
  providers: [ServerService],
  exports: [ServerService]
})
export class ServerModule {}
