import { Controller, Param, Body, Patch, Get, UseGuards, ParseIntPipe } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { JwtAuthGuard } from '../../common/guard/jwt-auth.guard';
import { CurrentUser } from '../../common/decorator/current-user.decorator';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '@prisma/client';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getUserById(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: User) {
    return this.userService.getUser(id, user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateUser(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto, @CurrentUser() user: User) {
    return this.userService.updateUser(id, updateUserDto, user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllUsers(@CurrentUser() user: User): Promise<User[]> {
    return this.userService.getAllUsers(user);
  }
}
