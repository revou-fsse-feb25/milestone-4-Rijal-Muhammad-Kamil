import { IsNumber, Min, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { AccountType } from '@prisma/client';

export class CreateAccountDto {
  @IsNumber({}, { message: 'Balance harus berupa angka' })
  @Min(100000, { message: 'Balance harus lebih besar atau sama dengan 100.000' })
  balance: number;

  @IsEnum(AccountType, { message: 'Tipe akun hanya boleh SAVINGS atau CHECKING' })
  @Transform(({ value }) => value.toUpperCase())
  accountType: AccountType;
}
