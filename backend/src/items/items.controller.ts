import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { ItemsService } from './providers/items.service';
import { CreateItemsDto } from './dtos/createItems.dto';
import { UpdateItemsDto } from './dtos/updateItems.dto';

@Controller('items')
@ApiTags('Menu Items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  // CREATE ITEM
  @Post('new')
  @ApiOperation({ summary: 'Create a new menu item' })
  @ApiResponse({ status: 201, description: 'Item created successfully' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiBody({ type: CreateItemsDto })
  public async createSingleItem(@Body() createItemDto: CreateItemsDto) {
    return await this.itemsService.createSingleItem(createItemDto);
  }

  // GET ALL ITEMS
  @Get()
  @ApiOperation({ summary: 'Retrieve all menu items' })
  @ApiResponse({ status: 200, description: 'List of menu items retrieved' })
  public async getItems() {
    return await this.itemsService.getItems();
  }

  // GET SINGLE ITEM
  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a single menu item by ID' })
  @ApiResponse({ status: 200, description: 'Menu item retrieved' })
  @ApiResponse({ status: 404, description: 'Menu item not found' })
  @ApiParam({ name: 'id', type: Number, description: 'ID of the menu item' })
  public async getSingleItem(@Param('id', ParseIntPipe) id: number) {
    return await this.itemsService.getSingleItem(id);
  }

  // UPDATE ITEM
  @Patch(':id/edit')
  @ApiOperation({ summary: 'Update a menu item by ID' })
  @ApiResponse({ status: 200, description: 'Item updated successfully' })
  @ApiResponse({ status: 404, description: 'Item or category not found' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID of the item to update',
  })
  @ApiBody({ type: UpdateItemsDto })
  public async updateSingleItem(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateItemDto: UpdateItemsDto,
  ) {
    return await this.itemsService.updateSingleItem(id, updateItemDto);
  }

  // DELETE ITEM
  @Delete(':id/delete')
  @ApiOperation({ summary: 'Soft delete a menu item by ID' })
  @ApiResponse({ status: 200, description: 'Item deleted successfully' })
  @ApiResponse({
    status: 404,
    description: 'Item not found or already deleted',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID of the item to delete',
  })
  public async deleteSingleItem(@Param('id', ParseIntPipe) id: number) {
    return await this.itemsService.deleteSingleItem(id);
  }
}
