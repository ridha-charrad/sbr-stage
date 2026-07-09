import { Injectable, NotFoundException , ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,

    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  findAll() {
    return this.userModel.find();
  }

  findOne(id: string) {
    return this.userModel.findById(id);
  }

  async create(data: CreateUserDto) {
    console.log("CREATE USER DATA:", data);  
    const existingUser = await this.userModel.findOne({
    email: data.email,
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);


    const newUser = await this.userModel.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      birthDate: data.birthDate,
      role: data.role || 'user',
      passwordHash: hashedPassword,
      isVerified: false,
    });


    const verificationToken = this.jwtService.sign(
      {
        userId: newUser._id,
        purpose: 'email-verification',
      },
      {
        expiresIn: '24h',
      },
    );

    await this.mailService.sendVerificationEmail(
      newUser.email,
      newUser.firstName,
      verificationToken,
    );

    return {
      message:
        'Account created successfully. Please verify your email.',
    };
  }

  async update(id: string, data: UpdateUserDto) {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      data,
      { new: true },
    );

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    await this.mailService.sendUpdateNotification(
      updatedUser.email,
      updatedUser.firstName,
    );

    return updatedUser;
  }

  async changeRole(
    userId: string,
    role: 'user' | 'admin' | 'vendor',
  ) {
    return this.userModel.findByIdAndUpdate(
      userId,
      { role },
      { new: true },
    );
  }


  async remove(userId: string) {
    const deletedUser = await this.userModel.findByIdAndDelete(userId);

    if (!deletedUser) {
      throw new Error('User not found');
    }

    return {
      message: 'User deleted successfully',
      deletedUser,
    };
  }
}