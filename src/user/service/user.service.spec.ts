import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from '../repository/repository';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { User, Role } from '@prisma/client';
import { UpdateUserDto } from '../dto/update-user.dto';

describe('UserService', () => {
  let service: UserService;
  let repository: jest.Mocked<UserRepository>;

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
        UserService,
        {
          provide: UserRepository,
          useValue: {
            getUserById: jest.fn(),
            getAllUsers: jest.fn(),
            updateUser: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get(UserRepository);
  });

  describe('getUser', () => {
    it('should return the user when id matches current user', async () => {
      repository.getUserById.mockResolvedValue(mockUser);
      const result = await service.getUser(1, 1);
      expect(result).toEqual(mockUser);
    });

    it('should throw ForbiddenException if id does not match current user', async () => {
      await expect(service.getUser(2, 1)).rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFoundException if user not found', async () => {
      repository.getUserById.mockResolvedValue(null);
      await expect(service.getUser(1, 1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getAllUsers', () => {
    it('should return all users if current user is admin', async () => {
      const adminUser = { ...mockUser, role: Role.ADMIN };
      repository.getAllUsers.mockResolvedValue([mockUser]);
      const result = await service.getAllUsers(adminUser);
      expect(result).toEqual([mockUser]);
    });

    it('should throw ForbiddenException if user is not admin', async () => {
      await expect(service.getAllUsers(mockUser)).rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFoundException if no users found', async () => {
      const adminUser = { ...mockUser, role: Role.ADMIN };
      repository.getAllUsers.mockResolvedValue([]);
      await expect(service.getAllUsers(adminUser)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateUser', () => {
    const updateDto: UpdateUserDto = { name: 'Updated Name' };

    it('should update and return user if id matches current user and user exists', async () => {
      repository.getUserById.mockResolvedValue(mockUser);
      repository.updateUser.mockResolvedValue({ ...mockUser, ...updateDto });

      const result = await service.updateUser(1, updateDto, 1);
      expect(result).toEqual({ ...mockUser, ...updateDto });
    });

    it('should throw ForbiddenException if trying to update another user', async () => {
      await expect(service.updateUser(2, updateDto, 1)).rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFoundException if user not found', async () => {
      repository.getUserById.mockResolvedValue(null);
      await expect(service.updateUser(1, updateDto, 1)).rejects.toThrow(NotFoundException);
    });
  });
});
