import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu } from '../entities/menu.entity';
import { Repository } from 'typeorm';
import { CreateMenuDto } from '../dtos/createMenu.dto';
import { handleDatabaseError } from 'src/common/utils/handleDatabaseError';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
  ) {}

  // CREATE A NEW MENU
  public async createMenu(createMenuDto: CreateMenuDto) {
    try {
      const existingMenu = await this.menuRepository.findOneBy({
        title: createMenuDto.title,
      });

      if (existingMenu) {
        throw new ConflictException('Menu already exists');
      }

      let menu = this.menuRepository.create(createMenuDto);

      menu = await this.menuRepository.save(menu);

      return menu;
    } catch (error) {
      handleDatabaseError(error, 'Failed to create menu');
    }
  }

  // GET ALL MENUS
  public async getMenus() {
    return 'All menus';
  }

  // GET SINGLE MENU
  public async getSingleMenu() {
    return 'One menu retrieved';
  }

  // UPDATE SINGLE MENU
  public async updateMenu() {
    return 'Menu updated';
  }

  // DELETE MENU
  public async deleteMenu() {
    return 'Menu deleted';
  }
}
