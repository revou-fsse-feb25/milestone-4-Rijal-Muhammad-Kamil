import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { AccountRepository } from '../repository/repository';
import { CreateAccountDto } from '../dto/create-account.dto';
import { Account, User } from '@prisma/client';

@Injectable()
export class AccountService {
  constructor(private readonly accountRepository: AccountRepository) {}

  async createAccount(createAccountDto: CreateAccountDto, user: User): Promise<Account> {
    if (createAccountDto.userId !== user.id) {
      throw new ForbiddenException('Anda hanya bisa membuat akun untuk diri sendiri');
    }

    return this.accountRepository.createAccount(createAccountDto);
  }

  async getAllAccounts(user: any): Promise<Account[]> {
    if (user.role !== 'ADMIN') {
      throw new ForbiddenException('Hanya admin yang dapat mengakses semua akun');
    }

    const accounts = await this.accountRepository.getAllAccounts(user.id);

    if (!accounts || accounts.length === 0) {
      throw new NotFoundException('No accounts found');
    }

    return accounts;
  }

  async getAccountById(id: number, user: User): Promise<Account> {
    const account = await this.accountRepository.getAccountById(id);

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    if (account.userId !== user.id && user.role !== 'ADMIN') {
      throw new ForbiddenException('Anda hanya bisa melihat akun Anda sendiri');
    }

    return account;
  }

  async updateAccount(id: number, updateAccountDto: any, user: User): Promise<Account> {
    const account = await this.accountRepository.getAccountById(id);

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    if (account.userId !== user.id && user.role !== 'ADMIN') {
      throw new ForbiddenException('Anda hanya bisa memperbarui akun Anda sendiri atau akun lain jika Anda admin');
    }

    return this.accountRepository.updateAccount(id, updateAccountDto);
  }

  async deleteAccount(id: number, user: User): Promise<Account> {
    const account = await this.accountRepository.getAccountById(id);

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    if (account.userId !== user.id && user.role !== 'ADMIN') {
      throw new ForbiddenException('Anda hanya bisa menghapus akun Anda sendiri atau akun lain jika Anda admin');
    }

    return this.accountRepository.deleteAccount(id);
  }
}
