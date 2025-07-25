import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from 'src/user/repository/repository';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, password: string): Promise<{ accessToken: string }> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
    };
  }

  async register(createUserDto: CreateUserDto): Promise<{ accessToken: string, user: User }> {
    const existingUser = await this.userRepository.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new UnauthorizedException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const newUser = await this.userRepository.createUser({
      email: createUserDto.email,
      password: hashedPassword,
      name: createUserDto.name,
    });

    const payload = { sub: newUser.id, email: newUser.email, role: newUser.role };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: newUser,
    };
  }
}
