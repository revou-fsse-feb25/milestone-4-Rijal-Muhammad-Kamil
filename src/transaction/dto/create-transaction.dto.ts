import { IsInt, Min, IsEnum, IsNumber, IsPositive, IsOptional, Max, ValidateIf } from 'class-validator';
import { TransactionType } from '@prisma/client';

export class CreateTransactionDto {
  @IsInt({ message: 'sourceAccountId harus berupa angka bulat' })
  @Min(1, { message: 'sourceAccountId harus lebih besar dari atau sama dengan 1' })
  sourceAccountId: number;

  @ValidateIf((o) => o.type === TransactionType.TRANSFER)
  @IsOptional()
  @IsInt({ message: 'destinationAccountId harus berupa angka bulat' })
  @IsPositive({ message: 'destinationAccountId harus lebih besar dari 0' })
  destinationAccountId: number;

  @IsEnum(TransactionType, { message: 'Tipe transaksi harus salah satu dari DEPOSIT, WITHDRAW, atau TRANSFER' })
  type: TransactionType;

  @IsNumber({}, { message: 'Amount harus berupa angka' })
  @IsPositive({ message: 'Amount harus lebih besar dari 0' })
  @Max(1000000, { message: 'Amount tidak boleh lebih dari 1.000.000' })
  amount: number;
}
