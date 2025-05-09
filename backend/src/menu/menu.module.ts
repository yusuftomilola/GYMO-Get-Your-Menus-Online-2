import { Module } from '@nestjs/common';
import { MenuController } from './menu.controller';
import { MenuService } from './providers/menu.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Menu } from './entities/menu.entity';
import { MenuCleanUpProvider } from './providers/menuCleanup.provider';

@Module({
  imports: [TypeOrmModule.forFeature([Menu])],
  controllers: [MenuController],
  providers: [MenuService, MenuCleanUpProvider],
})
export class MenuModule {}
