import { Controller, Get, Put, Body, Param } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { UserUpdateInput } from '../types/user.types';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get(':id')
  async getUser(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateData: UserUpdateInput,
  ) {
    return this.userService.updateUser(id, updateData);
  }
}
