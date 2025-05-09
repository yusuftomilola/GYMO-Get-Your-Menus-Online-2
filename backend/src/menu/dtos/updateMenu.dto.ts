import { PartialType } from '@nestjs/swagger';
import { CreateMenuDto } from './createMenu.dto';

export class UpdateMenuDto extends PartialType(CreateMenuDto) {}
