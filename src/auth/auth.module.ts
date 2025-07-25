import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

import { AuthService } from './service/auth.service';
import { JwtStrategy } from './jwt/jwt.strategy';
// import { AuthController } from './controller/auth.controller';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: "1d" },
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [/*AuthController*/],
})
export class AuthModule {}
