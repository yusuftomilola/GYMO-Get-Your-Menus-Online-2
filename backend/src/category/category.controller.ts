import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { CategoryService } from './providers/category.service';
import { CreateCategoryDto } from './dtos/createCategory.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // CREATE A NEW CATEGORY
  @Post('new')
  public async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoryService.createCategory(createCategoryDto);
  }

  // GET ALL CATEGORIES
  @Get()
  public async getCategories() {
    return await this.categoryService.getCategories();
  }

  // GET A SINGLE CATEGORY
  @Get(':id')
  public async getSingleCategory(@Param('id', ParseIntPipe) id: number) {
    return await this.categoryService.getSingleCategory(id);
  }
}
