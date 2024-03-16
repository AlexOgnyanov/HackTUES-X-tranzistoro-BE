import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AddAttendanceDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  cameraId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  count: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  apiKey: string;
}
