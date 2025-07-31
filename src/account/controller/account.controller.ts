import { Controller, Post, Get, Patch, Delete, Param, Body, UseGuards, ParseIntPipe } from '@nestjs/common';
import { AccountService } from '../service/account.service';
import { CreateAccountDto } from '../dto/create-account.dto';
import { UpdateAccountDto } from '../dto/update-account.dto';
import { Account } from '@prisma/client';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';
import { User } from '@prisma/client';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createAccount(@Body() createAccountDto: CreateAccountDto, @CurrentUser() user: User): Promise<Account> {
    return this.accountService.createAccount(createAccountDto, user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllAccounts(@CurrentUser() user: User): Promise<Account[]> {
    return this.accountService.getAllAccounts(user);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getAccountById(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: User): Promise<Account> {
    return this.accountService.getAccountById(id, user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateAccount(@Param('id', ParseIntPipe) id: number, @Body() updateAccountDto: UpdateAccountDto, @CurrentUser() user: User): Promise<Account> {
    return this.accountService.updateAccount(id, updateAccountDto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteAccount(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: User): Promise<Account> {
    return this.accountService.deleteAccount(id, user);
  }
}
