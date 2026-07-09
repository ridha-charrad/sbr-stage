import {
  IsString,
  IsNumber,
  IsArray,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateProduitDto {

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  stock: number;

  @IsArray()
  @IsString({ each: true })
  genres: string[];

  @IsArray()
  @IsString({ each: true })
  platforms: string[];

  @IsOptional()
  @IsString()
  coverImage?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  galleryImages?: string[];
}