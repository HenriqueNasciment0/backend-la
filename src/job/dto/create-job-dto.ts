import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsOptional,
  IsDate,
  IsBoolean,
  IsArray,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateJobDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @IsNotEmpty()
  @Type(() => Number)
  customerId: number;

  @IsArray()
  @IsInt({ each: true })
  @IsNotEmpty()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value); // Parseia o JSON
        if (Array.isArray(parsed)) return parsed.map((v) => parseInt(v, 10));
        throw new Error('categoryIds must be an array');
      } catch {
        throw new Error('Invalid JSON format for categoryIds');
      }
    }
    if (Array.isArray(value)) return value.map((v) => parseInt(v, 10));
    return value;
  })
  categoryIds: number[];

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) return parsed.map((v) => parseInt(v, 10));
        throw new Error('locationIds must be an array');
      } catch {
        throw new Error('Invalid JSON format for locationIds');
      }
    }
    if (Array.isArray(value)) return value.map((v) => parseInt(v, 10));
    return value;
  })
  locationIds?: number[];

  @IsArray()
  @IsOptional()
  photos?: Express.Multer.File[];

  @IsString()
  @IsOptional()
  payment: string;

  @IsString()
  @IsOptional()
  cover?: string;

  @IsString()
  @IsOptional()
  customerLink?: string;

  @IsInt()
  @IsOptional()
  discount?: number;

  @IsDate()
  @IsOptional()
  closingDate?: Date;

  @IsDate()
  @IsOptional()
  eventDate?: Date;

  @IsBoolean()
  @IsOptional()
  gift?: boolean;
}
