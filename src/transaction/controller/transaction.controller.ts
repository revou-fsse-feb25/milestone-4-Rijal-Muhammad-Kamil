import { Controller, Post, Get, Param, Body, UseGuards, ParseIntPipe } from '@nestjs/common';
import { TransactionService } from '../service/transaction.service';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';
import { User } from '@prisma/client';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  // Endpoint untuk melakukan deposit
  @Post('deposit')
  @UseGuards(JwtAuthGuard)
  async deposit(@Body() data: CreateTransactionDto, @CurrentUser() user: User) {
    return this.transactionService.deposit(data, user);
  }

  // Endpoint untuk melakukan withdraw
  @Post('withdraw')
  @UseGuards(JwtAuthGuard)
  async withdraw(@Body() data: CreateTransactionDto, @CurrentUser() user: User) {
    return this.transactionService.withdraw(data, user);
  }

  // Endpoint untuk melakukan transfer antar akun
  @Post('transfer')
  @UseGuards(JwtAuthGuard)
  async transfer(@Body() data: CreateTransactionDto, @CurrentUser() user: User) {
    return this.transactionService.transfer(data, user);
  }

  // Endpoint untuk mendapatkan semua transaksi pengguna
  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllTransactions(@CurrentUser() user: User) {
    return this.transactionService.getUserTransactions(user.id);
  }

  // Endpoint untuk mendapatkan transaksi berdasarkan ID
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getTransactionById(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: User) {
    return this.transactionService.getTransactionById(id, user);
  }
}
