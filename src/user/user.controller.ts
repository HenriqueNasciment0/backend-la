import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Prisma } from '@prisma/client';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getUsers() {
    return this.userService.getUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.userService.getUserById({ id: Number(id) });
  }

  @Post()
  createUser(@Body() data: CreateUserDto) {
    return this.userService.createUser(data);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() data: Prisma.UserUpdateInput) {
    return this.userService.updateUser({
      where: { id: Number(id) },
      data,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser({ id: Number(id) });
  }
}
