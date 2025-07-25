// import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
// import { AuthService } from '../service/auth.service';
// import { CreateUserDto } from 'src/user/dto/create-user.dto';
// import { UpdateUserDto } from 'src/user/dto/update-user.dto';

// @Controller('auth')
// export class AuthController {
//   constructor(private readonly authService: AuthService) {}

//   @Post()
//   create(@Body() CreateUserDto: CreateUserDto) {
//     return this.authService.create(CreateUserDto);
//   }

//   @Get()
//   findAll() {
//     return this.authService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.authService.findOne(+id);
//   }

//   @Patch(':id')
//   update(@Param('id') id: string, @Body() UpdateUserDto: UpdateUserDto) {
//     return this.authService.update(+id, UpdateUserDto);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.authService.remove(+id);
//   }
// }
