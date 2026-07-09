import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { User } from './schemas/user.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('findall')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('findall')
  findAll() {
   return this.usersService.findAll();
  }

  @Get('findone/:id')
  @Get('findall')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('findall')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }


  @Post('create')
  create(@Body() body: CreateUserDto) {
    return this.usersService.create(body);
  }

  @Put('update/:id')
  @UseGuards(JwtAuthGuard)
  @Put('me')
  updateMe(@Req() req, @Body() body: UpdateUserDto) {
    return this.usersService.update(req.user.userId, body);
  }

  @Delete('delete/:id')
  @Get('findall')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('findall')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Put('role/:id')
  changeRole(
    @Param('id') id: string,
    @Body() body: { role: 'user' | 'admin' | 'vendor' }
  ) {
    return this.usersService.changeRole(id, body.role);
  }

}