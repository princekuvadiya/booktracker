import type { Config } from 'drizzle-kit';
import { config } from 'dotenv';

// Load environment variables
config();

const { DATABASE_URL } = process.env;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

export default {
  schema: './src/models',
  out: './drizzle/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: DATABASE_URL
  },
  dialect: 'pg'
} satisfies Config;
