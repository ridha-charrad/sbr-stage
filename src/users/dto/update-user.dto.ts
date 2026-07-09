export class UpdateUserDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  birthDate?: Date;
  role?: 'user' | 'admin' | 'vendor';
}