import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from './repository';
import { PrismaService } from 'src/prisma/service/prisma.service';
import { HttpException } from '@nestjs/common';
import { User, Role } from '@prisma/client';

describe('UserRepository', () => {
  let repository: UserRepository;
  let prisma: jest.Mocked<PrismaService>;

  const mockUser: User = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    password: 'hashedpassword',
    role: Role.CUSTOMER,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    repository = module.get<UserRepository>(UserRepository);
    prisma = module.get(PrismaService) as jest.Mocked<PrismaService>;
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);
      const result = await repository.createUser(mockUser);
      expect(result).toEqual(mockUser);
    });

    it('should throw if email already exists (P2002)', async () => {
      (prisma.user.create as jest.Mock).mockRejectedValue({ code: 'P2002' });
      await expect(repository.createUser(mockUser)).rejects.toThrow(HttpException);
    });

    it('should throw internal server error on other failures', async () => {
      (prisma.user.create as jest.Mock).mockRejectedValue(new Error());
      await expect(repository.createUser(mockUser)).rejects.toThrow(HttpException);
    });
  });

  describe('getAllUsers', () => {
    it('should return list of users', async () => {
      (prisma.user.findMany as jest.Mock).mockResolvedValue([mockUser]);
      const result = await repository.getAllUsers();
      expect(result).toEqual([mockUser]);
    });

    it('should throw internal server error on failure', async () => {
      (prisma.user.findMany as jest.Mock).mockRejectedValue(new Error());
      await expect(repository.getAllUsers()).rejects.toThrow(HttpException);
    });
  });

  describe('getUserById', () => {
    it('should return user if found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      const result = await repository.getUserById(1);
      expect(result).toEqual(mockUser);
    });

    it('should throw 404 if user not found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(repository.getUserById(1)).rejects.toThrow(HttpException);
    });

    it('should throw internal server error on prisma failure', async () => {
      (prisma.user.findUnique as jest.Mock).mockRejectedValue(new Error());
      await expect(repository.getUserById(1)).rejects.toThrow(HttpException);
    });
  });

  describe('updateUser', () => {
    it('should update and return user', async () => {
      (prisma.user.update as jest.Mock).mockResolvedValue(mockUser);
      const result = await repository.updateUser(1, { name: 'Updated' });
      expect(result).toEqual(mockUser);
    });

    it('should throw 404 if user not found (P2025)', async () => {
      (prisma.user.update as jest.Mock).mockRejectedValue({ code: 'P2025' });
      await expect(repository.updateUser(1, {})).rejects.toThrow(HttpException);
    });

    it('should throw internal error on general failure', async () => {
      (prisma.user.update as jest.Mock).mockRejectedValue(new Error());
      await expect(repository.updateUser(1, {})).rejects.toThrow(HttpException);
    });
  });

  describe('deleteUser', () => {
    it('should delete user', async () => {
      (prisma.user.delete as jest.Mock).mockResolvedValue(mockUser);
      const result = await repository.deleteUser(1);
      expect(result).toEqual(mockUser);
    });

    it('should throw 404 if user not found (P2025)', async () => {
      (prisma.user.delete as jest.Mock).mockRejectedValue({ code: 'P2025' });
      await expect(repository.deleteUser(1)).rejects.toThrow(HttpException);
    });

    it('should throw internal error on general failure', async () => {
      (prisma.user.delete as jest.Mock).mockRejectedValue(new Error());
      await expect(repository.deleteUser(1)).rejects.toThrow(HttpException);
    });
  });

  describe('findUserByEmail', () => {
    it('should return user if found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      const result = await repository.findUserByEmail('john@example.com');
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      const result = await repository.findUserByEmail('notfound@example.com');
      expect(result).toBeNull();
    });

    it('should throw internal error on failure', async () => {
      (prisma.user.findUnique as jest.Mock).mockRejectedValue(new Error());
      await expect(repository.findUserByEmail('error@example.com')).rejects.toThrow(HttpException);
    });
  });
});
