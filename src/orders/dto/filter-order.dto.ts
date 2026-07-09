import {
  IsOptional,
  IsString,
  IsNumberString,
  IsIn,
} from 'class-validator';

export class FilterOrderDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumberString()
  minPrice?: string;

  @IsOptional()
  @IsNumberString()
  maxPrice?: string;

  @IsOptional()
  @IsIn(['pending', 'paid', 'cancelled', 'refunded'])
  status?: string;

  @IsOptional()
  @IsIn(['price', 'date'])
  sortBy?: string;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  order?: string;
}