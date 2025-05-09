import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu } from '../entities/menu.entity';
import { Repository } from 'typeorm';
import { CreateMenuDto } from '../dtos/createMenu.dto';
import { handleDatabaseError } from 'src/common/utils/handleDatabaseError';
import { UpdateMenuDto } from '../dtos/updateMenu.dto';

@Injectable()
export class MenuService {
  private readonly logger = new Logger(MenuService.name);

  constructor(
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
  ) {}

  // CREATE A NEW MENU
  public async createMenu(createMenuDto: CreateMenuDto) {
    try {
      const existingMenu = await this.menuRepository.findOne({
        where: { title: createMenuDto.title },
      });

      if (existingMenu) {
        this.logger.warn(
          `Menu with title ${createMenuDto.title} already exists`,
        );
        throw new ConflictException('Menu already exists');
      }

      let menu = this.menuRepository.create(createMenuDto);

      menu = await this.menuRepository.save(menu);

      return menu;
    } catch (error) {
      this.logger.error(`Error creating menu: ${error.message}`);
      handleDatabaseError(error, {
        message: 'Failed to create menu',
        type: 'database',
      });
    }
  }

  // GET ALL MENUS
  public async getMenus() {
    try {
      const menus = await this.menuRepository.find();

      return menus;
    } catch (error) {
      this.logger.error(`Error finding menus: ${error.message}`);
      handleDatabaseError(error, {
        message: 'Error finding menus',
        type: 'database',
      });
    }
  }

  // GET SINGLE MENU
  public async getSingleMenu(menuId: number) {
    try {
      const menu = await this.menuRepository.findOne({ where: { id: menuId } });

      if (!menu) {
        this.logger.warn(`Menu with id: ${menuId} was not found`);
        throw new NotFoundException('Menu could not be found');
      }

      return menu;
    } catch (error) {
      this.logger.error(`Error retrieving menu`);
      handleDatabaseError(error, {
        message: 'An error occured retrieving the menu',
        type: 'database',
      });
    }
  }

  // UPDATE SINGLE MENU
  public async updateMenu(menuId: number, updateMenuDto: UpdateMenuDto) {
    try {
      const menu = await this.menuRepository.findOne({ where: { id: menuId } });

      if (!menu) {
        this.logger.warn(`Menu with the id ${menuId} could not be found`);
        throw new NotFoundException('Menu not found');
      }

      Object.assign(menu, updateMenuDto);

      await this.menuRepository.save(menu);

      return {
        message: 'Menu updated successfully',
        success: true,
      };
    } catch (error) {
      this.logger.error('Error saving updated menu');
      handleDatabaseError(error, {
        message: 'Error saving updated menu',
        type: 'database',
      });
    }
  }

  // DELETE MENU
  public async deleteMenu(menuId: number) {
    try {
      const menu = await this.menuRepository.findOne({
        where: { id: menuId, deletedAt: null },
      });

      if (!menu) {
        this.logger.warn(
          `Menu with id ${menuId} does not exist or has been deleted`,
        );
        throw new NotFoundException('Menu does not exist or has been deleted');
      }

      menu.deletedAt = new Date();

      await this.menuRepository.save(menu);

      return {
        message: 'Menu deleted successfully',
        success: true,
      };
    } catch (error) {
      this.logger.error('Menu could not be deleted', error.stack);
      handleDatabaseError(error, {
        message: 'Error deleting menu',
        type: 'database',
      });
    }
  }
}
