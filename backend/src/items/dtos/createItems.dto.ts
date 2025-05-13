import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateItemsDto {
  @ApiProperty({
    description: 'The title of the item',
    example: 'Chicken Pizza',
    minLength: 3,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  title: string;

  @ApiPropertyOptional({
    description: 'A short description of the item',
    example: 'Grilled chicken with spicy sauce',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Price of the item in Naira or chosen currency',
    example: 2500,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiPropertyOptional({
    description: 'Category ID this item belongs to',
    example: 3,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  categoryId?: number;
}
