import { Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServerEntity } from './entities/server.entity';
import { Repository } from 'typeorm';
import { DeployService } from '../deploy/deploy.service';
import { ReDeployOptions } from '../deploy/dto/reDeployOptions.dto';
import * as path from 'path';
import { ServerDto } from './dto/server.dto';
import * as util from 'util';
import * as fs from 'fs';

@Injectable()
export class ServerService {
  private readonly readdir;

  constructor(
    @InjectRepository(ServerEntity)
    private serverRepository: Repository<ServerEntity>,
    @Inject(forwardRef(() => DeployService))
    private readonly deployService: DeployService,
  ) {
    this.readdir = util.promisify(fs.readdir);
  }

  async saveServer(serverData: ServerDto) {
    await this.serverRepository.save(serverData);
  }

  async getServer(type: string) {
    if(type !== 'all')
      return await this.serverRepository.find({ 
        select: ['id', 'description'],
        where: { type },
      });

    return await this.serverRepository.find({ select: ['id', 'description'] });
  }

  async getServerById(id: number) {
    return await this.serverRepository.findBy({ id });
  }

  async reDeploy(id: number) {
    const server = await this.serverRepository.findOneBy({ id });
    
    if(!server) {
      throw new NotFoundException('id에 해당하는 서버가 존재하지 않습니다');
    }
    
    const reDeployOptions: ReDeployOptions = {
      filePath: server.filePath,
      forderName: server.forderName,
      dockerfilePath: path.join(server.filePath, server.forderName),
      description: server.description,
      name: server.name,
      port: server.type === 'frontend' ? 80 : 3000,
    };

    await this.deployService.reDeploy(reDeployOptions);
  }

  async getFilePath(id: number) {
    const { filePath, forderName } = await this.serverRepository.findOneBy({ id });
    return {
      filePath,
      forderName
    };
  }

}
