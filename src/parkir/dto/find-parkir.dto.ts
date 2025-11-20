import { jenisKendaraan } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class FindParkirDto {
  @IsOptional()
  @IsString()
  search: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit: number;

  @IsOptional()
  @IsEnum(jenisKendaraan)
  jenisKendaraan: jenisKendaraan;
}
