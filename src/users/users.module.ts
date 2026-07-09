import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthModule } from '../auth/auth.module';
import { User, UserSchema } from './schemas/user.schema';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
    ]),
    AuthModule,
    MailModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}