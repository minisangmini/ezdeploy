import { IsArray, IsNumber, IsString } from 'class-validator';

export class ReDeployOptions {

  @IsString()
  filePath: string;

  @IsString()
  forderName: string;

  @IsString()
  dockerfilePath: string;

  @IsString()
  description: string;

  @IsNumber()
  port: number;

  @IsString()
  name: string;
}