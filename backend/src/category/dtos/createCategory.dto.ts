import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  title: string;

  @IsString()
  @IsOptional()
  @MinLength(10)
  description?: string;

  @IsOptional()
  @IsNumber()
  menuId?: number;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  itemIds?: number[];
}
