import { User } from '@prisma/client';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

export interface UserInterface {
  createUser(data: CreateUserDto): Promise<User>;
  getAllUsers(): Promise<User[]>;
  getUserById(id: number): Promise<User | null>;
  updateUser(id: number, data: UpdateUserDto): Promise<User>;
  deleteUser(id: number): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
}
