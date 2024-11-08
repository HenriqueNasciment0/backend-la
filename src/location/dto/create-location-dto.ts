import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreateLocationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsOptional()
  coordinates?: string;

  @IsInt()
  @IsNotEmpty()
  displacementRate: number;

  @IsBoolean()
  @IsNotEmpty()
  freeSite: boolean;

  @IsBoolean()
  @IsNotEmpty()
  outOfState: boolean;

  @IsBoolean()
  @IsNotEmpty()
  outOfCountry: boolean;
}
