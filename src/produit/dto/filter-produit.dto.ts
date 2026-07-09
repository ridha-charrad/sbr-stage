import { IsOptional, IsString, IsNumberString, IsIn} from 'class-validator';
import { Transform } from 'class-transformer';
import { IsBoolean } from 'class-validator';


export class FilterProduitDto {
  @IsOptional()
  @IsString()
  name?: string;

    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => value === 'true')
    stock?: boolean;
  // comma-separated values: Action,RPG,FPS
  @IsOptional()
  @IsString()
  genres?: string;

  // comma-separated values: PC,PS5
  @IsOptional()
  @IsString()
  platforms?: string;

  @IsOptional()
  @IsNumberString()
  minPrice?: string;

  @IsOptional()
  @IsNumberString()
  maxPrice?: string;

  // price | salesCount | name
  @IsOptional()
  @IsIn(['price', 'salesCount', 'name'])
  sortBy?: string;

  // asc | desc
  @IsOptional()
  @IsIn(['asc', 'desc'])
  order?: string;
}