import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/service/prisma.service';
import { Transaction, TransactionType, TransactionStatus } from '@prisma/client';
import { CreateTransactionDto } from '../dto/create-transaction.dto';

@Injectable()
export class TransactionRepository {
  constructor(private readonly prisma: PrismaService) {}

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
      if (error.code === 'P2002') {
        throw new BadRequestException('Terjadi duplikasi data');
      }
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
      if (error.code === 'P2002') {
        throw new BadRequestException('Terjadi duplikasi data');
      }
      throw new BadRequestException('Terjadi kesalahan saat membuat transaksi withdraw');
    }
  }

  async transfer(data: CreateTransactionDto): Promise<Transaction> {
    const { sourceAccountId, destinationAccountId, amount } = data;

    const sourceAccount = await this.prisma.account.findUnique({
      where: { id: sourceAccountId },
    });

    if (!sourceAccount || sourceAccount.balance.toNumber() < amount) {
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

      await this.prisma.account.update({
        where: { id: sourceAccountId },
        data: { balance: sourceAccount.balance.toNumber() - amount },
      });

      await this.prisma.account.update({
        where: { id: destinationAccountId },
        data: { balance: destinationAccount.balance.toNumber() + amount },
      });

      return transaction;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Transaksi atau akun tidak ditemukan');
      }
      throw new BadRequestException('Terjadi kesalahan saat melakukan transfer');
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
      if (error.code === 'P2025') {
        throw new NotFoundException('Transaksi tidak ditemukan');
      }
      throw new BadRequestException('Terjadi kesalahan saat mengambil transaksi');
    }
  }

  async getTransactionById(id: number): Promise<Transaction | null> {
    try {
      return await this.prisma.transaction.findUnique({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Transaksi tidak ditemukan');
      }
      throw new NotFoundException('Transaksi tidak ditemukan');
    }
  }
}
