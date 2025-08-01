import { IsEnum } from 'class-validator';
import { TransactionStatus } from '@prisma/client';

export class TransactionStatusDto {
  @IsEnum(TransactionStatus)
  status: TransactionStatus; // Status transaksi (PENDING, SUCCESS, FAILED)
}
