import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/service/prisma.service';
import { UserInterface } from './repository.interface';
import { User } from '@prisma/client';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class UserRepository implements UserInterface {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(data: CreateUserDto): Promise<User> {
    try {
      return await this.prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          password: data.password,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new HttpException('Email sudah terdaftar', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Gagal membuat user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      return await this.prisma.user.findMany();
    } catch (error) {
      throw new HttpException('Gagal mengambil data users', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getUserById(id: number): Promise<User | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new HttpException('User tidak ditemukan', HttpStatus.NOT_FOUND);
      }

      return user;
    } catch (error) {
      throw new HttpException('Gagal mengambil data user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateUser(id: number, data: UpdateUserDto): Promise<User> {
    try {
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data,
      });

      return updatedUser;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new HttpException('User tidak ditemukan', HttpStatus.NOT_FOUND);
      }
      throw new HttpException('Gagal memperbarui user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteUser(id: number): Promise<User> {
    try {
      const deletedUser = await this.prisma.user.delete({
        where: { id },
      });

      return deletedUser;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new HttpException('User tidak ditemukan', HttpStatus.NOT_FOUND);
      }
      throw new HttpException('Gagal menghapus user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
      });

      return user;
    } catch (error) {
      throw new HttpException('Error saat mencari user berdasarkan email', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
