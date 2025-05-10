import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../entities/category.entity';
import { LessThan, Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class CategoryCleanUpProvider {
  private readonly logger = new Logger(CategoryCleanUpProvider.name);

  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  @Cron(CronExpression.EVERY_WEEK)
  public async removeOldDeletedCategories() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    try {
      const oldCategories = await this.categoryRepository.find({
        where: { deletedAt: LessThan(thirtyDaysAgo) },
      });

      if (oldCategories.length > 0) {
        await this.categoryRepository.remove(oldCategories);
      }
    } catch (error) {
      this.logger.error('Failed to delete old categories', error.stack);
    }
  }
}
