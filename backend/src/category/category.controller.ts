import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { CategoryService } from './providers/category.service';
import { CreateCategoryDto } from './dtos/createCategory.dto';
import { UpdateCategoryDto } from './dtos/updateCategory.dto';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
// import { CacheInterceptor } from '@nestjs/cache-manager';

// @UseInterceptors(CacheInterceptor)
@Controller('category')
@ApiTags('Menu Categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('clear-cache')
  public async clearCache() {
    return await this.categoryService.clearCache();
  }

  // CREATE A NEW CATEGORY
  @Post('new')
  @ApiOperation({
    summary: 'Create a new category',
    description:
      'Creates a new category with a title, optional description, and optional related menu and item IDs.',
  })
  @ApiResponse({
    status: 201,
    description: 'The category was created successfully.',
  })
  @ApiBadRequestResponse({
    description: 'Invalid request body. Validation failed.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Server error while creating category.',
  })
  public async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoryService.createCategory(createCategoryDto);
  }

  // GET ALL CATEGORIES
  @Get()
  @ApiOperation({
    summary: 'Get all categories',
    description: 'Retrieves a list of all categories in the system.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of categories retrieved successfully.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Server error while fetching categories.',
  })
  public async getCategories() {
    return await this.categoryService.getCategories();
  }

  // GET A SINGLE CATEGORY
  @Get(':id')
  @ApiOperation({
    summary: 'Get a specific category by ID',
    description: 'Retrieves a category by its ID, if it exists.',
  })
  @ApiResponse({
    status: 200,
    description: 'Category retrieved successfully.',
  })
  @ApiNotFoundResponse({
    description: 'Category with the given ID was not found.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Server error while fetching the category.',
  })
  public async getSingleCategory(@Param('id', ParseIntPipe) id: number) {
    return await this.categoryService.getSingleCategory(id);
  }

  // UPDATE A SINGLE CATEGORY
  @Patch(':id/edit')
  @ApiOperation({
    summary: 'Update a category by ID',
    description:
      'Updates the title, description, or associated menus/items of an existing category.',
  })
  @ApiResponse({
    status: 200,
    description: 'Category updated successfully.',
  })
  @ApiBadRequestResponse({
    description: 'Invalid update data.',
  })
  @ApiNotFoundResponse({
    description: 'Category not found or already deleted.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Server error while updating the category.',
  })
  public async updateSingleCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return await this.categoryService.updateSingleCategory(
      id,
      updateCategoryDto,
    );
  }

  // DELETE A SINGLE CATEGORY
  @Delete(':id/delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Soft-delete a category by ID',
    description:
      'Marks the category as deleted by setting `deletedAt` and disabling it. It is not permanently removed.',
  })
  @ApiResponse({
    status: 204,
    description: 'Category deleted successfully (no content).',
  })
  @ApiNotFoundResponse({
    description: 'Category not found or already deleted.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Server error while deleting the category.',
  })
  public async deleteSingleCategory(@Param('id', ParseIntPipe) id: number) {
    return await this.categoryService.deleteSingleCategory(id);
  }
}
