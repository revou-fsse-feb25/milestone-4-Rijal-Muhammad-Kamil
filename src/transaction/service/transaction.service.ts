import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { TransactionRepository } from '../repository/repository';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { Transaction } from '@prisma/client';

@Injectable()
export class TransactionService {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  // Deposit ke akun
  async deposit(data: CreateTransactionDto, user: any): Promise<Transaction> {
    // Memastikan hanya user yang memiliki akun tersebut yang dapat melakukan deposit
    if (data.sourceAccountId !== user.id) {
      throw new ForbiddenException('Anda hanya bisa melakukan deposit pada akun Anda sendiri');
    }

    try {
      return await this.transactionRepository.deposit(data);
    } catch (error) {
      throw new BadRequestException('Terjadi kesalahan saat memproses transaksi deposit');
    }
  }

  // Withdraw dari akun
  async withdraw(data: CreateTransactionDto, user: any): Promise<Transaction> {
    // Memastikan hanya user yang memiliki akun tersebut yang dapat melakukan withdraw
    if (data.sourceAccountId !== user.id) {
      throw new ForbiddenException('Anda hanya bisa melakukan withdraw pada akun Anda sendiri');
    }

    try {
      return await this.transactionRepository.withdraw(data);
    } catch (error) {
      throw new BadRequestException('Terjadi kesalahan saat memproses transaksi withdraw');
    }
  }

  // Transfer antar akun
  async transfer(data: CreateTransactionDto, user: any): Promise<Transaction> {
    const { sourceAccountId, destinationAccountId, amount } = data;

    // Memastikan user hanya bisa melakukan transfer antar akun mereka sendiri (atau admin bisa transfer antar akun apapun)
    if (sourceAccountId !== user.id && user.role !== 'ADMIN') {
      throw new ForbiddenException('Anda hanya bisa melakukan transfer dari akun Anda sendiri');
    }

    try {
      return await this.transactionRepository.transfer(data);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('Terjadi kesalahan saat memproses transaksi transfer');
    }
  }

  // Mendapatkan semua transaksi untuk pengguna tertentu
  async getUserTransactions(userId: number): Promise<Transaction[]> {
    try {
      return await this.transactionRepository.getUserTransactions(userId);
    } catch (error) {
      throw new BadRequestException('Terjadi kesalahan saat mengambil transaksi');
    }
  }

  // Mendapatkan transaksi berdasarkan ID
  async getTransactionById(id: number, user: any): Promise<Transaction | null> {
    // Pastikan pengguna hanya dapat melihat transaksi yang mereka miliki (admin dapat melihat semua transaksi)
    const transaction = await this.transactionRepository.getTransactionById(id);

    if (!transaction) {
      throw new NotFoundException('Transaksi tidak ditemukan');
    }

    // Cek apakah user adalah pengirim atau penerima
    if (transaction.sourceAccountId !== user.id && transaction.destinationAccountId !== user.id && user.role !== 'ADMIN') {
      throw new ForbiddenException('Anda tidak memiliki akses ke transaksi ini');
    }

    return transaction;
  }
}
