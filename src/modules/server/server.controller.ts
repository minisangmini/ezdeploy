import { Controller, Get, HttpCode, Param, Post, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { ServerService } from './server.service';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ServerListResponseDto } from './dto/response/server-list-response.dto';
import { Request } from 'express';
import * as archiver from 'archiver';
import { join } from 'path';

@ApiTags('server')
@Controller('server')
export class ServerController {
  constructor(private readonly serverService: ServerService) {}


  @ApiOperation({ summary: '서버 리스트', description: 'type에 해당하는 서버 리스트 반환' })
  @ApiParam({ name: 'type', description: '서버 타입', type: String, examples: {
    frontend: {
      summary: 'Frontend 서버',
      value: 'frontend',
      description: 'Frontend 서버에 대한 요청',
    },
    backend: {
      summary: 'Backend 서버',
      value: 'backend',
      description: 'Backend 서버에 대한 요청',
    },
    all: {
      summary: '모든 서버',
      value: 'all',
      description: '모든 타입의 서버에 대한 요청',
    },
  }})
  @ApiOkResponse({ description: '성공한 경우', type: ServerListResponseDto, isArray: true })
  @Get('/:type')
  async serverList(@Param('type') type: string, @Req() req: Request) {
    // const xForwardedFor = req.headers['x-forwarded-for'];
    return await this.serverService.getServer(type);
  }

  @ApiOperation({ summary: '서버 재배포', description: 'id에 해당하는 서버 재배포' })
  @ApiParam({ name: 'id', description: '서버 id', type: Number })
  @ApiOkResponse({ description: '재배포에 성공한 경우' })
  @ApiNotFoundResponse({ description: 'id에 해당하는 서버가 없는 경우' })
  @Post('/:id/redeploy')
  @HttpCode(200)
  async reDeploy(@Param('id') id: number) {
    await this.serverService.reDeploy(id);  
  }

  @ApiOperation({ summary: '서버 다운로드', description: 'id에 해당하는 서버 파일 다운로드' })
  @ApiParam({ name: 'id', description: '서버 id', type: Number })
  @ApiOkResponse({ description: '서버 파일을 .zip 형식으로 반환' })
  @Get('/:id/download')
  async serverDownload(@Param('id') id: string, @Res() res: Response) {
    const { filePath, forderName } = await this.serverService.getFilePath(parseInt(id));

    const zipFileName = `${forderName}.zip`;
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${zipFileName}"`);

    const archive = archiver('zip', {
      zlib: { level: 9 },
    });

    archive.pipe(res);

    archive.directory(join(filePath, forderName), false);

    archive.finalize();
  }
}
