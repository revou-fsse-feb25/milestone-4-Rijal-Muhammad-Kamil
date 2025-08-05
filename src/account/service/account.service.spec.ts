import { AccountService } from './account.service';
import { AccountRepository } from '../repository/repository';
import { CreateAccountDto } from '../dto/create-account.dto';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { User, Account, AccountType } from '@prisma/client';
import Decimal from 'decimal.js';

describe('AccountService', () => {
  let accountService: AccountService;
  let accountRepository: AccountRepository;
  let mockUser: User;

  beforeEach(() => {
    accountRepository = {
      createAccount: jest.fn(),
      getAllAccounts: jest.fn(),
      getAccountById: jest.fn(),
      updateAccount: jest.fn(),
      deleteAccount: jest.fn(),
    } as unknown as AccountRepository;
    accountService = new AccountService(accountRepository);

    mockUser = {
      id: 1,
      email: 'test@test.com',
      role: 'CUSTOMER',
      name: 'Test User',
      password: 'hashedPassword',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });

  it('should create an account', async () => {
    const createAccountDto: CreateAccountDto = {
      balance: 150000,
      accountType: AccountType.SAVINGS,
    };
    const account: Account = {
      id: 1,
      userId: mockUser.id,
      balance: new Decimal(150000),
      accountType: AccountType.SAVINGS,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    accountRepository.createAccount = jest.fn().mockResolvedValue(account);

    const result = await accountService.createAccount(createAccountDto, mockUser);

    expect(accountRepository.createAccount).toHaveBeenCalledWith({
      ...createAccountDto,
      userId: mockUser.id,
    });
    expect(result).toEqual(account);
  });

  it('should throw NotFoundException if no accounts are found', async () => {
    accountRepository.getAllAccounts = jest.fn().mockResolvedValue([]);

    try {
      await accountService.getAllAccounts(mockUser);
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundException);
      expect(e.message).toBe('Tidak ada akun yang ditemukan');
    }
  });

  it('should throw ForbiddenException if user tries to access another user\'s account', async () => {
    const account: Account = {
      id: 1,
      userId: 2,
      balance: new Decimal(100000),
      accountType: AccountType.CHECKING,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    accountRepository.getAccountById = jest.fn().mockResolvedValue(account);

    try {
      await accountService.getAccountById(1, mockUser);
    } catch (e) {
      expect(e).toBeInstanceOf(ForbiddenException);
      expect(e.message).toBe('Anda hanya bisa melihat akun Anda sendiri');
    }
  });

  it('should update account', async () => {
    const updateData = { balance: new Decimal(200000) };
    const updatedAccount: Account = {
      id: 1,
      userId: mockUser.id,
      balance: new Decimal(200000),
      accountType: AccountType.CHECKING,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    accountRepository.getAccountById = jest.fn().mockResolvedValue(updatedAccount);
    accountRepository.updateAccount = jest.fn().mockResolvedValue(updatedAccount);

    const result = await accountService.updateAccount(1, updateData, mockUser);

    expect(result).toEqual(updatedAccount);
    expect(accountRepository.updateAccount).toHaveBeenCalledWith(1, updateData);
  });

  it('should throw ForbiddenException if user tries to update another user\'s account', async () => {
    const account: Account = {
      id: 1,
      userId: 2,
      balance: new Decimal(100000),
      accountType: AccountType.CHECKING,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    accountRepository.getAccountById = jest.fn().mockResolvedValue(account);

    try {
      await accountService.updateAccount(1, { balance: new Decimal(150000) }, mockUser); // Use Decimal
    } catch (e) {
      expect(e).toBeInstanceOf(ForbiddenException);
      expect(e.message).toBe('Anda hanya bisa memperbarui akun Anda sendiri atau akun lain jika Anda admin');
    }
  });

  it('should delete account', async () => {
    const account: Account = {
      id: 1,
      userId: mockUser.id,
      balance: new Decimal(100000),
      accountType: AccountType.CHECKING,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    accountRepository.getAccountById = jest.fn().mockResolvedValue(account);
    accountRepository.deleteAccount = jest.fn().mockResolvedValue(account);

    const result = await accountService.deleteAccount(1, mockUser);

    expect(result).toEqual(account);
    expect(accountRepository.deleteAccount).toHaveBeenCalledWith(1);
  });

  it('should throw NotFoundException if account to delete does not exist', async () => {
    accountRepository.getAccountById = jest.fn().mockResolvedValue(null);

    try {
      await accountService.deleteAccount(1, mockUser);
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundException);
      expect(e.message).toBe('Tidak ada akun yang ditemukan');
    }
  });
});
