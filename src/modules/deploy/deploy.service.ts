import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { DockerService } from 'src/modules/docker/docker.service';
import { DeployOptionsDto } from './dto/deployOptions.dto';
import { ServerService } from '../server/server.service';
import { ReDeployOptions } from './dto/reDeployOptions.dto';
import { ServerDto } from '../server/dto/server.dto';

@Injectable()
export class DeployService {
  private readonly logger: Logger;

  constructor(
    private readonly dockerService: DockerService,
    @Inject(forwardRef(() => ServerService))
    private readonly serverService: ServerService,
  ) {
    this.logger = new Logger(DockerService.name);
  }

  async deploy(deployOptions: DeployOptionsDto): Promise<void> {
    let dockerfilePath = '';
    const forderName = deployOptions.filePaths[0].split('/')[0]
    const dateId = Date.now();

    for(let i = 0; i < deployOptions.files.length; i++) {
      const targetPath = path.join(__dirname, `../../uploads/${dateId}`, deployOptions.filePaths[i]);
      if(targetPath.includes('Dockerfile')) {
        dockerfilePath = targetPath.slice(0, -11);
      }

      fs.mkdirSync(path.dirname(targetPath), { recursive: true });
      fs.writeFileSync(targetPath, deployOptions.files[i].buffer);
    }
    
    
    await this.dockerService.removeIfExists(deployOptions.containerName, deployOptions.imageName);
    
    await this.dockerService.createImage(dockerfilePath, deployOptions.imageName);

    const container = await this.dockerService.createContainer(deployOptions.imageName, deployOptions.containerName, deployOptions.port);
    
    await container.start();
    this.logger.debug(`${container.id} 컨테이너 실행 완료`)

    const serverData: ServerDto =  {
      type: deployOptions.port === 80 ? 'frontend' : 'backend',
      name: deployOptions.containerName,
      description: deployOptions.description,
      filePath: path.join(__dirname, `../../uploads/${dateId}`),
      forderName
    };
    await this.serverService.saveServer(serverData);
  }

  async reDeploy(deployOptions: ReDeployOptions) {
    await this.dockerService.removeIfExists(deployOptions.name, deployOptions.name);

    await this.dockerService.createImage(deployOptions.dockerfilePath, deployOptions.name);

    const container = await this.dockerService.createContainer(deployOptions.name, deployOptions.name, deployOptions.port);
    
    await container.start();
    this.logger.debug(`${container.id} 컨테이너 실행 완료`)

    const serverData: ServerDto =  {
      type: deployOptions.port === 80 ? 'frontend' : 'backend',
      name: deployOptions.name,
      description: deployOptions.description.startsWith('재배포 - ') ? deployOptions.description : `재배포 - ${deployOptions.description}`,
      filePath: deployOptions.filePath,
      forderName: deployOptions.forderName,
    };
    await this.serverService.saveServer(serverData);
  }
}
