import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { AccountRepository } from '../repository/repository';
import { CreateAccountDto } from '../dto/create-account.dto';
import { Account, User } from '@prisma/client';

@Injectable()
export class AccountService {
  constructor(private readonly accountRepository: AccountRepository) {}

  async createAccount(createAccountDto: CreateAccountDto, user: User): Promise<Account> {
    const accountData = {
      ...createAccountDto,
      userId: user.id,
    };

    return this.accountRepository.createAccount(accountData);
  }

  async getAllAccounts(user: User): Promise<Account[]> {
    let accounts: Account[];

    if (user.role === 'ADMIN') {
      accounts = await this.accountRepository.getAllAccounts();
    } else {
      accounts = await this.accountRepository.getAllAccounts(user.id);
    }

    if (!accounts || accounts.length === 0) {
      throw new NotFoundException('Tidak ada akun yang ditemukan');
    }

    return accounts;
  }

  async getAccountById(id: number, user: User): Promise<Account> {
    const account = await this.accountRepository.getAccountById(id);

    if (!account) {
      throw new NotFoundException('Tidak ada akun yang ditemukan');
    }

    if (account.userId !== user.id && user.role !== 'ADMIN') {
      throw new ForbiddenException('Anda hanya bisa melihat akun Anda sendiri');
    }

    return account;
  }

  async updateAccount(id: number, updateAccountDto: any, user: User): Promise<Account> {
    const account = await this.accountRepository.getAccountById(id);

    if (!account) {
      throw new NotFoundException('Tidak ada akun yang ditemukan');
    }

    if (account.userId !== user.id && user.role !== 'ADMIN') {
      throw new ForbiddenException('Anda hanya bisa memperbarui akun Anda sendiri atau akun lain jika Anda admin');
    }

    return this.accountRepository.updateAccount(id, updateAccountDto);
  }

  async deleteAccount(id: number, user: User): Promise<Account> {
    const account = await this.accountRepository.getAccountById(id);

    if (!account) {
      throw new NotFoundException('Tidak ada akun yang ditemukan');
    }

    if (account.userId !== user.id && user.role !== 'ADMIN') {
      throw new ForbiddenException('Anda hanya bisa menghapus akun Anda sendiri atau akun lain jika Anda admin');
    }

    return this.accountRepository.deleteAccount(id);
  }
}
