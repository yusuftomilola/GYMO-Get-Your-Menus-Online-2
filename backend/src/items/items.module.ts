import { Module } from '@nestjs/common';
import { ItemsController } from './items.controller';
import { ItemsService } from './providers/items.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './entities/items.entity';
import { Category } from 'src/category/entities/category.entity';
import { ItemCleanUpProvider } from './providers/itemCleanup.provider';

@Module({
  imports: [TypeOrmModule.forFeature([Item, Category])],
  controllers: [ItemsController],
  providers: [ItemsService, ItemCleanUpProvider],
})
export class ItemsModule {}
