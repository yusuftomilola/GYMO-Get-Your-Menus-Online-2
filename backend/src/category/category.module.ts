import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './providers/category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Menu } from 'src/menu/entities/menu.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Menu])],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
