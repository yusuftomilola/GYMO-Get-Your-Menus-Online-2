import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './providers/category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Menu } from 'src/menu/entities/menu.entity';
import { Item } from 'src/items/entities/items.entity';
import { CategoryCleanUpProvider } from './providers/categoryCleanup.provider';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Menu, Item])],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryCleanUpProvider],
})
export class CategoryModule {}
