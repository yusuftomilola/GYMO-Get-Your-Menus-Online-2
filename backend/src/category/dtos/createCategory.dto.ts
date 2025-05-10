import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'The title of the category',
    example: 'Lunch Specials',
    minLength: 3,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  title: string;

  @ApiPropertyOptional({
    description: 'A short description of the category',
    example: 'Delicious dishes served during lunch hours',
    minLength: 10,
  })
  @IsString()
  @IsOptional()
  @MinLength(10)
  description?: string;

  @ApiPropertyOptional({
    description: 'Array of menu IDs associated with this category',
    example: [1, 2],
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  menuIds?: number[];

  @ApiPropertyOptional({
    description: 'Array of item IDs associated with this category',
    example: [10, 11, 12],
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  itemIds?: number[];
}
