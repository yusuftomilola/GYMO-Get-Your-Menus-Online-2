import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MenuModule } from './menu/menu.module';
import { ItemsModule } from './items/items.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [MenuModule, ItemsModule, CategoryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
