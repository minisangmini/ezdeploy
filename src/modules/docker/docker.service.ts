import { Injectable, Logger } from '@nestjs/common';
import * as Docker from 'dockerode';

@Injectable()
export class DockerService {
  private docker: Docker;
  private readonly logger: Logger;

  constructor() {
    this.docker = new Docker();
    this.logger = new Logger(DockerService.name);
  }

  async removeIfExists(containerName: string, imageName: string) {
    try {
      const container = this.docker.getContainer(containerName);
      const containerInfo = await container.inspect(); 

      if (containerInfo.State.Running) { 
        await container.stop();
      }
    
      await container.remove();
      this.logger.debug(`${containerName} - 컨테이너 삭제 완료`)
    } catch (err) {
      this.logger.debug(`${containerName} - 컨테이너 존재하지 않음`)
    }
  
    try {
      const image = this.docker.getImage(imageName);
      await image.remove();  
      this.logger.debug(`${imageName} - 이미지 삭제 완료`)
    } catch (err) {
      this.logger.debug(`${imageName} - 이미지 존재하지 않음`)
    }
  }

  async createImage(dockerfilePath: string, imageName: string) {
    console.log(dockerfilePath, imageName);
    await new Promise((resolve, reject) => {
      this.docker.buildImage(
        {
          context: dockerfilePath,
          src: ['.'],
        },
        { t: imageName },
        (err, stream) => {
          if (err) {
            return reject(err);
          }

          this.docker.modem.followProgress(stream, (err, res) => {
            if (err) {
              return reject(err);
            }

            this.logger.debug(`${imageName} 이미지 생성 완료`)
            resolve(res);
          });
        },
      );
    });
  }

  async createContainer(imageName: string, containerName: string, port: number) {
    const portConfig = {};
    portConfig[`${port}/tcp`] = {};

    const container = await this.docker.createContainer({
      Image: imageName,
      name: containerName,
      HostConfig: {
        RestartPolicy: { Name: 'always' },
        NetworkMode: 'my-network', 
      },
      ExposedPorts: portConfig
    });

    this.logger.debug(`${container.id} 컨테이너 생성 완료`)
    return container;
  }
} 
