import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import { FacilityTags } from '../enums';

export class CreateFacilityDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  lat: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  lon: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  streetName: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(FacilityTags, { each: true })
  tags: FacilityTags[];
}
