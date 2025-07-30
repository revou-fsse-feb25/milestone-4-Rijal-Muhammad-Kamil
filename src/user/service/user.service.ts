import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { UserRepository } from '../repository/repository';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  // Mengambil data pengguna berdasarkan ID (memeriksa jika ID pengguna yang login sesuai)
  async getUser(id: number, currentUserId: number): Promise<User> {
    if (id !== currentUserId) {
      throw new ForbiddenException('Anda hanya bisa melihat data Anda sendiri');
    }

    const user = await this.userRepository.getUserById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  // Mengambil semua pengguna (memeriksa role admin)
  async getAllUsers(currentUser: User): Promise<User[]> {
    if (currentUser.role !== 'ADMIN') {
      throw new ForbiddenException('Hanya admin yang dapat mengakses semua pengguna');
    }

    const users = await this.userRepository.getAllUsers();

    if (!users || users.length === 0) {
      throw new NotFoundException('No users found');
    }

    return users;
  }

  // Memperbarui data pengguna berdasarkan ID (memeriksa jika ID pengguna yang login sesuai)
  async updateUser(id: number, updateUserDto: UpdateUserDto, currentUserId: number): Promise<User> {
    if (id !== currentUserId) {
      throw new ForbiddenException('Anda hanya bisa memperbarui data Anda sendiri');
    }

    const user = await this.userRepository.getUserById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.userRepository.updateUser(id, updateUserDto);  // Memperbarui pengguna
  }
}
