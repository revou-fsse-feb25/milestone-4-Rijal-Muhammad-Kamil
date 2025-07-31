import { Module } from '@nestjs/common';
import { AccountController } from './controller/account.controller';
import { AccountService } from './service/account.service';
import { AccountRepository } from './repository/repository';

@Module({
  controllers: [AccountController],
  providers: [AccountRepository, AccountService],
})
export class AccountModule {}
