import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber } from 'class-validator';

export class GetFacilityHistogramDto {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  dayOfTheWeek: number;
}
