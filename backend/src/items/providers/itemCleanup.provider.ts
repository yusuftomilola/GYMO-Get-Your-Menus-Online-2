import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from '../entities/items.entity';
import { LessThan, Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class ItemCleanUpProvider {
  private readonly logger = new Logger(ItemCleanUpProvider.name);

  constructor(
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>,
  ) {}

  @Cron(CronExpression.EVERY_WEEK)
  public async removeOldDeletedItems() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    try {
      const oldItems = await this.itemsRepository.find({
        where: { deletedAt: LessThan(thirtyDaysAgo) },
      });

      if (oldItems.length > 0) {
        await this.itemsRepository.remove(oldItems);
      }
    } catch (error) {
      this.logger.error('Failed to delete old items', error.stack);
    }
  }
}
