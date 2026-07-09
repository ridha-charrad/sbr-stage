import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { JwtStrategy } from './jwt.strategy';

import { User, UserSchema } from '../users/schemas/user.schema';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'super-secret-key',
      signOptions: { expiresIn: '1d' },
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
    ]),
    MailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtModule],
})
export class AuthModule {}