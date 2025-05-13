import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from '../entities/items.entity';
import { Repository } from 'typeorm';
import { CreateItemsDto } from '../dtos/createItems.dto';
import { Category } from 'src/category/entities/category.entity';
import { handleDatabaseError } from 'src/common/utils/handleDatabaseError';
import { UpdateItemsDto } from '../dtos/updateItems.dto';

@Injectable()
export class ItemsService {
  private readonly logger = new Logger(ItemsService.name);

  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  // CREATE NEW ITEM
  public async createSingleItem(createItemsDto: CreateItemsDto) {
    const { title, categoryId, description, price } = createItemsDto;
    const trimmedTitle = title;

    try {
      // check if the title exists already - Duplicate
      const existingItem = await this.itemRepository.findOne({
        where: { title: trimmedTitle },
      });

      if (existingItem) {
        this.logger.warn(`Item with title "${title}" already exist`);
        throw new ConflictException('Item already exist');
      }

      // create the item
      const item = this.itemRepository.create({
        title: trimmedTitle,
        description,
        price,
      });

      // optional - attach category if added
      // This block will only run if the categoryId is not null, undefined, 0 and false.
      if (categoryId) {
        const category = await this.categoryRepository.findOne({
          where: { id: categoryId, deletedAt: null },
        });

        if (!category) {
          this.logger.warn('Category not found');
          throw new NotFoundException('Category not found');
        }

        item.category = category;
      }

      // save and return item
      return await this.itemRepository.save(item);
    } catch (error) {
      this.logger.error(`Error creating menu item with title: ${title}`);
      handleDatabaseError(error, {
        message: 'Failed to create menu item',
        type: 'database',
      });
    }
  }

  // GET ALL ITEMS
  public async getItems() {
    try {
      const items = await this.itemRepository.find({
        where: { deletedAt: null },
        relations: ['category'],
      });

      if (!items || items.length === 0) {
        this.logger.warn('Menu items not found');
        throw new NotFoundException('No menu items found');
      }

      return items;
    } catch (error) {
      this.logger.error('Error finding menu items');
      handleDatabaseError(error, {
        message: 'Error finding menu items',
        type: 'database',
      });
    }
  }

  // GET SINGLE ITEM
  public async getSingleItem(itemId: number) {
    try {
      const item = await this.itemRepository.findOne({
        where: { id: itemId, deletedAt: null },
        relations: ['category'],
      });

      if (!item) {
        this.logger.warn('Menu item not found');
        throw new NotFoundException('No menu item found');
      }

      return item;
    } catch (error) {
      this.logger.error('Error finding menu item');
      handleDatabaseError(error, {
        message: 'Error finding menu item',
        type: 'database',
      });
    }
  }

  // UPDATE SINGLE ITEM
  public async updateSingleItem(itemId: number, updateItemDto: UpdateItemsDto) {
    const { categoryId, ...rest } = updateItemDto;

    try {
      // check if item exist
      const item = await this.itemRepository.findOne({
        where: { id: itemId, deletedAt: null },
      });

      // handle if it does not exist
      if (!item) {
        this.logger.warn(`Menu item with id: ${itemId} was not found`);
        throw new NotFoundException('Item not found');
      }

      // update basic field
      Object.assign(item, rest);

      // check if the category was updated
      // This block will only run if the categoryId is not null, undefined, 0 and false.
      if (categoryId) {
        const category = await this.categoryRepository.findOne({
          where: { id: categoryId, deletedAt: null },
        });

        if (!category) {
          this.logger.warn(`Category with id: ${categoryId} was not found`);
          throw new NotFoundException('Category not found');
        }

        item.category = category;
      }

      // save and return the items
      return await this.itemRepository.save(item);
    } catch (error) {
      this.logger.error(`Error updating item with id: ${itemId}`);
      handleDatabaseError(error, {
        message: 'Error updating menu item',
        type: 'database',
      });
    }
  }

  // DELETE ITEMS
  public async deleteSingleItem(itemId: number) {
    try {
      const item = await this.itemRepository.findOne({
        where: { id: itemId, deletedAt: null },
      });

      if (!item) {
        this.logger.warn(
          `Menu item with id: ${itemId} was not found or has been deleted`,
        );
        throw new NotFoundException('Item not found or has been deleted');
      }

      const now = new Date();
      item.deletedAt = now;
      item.isActive = false;

      await this.itemRepository.save(item);

      return {
        message: 'Item deleted successfully',
        success: true,
      };
    } catch (error) {
      this.logger.error(`Error deleting item with id: ${itemId}`);
      handleDatabaseError(error, {
        message: 'Error deleting menu item',
        type: 'database',
      });
    }
  }
}
