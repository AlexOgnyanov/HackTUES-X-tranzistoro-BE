import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class RequestPasswordChangeDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
