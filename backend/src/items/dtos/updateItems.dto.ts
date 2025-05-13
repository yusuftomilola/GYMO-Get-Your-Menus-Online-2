import { PartialType } from '@nestjs/swagger';
import { CreateItemsDto } from './createItems.dto';

export class UpdateItemsDto extends PartialType(CreateItemsDto) {}
