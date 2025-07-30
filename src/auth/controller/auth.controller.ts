import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { JwtAuthGuard } from '../../common/guard/jwt-auth.guard';
import { CurrentUser } from '../../common/decorator/current-user.decorator';
import { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<{ accessToken: string; user: User }> {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }): Promise<{ accessToken: string }> {
    return this.authService.login(body.email, body.password);
  }

  // @UseGuards(JwtAuthGuard)
  // @Get('profile')
  // async getProfile(@CurrentUser() user: User): Promise<User> {
  //   return user;
  // }
}
