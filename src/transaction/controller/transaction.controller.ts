import { Controller, Post, Get, Param, Body, UseGuards, ParseIntPipe } from '@nestjs/common';
import { TransactionService } from '../service/transaction.service';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';
import { User } from '@prisma/client';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('deposit')
  @UseGuards(JwtAuthGuard)
  async deposit(@Body() data: CreateTransactionDto, @CurrentUser() user: User) {
    return this.transactionService.deposit(data, user);
  }

  @Post('withdraw')
  @UseGuards(JwtAuthGuard)
  async withdraw(@Body() data: CreateTransactionDto, @CurrentUser() user: User) {
    return this.transactionService.withdraw(data, user);
  }

  @Post('transfer')
  @UseGuards(JwtAuthGuard)
  async transfer(@Body() data: CreateTransactionDto, @CurrentUser() user: User) {
    return this.transactionService.transfer(data, user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllTransactions(@CurrentUser() user: User) {
    return this.transactionService.getUserTransactions(user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getTransactionById(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: User) {
    return this.transactionService.getTransactionById(id, user);
  }
}
