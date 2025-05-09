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
import { MenuService } from './providers/menu.service';
import { CreateMenuDto } from './dtos/createMenu.dto';
import { UpdateMenuDto } from './dtos/updateMenu.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('menu')
@ApiTags('Menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  // CREATE A NEW MENU
  @Post('new')
  @ApiOperation({
    summary: 'Create a new menu',
    description: 'Creating a new menu',
  })
  @ApiResponse({
    status: 201,
    description: 'Menu created successfully',
  })
  public async createMenu(@Body() createMenuDto: CreateMenuDto) {
    return await this.menuService.createMenu(createMenuDto);
  }

  // GET ALL MENUS
  @Get()
  @ApiOperation({
    summary: 'Get all menu',
    description: 'retrieve all the menu in the database',
  })
  @ApiResponse({
    status: 200,
    description: 'Menus retrieved successfully',
  })
  public async getAllMenus() {
    return await this.menuService.getMenus();
  }

  // GET SINGLE MENU
  @Get(':id')
  @ApiOperation({
    summary: 'get single menu',
    description: 'retrieve a single menu',
  })
  @ApiResponse({
    status: 200,
    description: 'Menu retrieved successfully',
  })
  public async getSingleMenu(@Param('id', ParseIntPipe) id: number) {
    return await this.menuService.getSingleMenu(id);
  }

  // UPDATE SINGLE MENU
  @Patch(':id')
  @ApiOperation({
    summary: 'update menu',
    description: 'update a single menu',
  })
  @ApiResponse({
    status: 200,
    description: 'Menu updated successfully',
  })
  public async updateMenu(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMenuDto: UpdateMenuDto,
  ) {
    return await this.menuService.updateMenu(id, updateMenuDto);
  }

  // DELETE MENU
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete menu',
    description: 'Delete a single menu',
  })
  @ApiResponse({
    status: 200,
    description: 'Menu deleted successfully',
  })
  public async deleteMenu(@Param('id', ParseIntPipe) id: number) {
    return await this.menuService.deleteMenu(id);
  }
}
