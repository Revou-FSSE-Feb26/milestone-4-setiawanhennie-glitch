import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  // Create Users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const alice = await prisma.user.create({
    data: {
      name: 'Alice Johnson',
      email: 'alice@example.com',
      password: hashedPassword,
      role: 'user',
    },
  });

  const bob = await prisma.user.create({
    data: {
      name: 'Bob Smith',
      email: 'bob@example.com',
      password: hashedPassword,
      role: 'user',
    },
  });

  const carol = await prisma.user.create({
    data: {
      name: 'Carol Williams',
      email: 'carol@example.com',
      password: hashedPassword,
      role: 'admin',
    },
  });

  console.log('Created users');

  // Create Accounts
  const aliceChecking = await prisma.account.create({
    data: {
      user_id: alice.id,
      name: 'Alice Checking',
      type: 'bank',
      balance: 2500.0,
    },
  });

  const aliceSavings = await prisma.account.create({
    data: {
      user_id: alice.id,
      name: 'Alice Savings',
      type: 'bank',
      balance: 10000.0,
    },
  });

  const aliceCash = await prisma.account.create({
    data: {
      user_id: alice.id,
      name: 'Alice Cash',
      type: 'cash',
      balance: 150.0,
    },
  });

  const bobMain = await prisma.account.create({
    data: {
      user_id: bob.id,
      name: 'Bob Main Account',
      type: 'bank',
      balance: 1800.5,
    },
  });

  const bobEwallet = await prisma.account.create({
    data: {
      user_id: bob.id,
      name: 'Bob E-Wallet',
      type: 'e_wallet',
      balance: 300.0,
    },
  });

  const carolBusiness = await prisma.account.create({
    data: {
      user_id: carol.id,
      name: 'Carol Business',
      type: 'bank',
      balance: 15000.0,
    },
  });

  const carolPersonal = await prisma.account.create({
    data: {
      user_id: carol.id,
      name: 'Carol Personal',
      type: 'bank',
      balance: 15000.0,
    },
  });

  console.log('Created accounts');

  // Create Categories
  const salary = await prisma.category.create({
    data: { name: 'Salary', type: 'income' },
  });

  const freelance = await prisma.category.create({
    data: { name: 'Freelance', type: 'income' },
  });

  const investments = await prisma.category.create({
    data: { name: 'Investments', type: 'income' },
  });

  const groceries = await prisma.category.create({
    data: { name: 'Groceries', type: 'expense' },
  });

  const rent = await prisma.category.create({
    data: { name: 'Rent', type: 'expense' },
  });

  const utilities = await prisma.category.create({
    data: { name: 'Utilities', type: 'expense' },
  });

  const entertainment = await prisma.category.create({
    data: { name: 'Entertainment', type: 'expense' },
  });

  const transportation = await prisma.category.create({
    data: { name: 'Transportation', type: 'expense' },
  });

  const healthcare = await prisma.category.create({
    data: { name: 'Healthcare', type: 'expense' },
  });

  console.log('Created categories');

  // Create Transactions
  await prisma.transaction.create({
    data: {
      account_id: aliceChecking.id,
      category_id: salary.id,
      type: 'income',
      amount: 3500.0,
      description: 'Monthly salary',
      transaction_date: new Date('2026-07-01'),
    },
  });

  await prisma.transaction.create({
    data: {
      account_id: aliceChecking.id,
      category_id: groceries.id,
      type: 'expense',
      amount: 150.75,
      description: 'Weekly groceries',
      transaction_date: new Date('2026-07-05'),
    },
  });

  await prisma.transaction.create({
    data: {
      account_id: aliceChecking.id,
      category_id: rent.id,
      type: 'expense',
      amount: 1200.0,
      description: 'July rent',
      transaction_date: new Date('2026-07-01'),
    },
  });

  await prisma.transaction.create({
    data: {
      account_id: aliceChecking.id,
      category_id: utilities.id,
      type: 'expense',
      amount: 85.5,
      description: 'Electric bill',
      transaction_date: new Date('2026-07-10'),
    },
  });

  await prisma.transaction.create({
    data: {
      account_id: aliceSavings.id,
      category_id: salary.id,
      type: 'income',
      amount: 500.0,
      description: 'Interest payment',
      transaction_date: new Date('2026-07-15'),
    },
  });

  await prisma.transaction.create({
    data: {
      account_id: aliceCash.id,
      category_id: entertainment.id,
      type: 'expense',
      amount: 45.0,
      description: 'Movie night',
      transaction_date: new Date('2026-07-12'),
    },
  });

  await prisma.transaction.create({
    data: {
      account_id: aliceChecking.id,
      category_id: transportation.id,
      type: 'expense',
      amount: 60.0,
      description: 'Gas refill',
      transaction_date: new Date('2026-07-08'),
    },
  });

  await prisma.transaction.create({
    data: {
      account_id: bobMain.id,
      category_id: salary.id,
      type: 'income',
      amount: 2800.0,
      description: 'Monthly salary',
      transaction_date: new Date('2026-07-01'),
    },
  });

  await prisma.transaction.create({
    data: {
      account_id: bobMain.id,
      category_id: groceries.id,
      type: 'expense',
      amount: 200.3,
      description: 'Grocery shopping',
      transaction_date: new Date('2026-07-06'),
    },
  });

  await prisma.transaction.create({
    data: {
      account_id: bobEwallet.id,
      category_id: freelance.id,
      type: 'income',
      amount: 750.0,
      description: 'Freelance project',
      transaction_date: new Date('2026-07-14'),
    },
  });

  await prisma.transaction.create({
    data: {
      account_id: bobEwallet.id,
      category_id: healthcare.id,
      type: 'expense',
      amount: 120.0,
      description: 'Doctor visit',
      transaction_date: new Date('2026-07-11'),
    },
  });

  await prisma.transaction.create({
    data: {
      account_id: carolBusiness.id,
      category_id: salary.id,
      type: 'income',
      amount: 5000.0,
      description: 'Business revenue',
      transaction_date: new Date('2026-07-01'),
    },
  });

  await prisma.transaction.create({
    data: {
      account_id: carolBusiness.id,
      category_id: rent.id,
      type: 'expense',
      amount: 2000.0,
      description: 'Office rent',
      transaction_date: new Date('2026-07-01'),
    },
  });

  await prisma.transaction.create({
    data: {
      account_id: carolBusiness.id,
      category_id: investments.id,
      type: 'income',
      amount: 1200.0,
      description: 'Dividend payment',
      transaction_date: new Date('2026-07-20'),
    },
  });

  await prisma.transaction.create({
    data: {
      account_id: aliceChecking.id,
      category_id: entertainment.id,
      type: 'expense',
      amount: 95.0,
      description: 'Concert tickets',
      transaction_date: new Date('2026-07-18'),
    },
  });

  await prisma.transaction.create({
    data: {
      account_id: bobMain.id,
      category_id: transportation.id,
      type: 'expense',
      amount: 75.0,
      description: 'Uber rides',
      transaction_date: new Date('2026-07-09'),
    },
  });

  await prisma.transaction.create({
    data: {
      account_id: aliceSavings.id,
      category_id: groceries.id,
      type: 'expense',
      amount: 180.25,
      description: 'Organic groceries',
      transaction_date: new Date('2026-07-13'),
    },
  });

  await prisma.transaction.create({
    data: {
      account_id: bobEwallet.id,
      category_id: utilities.id,
      type: 'expense',
      amount: 95.75,
      description: 'Internet bill',
      transaction_date: new Date('2026-07-05'),
    },
  });

  await prisma.transaction.create({
    data: {
      account_id: aliceChecking.id,
      category_id: freelance.id,
      type: 'income',
      amount: 400.0,
      description: 'Side project',
      transaction_date: new Date('2026-07-22'),
    },
  });

  await prisma.transaction.create({
    data: {
      account_id: aliceCash.id,
      category_id: groceries.id,
      type: 'expense',
      amount: 35.5,
      description: 'Coffee and snacks',
      transaction_date: new Date('2026-07-15'),
    },
  });

  await prisma.transaction.create({
    data: {
      account_id: carolBusiness.id,
      category_id: transportation.id,
      type: 'expense',
      amount: 150.0,
      description: 'Business travel',
      transaction_date: new Date('2026-07-16'),
    },
  });

  await prisma.transaction.create({
    data: {
      account_id: carolBusiness.id,
      category_id: entertainment.id,
      type: 'expense',
      amount: 200.0,
      description: 'Theater show',
      transaction_date: new Date('2026-07-19'),
    },
  });

  console.log('Created transactions');
  console.log('Seeding finished!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });