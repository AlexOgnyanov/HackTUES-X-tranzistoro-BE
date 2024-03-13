import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty, ArrayNotEmpty } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNumber({}, { each: true })
  @ArrayNotEmpty()
  permissionIds: number[];
}
