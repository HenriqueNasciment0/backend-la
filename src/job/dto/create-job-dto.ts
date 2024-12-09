import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsOptional,
  IsDate,
  IsBoolean,
  IsArray,
} from 'class-validator';

export class CreateJobDto {
  @IsInt()
  @IsOptional()
  id?: number;

  @IsInt()
  @IsNotEmpty()
  customerId: number;

  @IsArray()
  @IsInt({ each: true })
  @IsNotEmpty()
  categoryIds: number[];

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  locationIds?: number[];

  @IsArray()
  @IsOptional()
  photos?: Express.Multer.File[];

  @IsString()
  @IsNotEmpty()
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
