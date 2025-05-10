import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../entities/category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from '../dtos/createCategory.dto';
import { handleDatabaseError } from 'src/common/utils/handleDatabaseError';
import { Menu } from 'src/menu/entities/menu.entity';
import { UpdateCategoryDto } from '../dtos/updateCategory.dto';

@Injectable()
export class CategoryService {
  private readonly logger = new Logger(CategoryService.name);

  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,

    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
  ) {}

  // CREATE A SINGLE CATEGORY
  public async createCategory(createCategoryDto: CreateCategoryDto) {
    const { title, description, menuId } = createCategoryDto;

    try {
      // FIND IF THE CATEGORY ALREADY EXISTS
      const existingCategory = await this.categoryRepository.findOne({
        where: { title },
      });

      if (existingCategory) {
        this.logger.warn(`Category with the title "${title}" already exists`);
        throw new ConflictException('Category already exists');
      }

      // FIND IF THE MENU EXIST
      const menu = await this.menuRepository.findOne({
        where: { id: menuId, deletedAt: null },
      });

      if (!menu) {
        this.logger.warn(`Menu with id ${menuId} was not found`);
        throw new NotFoundException('Menu not found');
      }

      // CREATE THE CATEGORY WITH THE MENU IT BELONGS TO
      const category = this.categoryRepository.create({
        title,
        description,
        menu,
      });

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
    try {
      const categories = await this.categoryRepository.find({
        where: { deletedAt: null, isActive: true },
        relations: ['menu'],
      });

      if (!categories) {
        this.logger.warn('No categories found');
        throw new NotFoundException('No categories found');
      }

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
    try {
      const category = await this.categoryRepository.findOne({
        where: { id: categoryId, isActive: true, deletedAt: null },
        relations: ['menu', 'items'],
      });

      if (!category) {
        this.logger.warn(`Category with the id: ${categoryId} was not found`);
        throw new NotFoundException('Category not found');
      }

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
    try {
      // CHECK IF THE CATEGORY EXISTS
      const category = await this.categoryRepository.findOne({
        where: { id: categoryId },
      });

      if (!category) {
        this.logger.warn(`The category with id ${categoryId} was not found`);
        throw new NotFoundException('Category was not found');
      }

      // UPDATE THE CATEGORY
      Object.assign(category, updateCategoryDto);

      return await this.categoryRepository.save(category);
    } catch (error) {
      this.logger.error('Failed to update the category');
      handleDatabaseError(error, {
        message: 'Failed to update category',
        type: 'database',
      });
    }
  }
}
