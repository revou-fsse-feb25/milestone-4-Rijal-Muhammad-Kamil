import { AccountRepository } from './repository';
import { PrismaService } from 'src/prisma/service/prisma.service';
import { Account, AccountType } from '@prisma/client';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CreateAccountDto } from '../dto/create-account.dto';
import { UpdateAccountDto } from '../dto/update-account.dto';
import { Decimal } from 'decimal.js';

const prismaMock = {
  account: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('AccountRepository', () => {
  let accountRepository: AccountRepository;

  beforeEach(() => {
    accountRepository = new AccountRepository(prismaMock as unknown as PrismaService);
  });

  it('should successfully create an account', async () => {
    const createAccountDto: CreateAccountDto = {
      balance: 200000,
      accountType: AccountType.SAVINGS,
    };

    const newAccount: Account = {
      id: 1,
      userId: 1,
      balance: new Decimal(200000),
      accountType: AccountType.SAVINGS,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    prismaMock.account.create.mockResolvedValue(newAccount);

    const result = await accountRepository.createAccount({ ...createAccountDto, userId: 1 });

    expect(prismaMock.account.create).toHaveBeenCalledWith({
      data: {
        userId: 1,
        balance: new Decimal(200000),
        accountType: AccountType.SAVINGS,
      },
    });
    expect(result).toEqual(newAccount);
  });

  it('should throw an error when creating a duplicate account', async () => {
    const createAccountDto: CreateAccountDto = {
      balance: 200000,
      accountType: AccountType.SAVINGS,
    };

    prismaMock.account.create.mockRejectedValue({
      code: 'P2002',
    });

    try {
      await accountRepository.createAccount({ ...createAccountDto, userId: 1 });
    } catch (e) {
      expect(e).toBeInstanceOf(HttpException);
      expect(e.response.message).toBe('Akun dengan jenis ini sudah ada untuk pengguna ini');
      expect(e.getStatus()).toBe(HttpStatus.BAD_REQUEST);
    }
  });

  it('should successfully fetch all accounts', async () => {
    const accounts: Account[] = [
      {
        id: 1,
        userId: 1,
        balance: new Decimal(500000),
        accountType: AccountType.SAVINGS,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    prismaMock.account.findMany.mockResolvedValue(accounts);

    const result = await accountRepository.getAllAccounts(1);
    expect(result).toEqual(accounts);
  });

  it('should throw error if no accounts found', async () => {
    prismaMock.account.findMany.mockResolvedValue([]);

    try {
      await accountRepository.getAllAccounts();
    } catch (e) {
      expect(e).toBeInstanceOf(HttpException);
      expect(e.response.message).toBe('Gagal mengambil akun');
      expect(e.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  });

  it('should successfully fetch an account by ID', async () => {
    const account: Account = {
      id: 1,
      userId: 1,
      balance: new Decimal(100000),
      accountType: AccountType.CHECKING,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    prismaMock.account.findUnique.mockResolvedValue(account);

    const result = await accountRepository.getAccountById(1);
    expect(result).toEqual(account);
  });

  it('should throw an error when account not found', async () => {
    prismaMock.account.findUnique.mockResolvedValue(null);

    try {
      await accountRepository.getAccountById(1);
    } catch (e) {
      expect(e).toBeInstanceOf(HttpException);
      expect(e.response.message).toBe('Akun tidak ditemukan');
      expect(e.getStatus()).toBe(HttpStatus.NOT_FOUND);
    }
  });

  it('should successfully update an account', async () => {
    const updatedAccount: Account = {
      id: 1,
      userId: 1,
      balance: new Decimal(300000),
      accountType: AccountType.SAVINGS,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    prismaMock.account.update.mockResolvedValue(updatedAccount);

    const updateData: UpdateAccountDto = {
      balance: 300000,
    };

    const result = await accountRepository.updateAccount(1, updateData);
    expect(result).toEqual(updatedAccount);
  });

  it('should throw error if account not found when updating', async () => {
    prismaMock.account.update.mockRejectedValue({
      code: 'P2025',
    });

    try {
      await accountRepository.updateAccount(1, { balance: 300000 });
    } catch (e) {
      expect(e).toBeInstanceOf(HttpException);
      expect(e.response.message).toBe('Akun tidak ditemukan');
      expect(e.getStatus()).toBe(HttpStatus.NOT_FOUND);
    }
  });

  it('should successfully delete an account', async () => {
    const deletedAccount: Account = {
      id: 1,
      userId: 1,
      balance: new Decimal(150000),
      accountType: AccountType.SAVINGS,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    prismaMock.account.delete.mockResolvedValue(deletedAccount);

    const result = await accountRepository.deleteAccount(1);
    expect(result).toEqual(deletedAccount);
  });

  it('should throw an error if account not found when deleting', async () => {
    prismaMock.account.delete.mockRejectedValue({
      code: 'P2025',
    });

    try {
      await accountRepository.deleteAccount(1);
    } catch (e) {
      expect(e).toBeInstanceOf(HttpException);
      expect(e.response.message).toBe('Akun tidak ditemukan');
      expect(e.getStatus()).toBe(HttpStatus.NOT_FOUND);
    }
  });

  it('should find an account by userId and accountType', async () => {
    const account: Account = {
      id: 1,
      userId: 1,
      balance: new Decimal(100000),
      accountType: AccountType.SAVINGS,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    prismaMock.account.findUnique.mockResolvedValue(account);

    const result = await accountRepository.findAccountByUserIdAndType(1, AccountType.SAVINGS);
    expect(result).toEqual(account);
  });
});
