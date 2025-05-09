import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu } from '../entities/menu.entity';
import { LessThan, Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class MenuCleanUpProvider {
  private readonly logger = new Logger(MenuCleanUpProvider.name);

  constructor(
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
  ) {}

  @Cron(CronExpression.EVERY_WEEK)
  public async removeOldDeletedMenus() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    try {
      const oldMenus = await this.menuRepository.find({
        where: { deletedAt: LessThan(thirtyDaysAgo) },
      });

      if (oldMenus.length > 0) {
        await this.menuRepository.remove(oldMenus);
      }
    } catch (error) {
      this.logger.error('Failed to delete old menus', error.stack);
    }
  }
}
