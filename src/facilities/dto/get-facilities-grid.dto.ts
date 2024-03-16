import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

import { FacilityDepartments, FacilityTags } from '../enums';

export class GetFacilitiesGridDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  userLat: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  userLon: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  sort?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  order?: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(FacilityTags, { each: true })
  tags?: FacilityTags[];

  @ApiProperty()
  @IsOptional()
  @IsEnum(FacilityDepartments, { each: true })
  departments?: FacilityDepartments[];

  @ApiProperty()
  @IsOptional()
  @IsNumberString({}, { each: true })
  companyIds?: number[];

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  page = 1;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  limit = 20;
}
