import { ApiProperty } from '@nestjs/swagger';

export class ServerListResponseDto {
  @ApiProperty({ example: 1, description: '기록의 고유 아이디' })
  id: number;

  @ApiProperty({ example: '로그인 기능 추가', description: '서버 설명' })
  description: string;
}