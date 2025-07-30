import { Controller, Param, Body, Patch, Get, UseGuards } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { JwtAuthGuard } from '../../common/guard/jwt-auth.guard';  // Guard untuk memastikan pengguna terautentikasi
import { CurrentUser } from '../../common/decorator/current-user.decorator';  // Decorator untuk mengambil pengguna yang terautentikasi
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '@prisma/client';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Endpoint untuk mendapatkan data pengguna berdasarkan ID (Hanya bisa melihat data sendiri)
  @Get(':id')
  @UseGuards(JwtAuthGuard)  // Guard untuk memastikan pengguna terautentikasi
  async getUserById(
    @Param('id') id: number,  // ID yang diminta untuk diambil datanya
    @CurrentUser() user: User,  // Data pengguna yang terautentikasi
  ) {
    return this.userService.getUser(id, user.id);  // Mengirimkan ID pengguna yang login untuk validasi
  }

  // Endpoint untuk memperbarui data pengguna berdasarkan ID (Hanya bisa memperbarui data sendiri)
  @Patch(':id')
  @UseGuards(JwtAuthGuard)  // Guard untuk memastikan pengguna terautentikasi
  async updateUser(
    @Param('id') id: number,  // ID pengguna yang ingin diperbarui
    @Body() updateUserDto: UpdateUserDto,  // Data pembaruan pengguna
    @CurrentUser() user: User,  // Data pengguna yang terautentikasi
  ) {
    return this.userService.updateUser(id, updateUserDto, user.id);  // Mengirimkan ID pengguna yang login untuk validasi
  }

  // Endpoint untuk mengambil semua pengguna - Hanya admin yang bisa mengakses
  @Get()
  @UseGuards(JwtAuthGuard)  // Guard untuk memastikan pengguna terautentikasi
  async getAllUsers(@CurrentUser() user: User): Promise<User[]> {
    return this.userService.getAllUsers(user);  // Mengirimkan data pengguna yang terautentikasi ke service untuk validasi role admin
  }
}
