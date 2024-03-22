import { IsString } from 'class-validator';

export class ServerDto {

  @IsString()
  type: string;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  filePath: string;

  @IsString()
  forderName: string;
}