import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { User } from '../users/schemas/user.schema';
import { MailService } from '../mail/mail.service';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,

    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.userModel
      .findOne({ email })
      .select('+passwordHash');

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (!user.isVerified) {
    throw new UnauthorizedException(
      'Please verify your email first',
    );
  }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user._id,
      email: user.email,
      role: user.role,
    };

    await this.mailService.sendLoginNotification(
      user.email,
      user.firstName,
    );

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  async verifyEmail(token: string) {
    try {
      const payload = this.jwtService.verify(token);

      const user = await this.userModel.findById(
        payload.userId,
      );

      if (!user) {
        throw new NotFoundException('User not found');
      }

      user.isVerified = true;

      await user.save();

      return {
        message: 'Email verified successfully',
      };
    } catch (error) {
      throw new UnauthorizedException(
        'Invalid or expired verification token',
      );
    }
  }

  async requestPasswordReset(email: string) {
    const user = await this.userModel.findOne({ email });

    if (!user) return { message: 'If email exists, link sent' };

    const token = this.jwtService.sign(
      { userId: user._id },
      { expiresIn: '10m' },
    );

    await this.mailService.sendPasswordResetLink(
      user.email,
      token,
    );

    return { message: 'Reset link sent' };
  }

  async verifyResetToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);

      return {
        message: 'Token valid',
        userId: payload.userId,
      };
    } catch {
      throw new Error('Invalid or expired token');
    }
  }

  async resetPassword(token: string, newPassword: string) {
    const payload = this.jwtService.verify(token);

    const user = await this.userModel.findById(payload.userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);

    await user.save();

    return { message: 'Password updated successfully' };
  }
  async resendVerificationEmail(email: string) {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      return { message: 'If email exists, verification sent' };
    }

    if (user.isVerified) {
      return { message: 'User already verified' };
    }

    const token = this.jwtService.sign(
      {
        userId: user._id,
        purpose: 'email-verification',
      },
      { expiresIn: '24h' },
    );

    await this.mailService.sendVerificationEmail(
      user.email,
      user.firstName,
      token,
    );

    return { message: 'Verification email sent' };
  }
  
}