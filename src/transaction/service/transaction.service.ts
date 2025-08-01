import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { TransactionRepository } from '../repository/repository';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { Transaction } from '@prisma/client';

@Injectable()
export class TransactionService {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async deposit(data: CreateTransactionDto, user: any): Promise<Transaction> {
    const account = await this.transactionRepository.getAccountById(data.sourceAccountId);

    if (!account) {
      throw new NotFoundException('Akun sumber tidak ditemukan');
    }

    if (account.userId !== user.id) {
      throw new ForbiddenException('Anda hanya bisa melakukan deposit pada akun Anda sendiri');
    }

    try {
      return await this.transactionRepository.deposit(data);
    } catch (error) {
      throw new BadRequestException('Terjadi kesalahan saat memproses transaksi deposit');
    }
  }

  async withdraw(data: CreateTransactionDto, user: any): Promise<Transaction> {
    const account = await this.transactionRepository.getAccountById(data.sourceAccountId);

    if (!account) {
      throw new NotFoundException('Akun sumber tidak ditemukan');
    }

    if (account.userId !== user.id) {
      throw new ForbiddenException('Anda hanya bisa melakukan withdraw pada akun Anda sendiri');
    }

    try {
      return await this.transactionRepository.withdraw(data);
    } catch (error) {
      throw new BadRequestException('Terjadi kesalahan saat memproses transaksi withdraw');
    }
  }

  async transfer(data: CreateTransactionDto, user: any): Promise<Transaction> {
    const { sourceAccountId, destinationAccountId, amount } = data;

    const sourceAccount = await this.transactionRepository.getAccountById(sourceAccountId);

    if (!sourceAccount) {
      throw new NotFoundException('Akun sumber tidak ditemukan');
    }

    if (sourceAccount.userId !== user.id && user.role !== 'ADMIN') {
      throw new ForbiddenException('Anda hanya bisa melakukan transfer dari akun Anda sendiri');
    }

    const destinationAccount = await this.transactionRepository.getAccountById(destinationAccountId);

    if (!destinationAccount) {
      throw new NotFoundException('Akun tujuan tidak ditemukan');
    }

    const sourceBalance = sourceAccount.balance?.toNumber() || 0;
    if (sourceBalance < amount) {
      throw new BadRequestException('Saldo tidak cukup untuk melakukan transfer');
    }

    try {
      const transaction = await this.transactionRepository.transfer(data);

      await this.transactionRepository.updateAccountBalance(sourceAccountId, -amount);
      await this.transactionRepository.updateAccountBalance(destinationAccountId, amount);
      return transaction;
    } catch (error) {
      throw new BadRequestException('Terjadi kesalahan saat memproses transaksi transfer');
    }
  }

  async getUserTransactions(userId: number): Promise<Transaction[]> {
    try {
      return await this.transactionRepository.getUserTransactions(userId);
    } catch (error) {
      throw new BadRequestException('Terjadi kesalahan saat mengambil transaksi');
    }
  }

  async getTransactionById(id: number, user: any): Promise<Transaction | null> {
    const transaction = await this.transactionRepository.getTransactionById(id);

    if (!transaction) {
      throw new NotFoundException('Transaksi tidak ditemukan');
    }

    if (transaction.sourceAccountId !== user.id && transaction.destinationAccountId !== user.id && user.role !== 'ADMIN') {
      throw new ForbiddenException('Anda tidak memiliki akses ke transaksi ini');
    }

    return transaction;
  }
}
