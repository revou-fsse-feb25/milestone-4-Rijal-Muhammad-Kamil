import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('test-secret'),
          },
        },
      ],
    }).compile();

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(jwtStrategy).toBeDefined();
  });

  describe('constructor', () => {
    it('should throw an error if JWT_SECRET is not defined', () => {
      jest.spyOn(configService, 'get').mockReturnValueOnce(undefined);

      expect(() => {
        new JwtStrategy(configService);
      }).toThrowError('JWT_SECRET is not defined in the environment variables');
    });

    it('should not throw an error if JWT_SECRET is defined', () => {
      jest.spyOn(configService, 'get').mockReturnValueOnce('test-secret');

      expect(() => {
        new JwtStrategy(configService);
      }).not.toThrowError();
    });
  });

  describe('validate', () => {
    it('should throw an UnauthorizedException if the token payload is invalid', () => {
      const invalidPayload = { id: null, email: null, role: 'admin' };

      expect(() => {
        jwtStrategy.validate(invalidPayload as any);
      }).toThrowError(UnauthorizedException);
    });

    it('should return the payload if the token is valid', () => {
      const validPayload = { id: 1, email: 'test@example.com', role: 'admin' };

      const result = jwtStrategy.validate(validPayload);

      expect(result).toEqual({ id: 1, email: 'test@example.com', role: 'admin' });
    });
  });
});
