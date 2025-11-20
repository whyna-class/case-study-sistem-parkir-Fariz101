import { PartialType } from '@nestjs/mapped-types';
import { CreateParkirDto } from './create-parkir.dto';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { jenisKendaraan } from '@prisma/client';

export class UpdateParkirDto extends PartialType(CreateParkirDto) {
  @IsOptional()
  @IsString()
  platNomor: string;

  @IsOptional()
  @IsEnum(jenisKendaraan)
  jenisKendaraan: jenisKendaraan;

  @IsOptional()
  @IsNumber()
  @Min(1)
  durasi: number;
}
