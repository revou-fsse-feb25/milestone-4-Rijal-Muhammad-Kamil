import { PrismaClient, AccountType, TransactionType, TransactionStatus, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {

  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: await bcrypt.hash('admin123', 10),
      role: Role.ADMIN,
    },
  });

  const customerUser1 = await prisma.user.create({
    data: {
      name: 'Customer 1',
      email: 'customer1@example.com',
      password: await bcrypt.hash('customer123', 10),
      role: Role.CUSTOMER,
    },
  });

  const customerUser2 = await prisma.user.create({
    data: {
      name: 'Customer 2',
      email: 'customer2@example.com',
      password: await bcrypt.hash('customer456', 10),
      role: Role.CUSTOMER,
    },
  });

  const adminAccount = await prisma.account.create({
    data: {
      userId: adminUser.id,
      balance: 10000.00,
      accountType: AccountType.SAVINGS,
    },
  });

  const customerAccount1 = await prisma.account.create({
    data: {
      userId: customerUser1.id,
      balance: 500.00,
      accountType: AccountType.CHECKING,
    },
  });

  const customerAccount2 = await prisma.account.create({
    data: {
      userId: customerUser2.id,
      balance: 1500.00,
      accountType: AccountType.SAVINGS,
    },
  });

  await prisma.transaction.create({
    data: {
      sourceAccountId: adminAccount.id,
      destinationAccountId: customerAccount1.id,
      type: TransactionType.TRANSFER,
      amount: 300.00,
      status: TransactionStatus.SUCCESS,
    },
  });

  await prisma.transaction.create({
    data: {
      sourceAccountId: customerAccount1.id,
      destinationAccountId: adminAccount.id,
      type: TransactionType.TRANSFER,
      amount: 100.00,
      status: TransactionStatus.SUCCESS,
    },
  });

  await prisma.transaction.create({
    data: {
      sourceAccountId: customerAccount2.id,
      destinationAccountId: customerAccount1.id,
      type: TransactionType.TRANSFER,
      amount: 200.00,
      status: TransactionStatus.PENDING,
    },
  });

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
