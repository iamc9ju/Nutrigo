import { execSync } from 'child_process';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import { URL } from 'url';

dotenv.config();

function resolveIpv4Sync(hostname: string): string {
  try {
    // Try dig first (common on unix)
    const output = execSync(`dig +short A ${hostname}`).toString().trim();
    const lines = output.split('\n');
    // Take first non-empty line that looks like IP
    for (const line of lines) {
      if (/^\d+\.\d+\.\d+\.\d+$/.test(line)) {
        return line;
      }
    }
  } catch (e) {
    // fallback?
  }
  throw new Error(`Could not resolve IPv4 for ${hostname}`);
}

const dbUrl = process.env.DATABASE_URL!;
const parsed = new URL(dbUrl);
const hostname = parsed.hostname;

console.log(`Resolving ${hostname} synchronously...`);
const ip = resolveIpv4Sync(hostname);
console.log(`Resolved: ${ip}`);

// Setup Pool with IP
const pool = new Pool({
  host: ip,
  port: Number(parsed.port) || 5432,
  user: parsed.username,
  password: parsed.password,
  database: parsed.pathname.split('/')[1],
  ssl: {
    rejectUnauthorized: false,
    servername: hostname, // Security: Verify original hostname
  },
  connectionTimeoutMillis: 10000,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter, log: ['info', 'error'] });

async function main() {
  try {
    await prisma.$connect();
    console.log('✅ Connected with Sync DNS + Adapter!');

    await prisma.user.count();
    console.log('✅ Query success!');
  } catch (e) {
    console.error('❌ Error:', e);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
