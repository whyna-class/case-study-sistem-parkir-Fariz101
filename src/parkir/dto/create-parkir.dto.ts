import { jenisKendaraan } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateParkirDto {
  @IsNotEmpty()
  @IsString()
  platNomor: string;

  @IsNotEmpty()
  @IsEnum(jenisKendaraan)
  jenisKendaraan: jenisKendaraan;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  durasi: number;
}
