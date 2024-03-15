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

export class GetFacilitiesMapDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  corner1Lat: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  corner2Lat: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  corner1Lon: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  corner2Lon: number;

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
}
