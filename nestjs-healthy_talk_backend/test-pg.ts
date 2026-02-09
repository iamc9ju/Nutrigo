import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import { URL } from 'url';

dotenv.config();

async function main() {
  console.log(
    '--- Starting PG Connection Test (Deconstructed + Family: 4) ---',
  );
  const dbUrl = process.env.DATABASE_URL;
  const parsed = new URL(dbUrl!);

  const pool = new Pool({
    host: parsed.hostname,
    port: Number(parsed.port),
    user: parsed.username,
    password: parsed.password,
    database: parsed.pathname.split('/')[1],
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
    // @ts-ignore
    family: 4,
  });

  try {
    const client = await pool.connect();
    console.log('✅ Connected to PG!');

    const res = await client.query('SELECT version()');
    console.log('✅ Version:', res.rows[0].version);

    client.release();
  } catch (err) {
    console.error('❌ Connection Error:', err);
  } finally {
    await pool.end();
  }
}

main();
