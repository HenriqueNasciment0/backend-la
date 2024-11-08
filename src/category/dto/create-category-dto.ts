import { IsString, IsNotEmpty, IsInt } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @IsNotEmpty()
  price: number;

  @IsString()
  description: string;

  @IsInt()
  workingMinutes: number;
}
