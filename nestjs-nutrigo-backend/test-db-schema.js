const { Client } = require('pg');
const client = new Client({
  connectionString: process.env.DATABASE_URL
});

async function check() {
  await client.connect();
  const res = await client.query(`
    SELECT t.typname, e.enumlabel
    FROM pg_type t
    JOIN pg_enum e ON t.oid = e.enumtypid
    WHERE t.typname = 'UserRole';
  `);
  console.log('Enum values in DB:', res.rows);
  await client.end();
}
check().catch(console.error);
