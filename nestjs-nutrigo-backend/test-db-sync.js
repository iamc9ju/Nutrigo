const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkEnum() {
  try {
    const result = await prisma.$queryRawUnsafe(`SELECT enum_range(NULL::"UserRole");`);
    console.log("Database ENUM values:", result);
  } catch (err) {
    console.error("Error executing query:", err);
  } finally {
    await prisma.$disconnect();
  }
}

checkEnum();
