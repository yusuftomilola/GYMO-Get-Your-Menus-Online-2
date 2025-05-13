import {
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../entities/category.entity';
import { In, Repository } from 'typeorm';
import { CreateCategoryDto } from '../dtos/createCategory.dto';
import { handleDatabaseError } from 'src/common/utils/handleDatabaseError';
import { Menu } from 'src/menu/entities/menu.entity';
import { UpdateCategoryDto } from '../dtos/updateCategory.dto';
import { Item } from 'src/items/entities/items.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CategoryService {
  private readonly logger = new Logger(CategoryService.name);

  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,

    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,

    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  // CREATE A SINGLE CATEGORY
  public async createCategory(createCategoryDto: CreateCategoryDto) {
    const { title, description, menuId, itemIds } = createCategoryDto;

    try {
      // FIND IF THE CATEGORY ALREADY EXISTS
      const existingCategory = await this.categoryRepository.findOne({
        where: { title },
      });

      if (existingCategory) {
        this.logger.warn(`Category with the title "${title}" already exists`);
        throw new ConflictException('Category already exists');
      }

      // CREATE THE CATEGORY
      const category = this.categoryRepository.create({
        title,
        description,
      });

      // For numbers: null, undefined, 0, false are all NEGATIVE

      // ATTACH MENU IF THE MENU EXIST
      if (menuId && menuId !== null) {
        const menu = await this.menuRepository.findOne({
          where: { id: menuId, deletedAt: null },
        });

        if (!menu) {
          this.logger.warn(`Menu was not found`);
          throw new NotFoundException('Menu not found');
        }

        category.menu = menu;
      }

      // ATTACH ITEMS IF ITEMS ARE ADDED
      if (Array.isArray(itemIds) && itemIds.length > 0) {
        const newItems = await this.itemsRepository.find({
          where: { id: In(itemIds), deletedAt: null },
        });

        if (newItems.length !== itemIds.length) {
          this.logger.warn('Some items not found');
          throw new NotFoundException('Item not found');
        }

        category.items = newItems;
      }

      return await this.categoryRepository.save(category);
    } catch (error) {
      this.logger.error(
        `Failed to create a new category with title "${title}"`,
      );
      handleDatabaseError(error, {
        message: 'Error creating category',
        type: 'database',
      });
    }
  }

  // GET ALL CETEGORIES
  public async getCategories() {
    const cachedCategories = await this.cacheManager.get('categories');

    if (cachedCategories) {
      console.log('Cached categories');
      return cachedCategories;
    }

    try {
      const categories = await this.categoryRepository.find({
        where: { deletedAt: null, isActive: true },
        relations: ['menu'],
      });

      if (!categories) {
        this.logger.warn('No categories found');
        throw new NotFoundException('No categories found');
      }

      await this.cacheManager.set('categories', categories);

      console.log('Database categories');
      return categories;
    } catch (error) {
      this.logger.error('Error finding categories');
      handleDatabaseError(error, {
        message: 'Error finding categories',
        type: 'database',
      });
    }
  }

  // GET A SINGLE CATEGORY
  public async getSingleCategory(categoryId: number) {
    const cachedCategory = await this.cacheManager.get('category');

    if (cachedCategory) {
      console.log('Category from Cache');
      return cachedCategory;
    }

    try {
      const category = await this.categoryRepository.findOne({
        where: { id: categoryId, isActive: true, deletedAt: null },
        relations: ['menu', 'items'],
      });

      if (!category) {
        this.logger.warn(`Category with the id: ${categoryId} was not found`);
        throw new NotFoundException('Category not found');
      }

      await this.cacheManager.set('category', category);
      console.log('Category from Database');

      return category;
    } catch (error) {
      this.logger.error(`Error finding the category with id ${categoryId}`);
      handleDatabaseError(error, {
        message: 'Error finding category',
        type: 'database',
      });
    }
  }

  // UPDATE A SINGLE CATEGORY
  public async updateSingleCategory(
    categoryId: number,
    updateCategoryDto: UpdateCategoryDto,
  ) {
    const { menuId, itemIds, ...rest } = updateCategoryDto;

    try {
      // CHECK IF THE CATEGORY EXISTS
      const category = await this.categoryRepository.findOne({
        where: { id: categoryId },
        relations: ['items', 'menus'],
      });

      if (!category) {
        this.logger.warn(`The category with id ${categoryId} was not found`);
        throw new NotFoundException('Category was not found');
      }

      // UPDATE THE CATEGORY BASE FIELDS
      Object.assign(category, rest);

      // NOTE TO SELF
      // ON THE FRONTEND.....

      // 1. If menuIds is undefined, this means the menu was not edited and an undefined is sent for the menuIds in the dto, so menu updates will be skipped - undefined is "falsy"

      // 2. If menuIds is [], this means the menu was edited and the user removed all the previous menus in the category. So an empty array of [] is sent in the dto, so previous menus are removed to [] - An empty array is "truthy"

      // 3. If menuIds has values, this means the menu was edited by the user and it is greater than 0 so the else block will happen.

      // UPDATE MENU IF IT WAS CHANGED
      if (menuId !== undefined) {
        if (menuId === null) {
          category.menu = null;
        } else {
          const menu = await this.menuRepository.findOne({
            where: { id: menuId, deletedAt: null },
          });

          if (!menu) {
            this.logger.warn(`Some menus not found`);
            throw new NotFoundException('Menu not found');
          }

          category.menu = menu;
        }
      }

      // UPDATE THE ITEMS IF IT WAS UPDATED OR SKIP
      if (itemIds) {
        if (itemIds.length === 0) {
          category.items = [];
        } else {
          const newItems = await this.itemsRepository.find({
            where: { id: In(itemIds), deletedAt: null },
          });

          if (newItems.length !== itemIds.length) {
            this.logger.warn('Some items not found');
            throw new NotFoundException('Item not found');
          }

          category.items = newItems;
        }
      }

      return await this.categoryRepository.save(category);
    } catch (error) {
      this.logger.error('Failed to update the category');
      handleDatabaseError(error, {
        message: 'Failed to update category',
        type: 'database',
      });
    }
  }

  // DELETE A SINGLE CATEGORY
  public async deleteSingleCategory(categoryId: number) {
    try {
      const category = await this.categoryRepository.findOne({
        where: { id: categoryId, deletedAt: null },
      });

      if (!category) {
        this.logger.warn(
          `The category with id: ${categoryId} was not found or has been deleted`,
        );
        throw new NotFoundException('Category not found or has been deleted');
      }

      category.deletedAt = new Date();
      category.isActive = false;

      await this.categoryRepository.save(category);

      return {
        message: 'Category deleted successfully',
        success: true,
      };
    } catch (error) {
      this.logger.error(`Failed to delete category`);
      handleDatabaseError(error, {
        message: 'Failed to delete category',
        type: 'database',
      });
    }
  }
}
