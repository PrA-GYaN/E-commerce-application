import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { categories } from './schema';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('DATABASE_URL is not defined in environment variables');
  process.exit(1); // Exit the process if DATABASE_URL is missing
}

let db, client;

try {
//   client = postgres(connectionString, { prepare: false });
client = postgres(connectionString, { idle_timeout: 30000 },{ prepare: false },{
    ssl: {
      rejectUnauthorized: false // or true, depending on your server settings
    },
  });
  db = drizzle(client);
  console.log('Database connection successful');
} catch (error) {
  console.error('Database connection failed:', error.message || error);
  process.exit(1); // Exit the process if connection fails
}

// Export after the connection setup
export { db, client };