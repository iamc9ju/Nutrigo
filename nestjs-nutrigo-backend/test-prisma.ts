import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

// Attempt 5: Use Standard Prisma Client (After engineType="library" fix)
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function main() {
  console.log('--- Starting STANDARD Prisma Client Test (Library Engine) ---');
  console.log('DATABASE_URL:', process.env.DATABASE_URL);

  try {
    await prisma.$connect();
    console.log('✅ Connected to Database!');

    const count = await prisma.user.count();
    console.log('Current user count:', count);

    const email = `test_lib_${Date.now()}@example.com`;
    console.log(`Attempting to create user: ${email}`);

    const hash = await bcrypt.hash('password', 10);

    const user = await prisma.user.create({
      data: {
        email: email,
        passwordHash: hash,
        role: 'patient',
        is2faEnabled: false,
      },
    });

    console.log('✅ User created successfully:', user);

    await prisma.user.delete({ where: { id: user.id } });
    console.log('✅ User deleted successfully');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
