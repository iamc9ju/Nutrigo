import { Pool } from 'pg';
import * as dns from 'dns';
import * as util from 'util';
import * as dotenv from 'dotenv';
import { URL } from 'url';

dotenv.config();

const lookup = util.promisify(dns.lookup);

async function main() {
  console.log('--- Starting DNS Debug & PG Connection Test ---');
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) throw new Error('No DATABASE_URL');

  const parsed = new URL(dbUrl);
  const hostname = parsed.hostname;

  console.log(`Resolving hostname: ${hostname}`);

  try {
    // Force IPv4 lookup
    const { address, family } = await lookup(hostname, { family: 4 });
    console.log(`✅ Resolved to IPv4: ${address}`);

    // Construct new connection string with IP but keep Host header for SNI
    // Note: pg might need ssl.servername for SNI to work with IP

    console.log('Attempting connection to IPv4 address...');

    // We modify the pool config to use the IP but set servername for SSL
    const pool = new Pool({
      host: address, // Connect to IP directly
      port: Number(parsed.port) || 5432,
      user: parsed.username,
      password: parsed.password,
      database: parsed.pathname.split('/')[1],
      ssl: {
        rejectUnauthorized: false, // For testing
        servername: hostname, // CRITICAL: SNI needs original hostname
      },
      connectionTimeoutMillis: 10000,
    });

    const client = await pool.connect();
    console.log('✅ Connected to PG via IPv4!');

    const res = await client.query('SELECT version()');
    console.log('✅ Version:', res.rows[0].version);

    client.release();
    await pool.end();

    // If this works, the issue is Dual Stack / IPv6 handling in basic pg connection
  } catch (err) {
    console.error('❌ Error:', err);
  }
}

main();
