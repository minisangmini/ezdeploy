import { ApiProperty } from '@nestjs/swagger';

export class DeployDto {
  @ApiProperty({ type: 'string', format: 'binary', isArray: true, description: '배포할 프로젝트 폴더의 하위 파일' })
  files: Express.Multer.File[];

  @ApiProperty({ type: 'string', isArray: true, description: '하위 파일의 경로' })
  filePaths: string[];

  @ApiProperty({ type: 'string', isArray: true, description: '배포할 프로젝트에 대한 설명' })
  description: string;
}
