import { RolesGuard } from './roles.guard';
import { ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';

describe('RolesGuard', () => {
  let rolesGuard: RolesGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesGuard,
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: jest.fn().mockReturnValue(['admin']),
          },
        },
      ],
    }).compile();

    rolesGuard = module.get<RolesGuard>(RolesGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  it('should be defined', () => {
    expect(rolesGuard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should return true if there are no roles required', () => {
      // Mocking reflector to return no roles
      reflector.getAllAndOverride = jest.fn().mockReturnValue(undefined);

      const context = {
        switchToHttp: () => ({
          getRequest: () => ({
            user: { role: 'user' },
          }),
        }),
      } as any;

      expect(rolesGuard.canActivate(context)).toBe(true);
    });

    it('should return true if the user has the required role', () => {
      const context = {
        switchToHttp: () => ({
          getRequest: () => ({
            user: { role: 'admin' },
          }),
        }),
      } as any;

      expect(rolesGuard.canActivate(context)).toBe(true);
    });

    it('should throw a ForbiddenException if the user does not have the required role', () => {
      const context = {
        switchToHttp: () => ({
          getRequest: () => ({
            user: { role: 'user' },
          }),
        }),
      } as any;

      expect(() => rolesGuard.canActivate(context)).toThrow(ForbiddenException);
    });

    it('should throw a ForbiddenException if the user is not authenticated', () => {
      const context = {
        switchToHttp: () => ({
          getRequest: () => ({
            user: null,
          }),
        }),
      } as any;

      expect(() => rolesGuard.canActivate(context)).toThrow(ForbiddenException);
    });
  });
});
