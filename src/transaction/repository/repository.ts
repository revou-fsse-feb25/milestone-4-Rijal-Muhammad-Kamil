import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/service/prisma.service';
import { Transaction, TransactionType, TransactionStatus } from '@prisma/client';
import { CreateTransactionDto } from '../dto/create-transaction.dto';

@Injectable()
export class TransactionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async updateAccountBalance(accountId: number, amount: number) {
    try {
      return await this.prisma.account.update({
        where: { id: accountId },
        data: {
          balance: {
            increment: amount,
          },
        },
      });
    } catch (error) {
      throw new BadRequestException('Terjadi kesalahan saat memperbarui saldo akun');
    }
  }

  async deposit(data: CreateTransactionDto): Promise<Transaction> {
    try {
      const transaction = await this.prisma.transaction.create({
        data: {
          sourceAccountId: data.sourceAccountId,
          amount: data.amount,
          type: TransactionType.DEPOSIT,
          status: TransactionStatus.SUCCESS,
        },
      });
      return transaction;
    } catch (error) {
      throw new BadRequestException('Terjadi kesalahan saat membuat transaksi deposit');
    }
  }

  async withdraw(data: CreateTransactionDto): Promise<Transaction> {
    try {
      const transaction = await this.prisma.transaction.create({
        data: {
          sourceAccountId: data.sourceAccountId,
          amount: data.amount,
          type: TransactionType.WITHDRAW,
          status: TransactionStatus.SUCCESS,
        },
      });
      return transaction;
    } catch (error) {
      throw new BadRequestException('Terjadi kesalahan saat membuat transaksi withdraw');
    }
  }

  async transfer(data: CreateTransactionDto): Promise<Transaction> {
    const { sourceAccountId, destinationAccountId, amount } = data;

    const sourceAccount = await this.prisma.account.findUnique({
      where: { id: sourceAccountId },
    });

    if (!sourceAccount || sourceAccount.balance === undefined || sourceAccount.balance.toNumber() < amount) {
      throw new BadRequestException('Saldo tidak cukup untuk melakukan transfer');
    }

    const destinationAccount = await this.prisma.account.findUnique({
      where: { id: destinationAccountId },
    });

    if (!destinationAccount) {
      throw new BadRequestException('Akun tujuan tidak ditemukan');
    }

    try {
      const transaction = await this.prisma.transaction.create({
        data: {
          sourceAccountId,
          destinationAccountId,
          amount,
          type: TransactionType.TRANSFER,
          status: TransactionStatus.SUCCESS,
        },
      });

      const sourceBalance = sourceAccount.balance?.toNumber() || 0;
      const destinationBalance = destinationAccount.balance?.toNumber() || 0;

      await this.prisma.account.update({
        where: { id: sourceAccountId },
        data: { balance: sourceBalance - amount },
      });

      await this.prisma.account.update({
        where: { id: destinationAccountId },
        data: { balance: destinationBalance + amount },
      });

      return transaction;
    } catch (error) {
      throw new BadRequestException('Terjadi kesalahan saat melakukan transfer');
    }
  }

  async getTransactionById(id: number): Promise<Transaction | null> {
    try {
      return await this.prisma.transaction.findUnique({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException('Transaksi tidak ditemukan');
    }
  }

  async getUserTransactions(userId: number): Promise<Transaction[]> {
    try {
      return await this.prisma.transaction.findMany({
        where: {
          OR: [{ sourceAccount: { userId } }, { destinationAccount: { userId } }],
        },
      });
    } catch (error) {
      throw new BadRequestException('Terjadi kesalahan saat mengambil transaksi');
    }
  }

  async getAccountById(accountId: number) {
    try {
      const account = await this.prisma.account.findUnique({
        where: { id: accountId },
      });
      if (!account) {
        throw new NotFoundException('Akun tidak ditemukan');
      }
      return account;
    } catch (error) {
      throw new BadRequestException('Terjadi kesalahan saat mengambil akun');
    }
  }
}
