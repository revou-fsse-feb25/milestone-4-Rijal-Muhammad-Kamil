import { Injectable } from '@nestjs/common';
import { AccountInterface } from './repository.interface';
import { PrismaService } from 'src/prisma/service/prisma.service';
import { Account } from '@prisma/client';
import { CreateAccountDto } from '../dto/create-account.dto';
import { UpdateAccountDto } from '../dto/update-account.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { AccountType } from '@prisma/client';

@Injectable()
export class AccountRepository implements AccountInterface {
  constructor(private readonly prisma: PrismaService) {}

  async createAccount(data: CreateAccountDto & { userId: number }): Promise<Account> {
    try {
      return await this.prisma.account.create({
        data: {
          userId: data.userId,
          balance: data.balance,
          accountType: data.accountType,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new HttpException('Account with this type already exists for this user', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Failed to create account', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllAccounts(userId?: number): Promise<Account[]> {
    try {
      return await this.prisma.account.findMany({
        where: userId ? { userId } : undefined,
      });
    } catch (error) {
      throw new HttpException('Failed to fetch accounts', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAccountById(id: number): Promise<Account | null> {
    try {
      const account = await this.prisma.account.findUnique({
        where: { id },
      });

      if (!account) {
        throw new HttpException('Account not found', HttpStatus.NOT_FOUND);
      }

      return account;
    } catch (error) {
      throw new HttpException('Failed to fetch account', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateAccount(id: number, data: UpdateAccountDto): Promise<Account> {
    try {
      const updatedAccount = await this.prisma.account.update({
        where: { id },
        data,
      });

      return updatedAccount;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new HttpException('Account not found', HttpStatus.NOT_FOUND);
      }
      throw new HttpException('Failed to update account', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteAccount(id: number): Promise<Account> {
    try {
      const deletedAccount = await this.prisma.account.delete({
        where: { id },
      });

      return deletedAccount;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new HttpException('Account not found', HttpStatus.NOT_FOUND);
      }
      throw new HttpException('Failed to delete account', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAccountByUserIdAndType(userId: number, accountType: AccountType): Promise<Account | null> {
    try {
      const account = await this.prisma.account.findUnique({
        where: {
          userId_accountType: {
            userId,
            accountType,
          },
        },
      });

      return account;
    } catch (error) {
      throw new HttpException('Error searching account by userId and accountType', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
