import { IsArray, IsNumber, IsString } from 'class-validator';

export class DeployOptionsDto {
  @IsArray()
  files: Express.Multer.File[];

  @IsArray()
  @IsString({ each: true })
  filePaths: string[];

  @IsString()
  description: string;

  @IsNumber()
  port: number;

  @IsString()
  imageName: string;

  @IsString()
  containerName: string;
}