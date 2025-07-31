import { IsInt, Min, IsNumber, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { AccountType } from '@prisma/client';

export class CreateAccountDto {
  @IsInt({ message: 'userId harus berupa angka bulat' })
  @Min(1, { message: 'userId harus lebih besar dari atau sama dengan 1' })
  userId: number;

  @IsNumber({}, { message: 'Balance harus berupa angka' })
  @Min(100000, { message: 'Balance harus lebih besar atau sama dengan 100.000' })
  balance: number;

  @IsEnum(AccountType, { message: 'Tipe akun hanya boleh SAVINGS atau CHECKING' })
  @Transform(({ value }) => value.toUpperCase())
  accountType: AccountType;
}
