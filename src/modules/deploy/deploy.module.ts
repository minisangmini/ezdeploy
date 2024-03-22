import { Module, forwardRef } from '@nestjs/common';
import { DeployService } from './deploy.service';
import { DeployController } from './deploy.controller';
import { DockerService } from 'src/modules/docker/docker.service';
import { ServerModule } from '../server/server.module';

@Module({
  imports: [forwardRef(() => ServerModule)],
  providers: [DeployService, DockerService],
  controllers: [DeployController],
  exports: [DeployService]
})
export class DeployModule {}
