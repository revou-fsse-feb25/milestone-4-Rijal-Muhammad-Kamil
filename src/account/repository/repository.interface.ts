import { Account } from '@prisma/client';
import { CreateAccountDto } from '../dto/create-account.dto';
import { UpdateAccountDto } from '../dto/update-account.dto';
import { AccountType } from '@prisma/client';

export interface AccountInterface {
  createAccount(data: CreateAccountDto & { userId: number }): Promise<Account>;
  getAllAccounts(userId?: number): Promise<Account[]>;
  getAccountById(id: number): Promise<Account | null>;
  updateAccount(id: number, data: UpdateAccountDto): Promise<Account>;
  deleteAccount(id: number): Promise<Account>;
  findAccountByUserIdAndType(userId: number, accountType: AccountType): Promise<Account | null>;
}
