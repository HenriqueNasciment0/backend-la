import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Prisma } from '@prisma/client';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUsers() {
    return this.userService.getUsers();
  }

  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.userService.getUserById({ id: Number(id) });
  }

  @Post()
  createUser(@Body() data: { name: string; email: string; password: string }) {
    return this.userService.createUser(data);
  }

  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() data: Prisma.UserUpdateInput) {
    return this.userService.updateUser({
      where: { id: Number(id) },
      data,
    });
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser({ id: Number(id) });
  }
}
