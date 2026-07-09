import {
  IsString,
  IsEmail,
  IsDateString,
  IsOptional,
  IsIn,
} from 'class-validator';

export class CreateUserDto {

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  phoneNumber: string;

  @IsDateString()
  birthDate: Date;

  @IsString()
  password: string;

  @IsOptional()
  @IsIn(['user', 'admin', 'vendor', 'support'])
  role?: 'user' | 'admin' | 'vendor' | 'support';
}