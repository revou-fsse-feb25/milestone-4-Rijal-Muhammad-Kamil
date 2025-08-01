import { Module } from '@nestjs/common';
import { TransactionService } from './service/transaction.service';
import { TransactionController } from './controller/transaction.controller';
import { TransactionRepository } from './repository/repository';

@Module({
  controllers: [TransactionController],
  providers: [TransactionService, TransactionRepository],
})
export class TransactionModule {}
