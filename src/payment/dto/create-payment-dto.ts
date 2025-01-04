import {
  IsString,
  IsOptional,
  IsInt,
  IsDateString,
  IsNotEmpty,
} from 'class-validator';

export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @IsOptional()
  times?: number;

  @IsString()
  @IsOptional()
  observation?: string;

  @IsDateString()
  @IsOptional()
  firstDate?: string;

  @IsDateString()
  @IsOptional()
  lastDate?: string;

  @IsDateString()
  @IsOptional()
  dayOfPayment?: string;

  @IsInt()
  @IsOptional()
  installmentDate?: number;

  @IsString()
  @IsOptional()
  giftGiver?: string;
}
