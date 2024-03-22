import { Body, Controller, HttpCode, InternalServerErrorException, Logger, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { DeployService } from './deploy.service';
import { DeployOptionsDto } from './dto/deployOptions.dto';
import { ApiBody, ApiConsumes, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DeployDto } from './dto/reuqest/deploy.dto';

@ApiTags('deploy')
@Controller('deploy')
export class DeployController {
  private readonly logger: Logger;

  constructor(
    private readonly deployService: DeployService,
  ) { 
    this.logger = new Logger(DeployController.name);
  }

  @ApiOperation({ summary: '프론트 배포', description: '프론트엔드를 배포를 합니다' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: DeployDto })
  @ApiOkResponse({ description: '배포를 성공한 경우' })
  @ApiInternalServerErrorResponse({ description: '프론트엔드 배포 중 오류 발생' })
  @Post('/frontend')
  @UseInterceptors(FilesInterceptor('files'))
  @HttpCode(200)
  async deployFrontend(
    @UploadedFiles() files: Array<Express.Multer.File>, 
    @Body('filePaths') filePaths: string[], 
    @Body('description') description: string
    ) {
    const deployOptions: DeployOptionsDto = {
      files,
      filePaths,
      description,
      containerName: 'minclod-frontend',
      imageName: 'minclod-frontend',
      port: 80,
    };

    try {
      await this.deployService.deploy(deployOptions);
    } catch(err) {
      this.logger.warn(`프론트엔드 배포 중 오류 발생 ${err}`);
      throw new InternalServerErrorException('프론트엔드 배포 중 오류 발생')
    }
  }

  @ApiOperation({ summary: '백엔드 배포', description: '백엔드를 배포를 합니다' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: DeployDto })
  @ApiOkResponse({ description: '배포를 성공한 경우' })
  @ApiInternalServerErrorResponse({ description: '백엔드 배포 중 오류 발생' })
  @Post('/backend')
  @UseInterceptors(FilesInterceptor('files'))
  @HttpCode(200)
  async deployBackend(
    @UploadedFiles() files: Array<Express.Multer.File>, 
    @Body('filePaths') filePaths: string[], 
    @Body('description') description: string
    ) {
    const deployOptions: DeployOptionsDto = {
      files,
      filePaths,
      description,
      containerName: 'minclod-backend',
      imageName: 'minclod-backend',
      port: 3000,
    };

    try {
      await this.deployService.deploy(deployOptions);
    } catch(err) {
      this.logger.warn(`백엔드 배포 중 오류 발생 ${err}`);
      throw new InternalServerErrorException('백엔드 배포 중 오류 발생')
    }
  }
}
