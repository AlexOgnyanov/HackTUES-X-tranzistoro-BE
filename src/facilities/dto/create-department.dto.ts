import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

import { FacilityDepartments } from '../enums';

export class CreateDepartmentDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(FacilityDepartments)
  type: FacilityDepartments;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  facilityId: number;
}
