import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  findAll() {
    return this.userModel.find();
  }

  findOne(id: string) {
    return this.userModel.findById(id);
  }

  create(data: CreateUserDto) {
    return this.userModel.create(data);
  }

  update(id: string, data: UpdateUserDto) {
    return this.userModel.findByIdAndUpdate(id, data, {
      new: true,
    });
  }

  remove(id: string) {
    return this.userModel.findByIdAndDelete(id);
  }
}