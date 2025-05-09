import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { MenuService } from './providers/menu.service';
import { CreateMenuDto } from './dtos/createMenu.dto';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  // CREATE A NEW MENU
  @Post('new')
  public async createMenu(@Body() createMenuDto: CreateMenuDto) {
    return await this.menuService.createMenu(createMenuDto);
  }

  // GET ALL MENUS
  @Get()
  public async getAllMenus() {
    return await this.menuService.getMenus();
  }

  // GET SINGLE MENU
  @Get(':id')
  public async getSingleMenu() {
    return await this.menuService.getSingleMenu();
  }

  // UPDATE SINGLE MENU
  @Patch(':id')
  public async updateMenu() {
    return await this.menuService.updateMenu();
  }

  // DELETE MENU
  @Delete(':id')
  public async deleteMenu() {
    return await this.menuService.deleteMenu();
  }
}
