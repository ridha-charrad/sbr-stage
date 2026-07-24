import {
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';

import { Type } from 'class-transformer';
import { CreateInventoryDto } from './create-inventory.dto';

export class BulkCreateInventoryDto {

  @ValidateNested({ each: true })
  @Type(() => CreateInventoryDto)
  @ArrayMinSize(1)
  items: CreateInventoryDto[];
}