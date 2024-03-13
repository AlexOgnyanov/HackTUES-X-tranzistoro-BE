import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

import { PermissionAction, PermissionObject } from '../enums';

export class UpdatePermissionDto {
  @ApiProperty()
  @IsEnum(PermissionAction)
  @IsNotEmpty()
  action: PermissionAction;

  @ApiProperty()
  @IsEnum(PermissionObject)
  @IsNotEmpty()
  object: PermissionObject;
}
