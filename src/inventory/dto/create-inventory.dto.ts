import {
  IsMongoId,
  IsString,
  IsOptional,
} from 'class-validator';

export class CreateInventoryDto {
  @IsMongoId()
  productId: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsString()
  secret: string;
}