import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateCameraDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  cameraId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  departmentId: number;
}
