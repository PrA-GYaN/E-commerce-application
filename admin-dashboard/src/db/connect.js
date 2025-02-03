import pkg from 'pg';
const { Client } = pkg;
 
const DATABASE_URL="postgresql://postgres:[qwerty123]@db.sxrfzdfowxbfzupcdkcl.supabase.co:5432/postgres";

const client = new Client({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function testConnection() {
  try {
    await client.connect();
    console.log('Connected to Supabase');
    const res = await client.query('SELECT * FROM categories');
    console.log('Categories:', res.rows);
  } catch (err) {
    console.error('Error connecting to database:', err);
  } finally {
    await client.end();
  }
}

testConnection();