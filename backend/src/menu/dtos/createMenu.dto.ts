import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateMenuDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @ApiProperty({
    example: 'African Cuisine',
    description: 'the title of the menu',
  })
  title: string;

  @IsString()
  @IsOptional()
  @MinLength(10)
  @ApiPropertyOptional({
    example: 'The best african cuisine to suite your tastebuds',
    description: 'The description of the menu',
  })
  description?: string;
}
