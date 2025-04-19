import type { Config } from 'drizzle-kit';
import { join } from 'path';

// Use absolute path for consistent reference
const dbFilePath = join(process.cwd(), 'booktracker.db');

export default {
  schema: './src/models',
  out: './drizzle/migrations',
  driver: 'durable-sqlite',
  dbCredentials: {
    url: `file:${dbFilePath}`
  },
  dialect: 'sqlite'
} satisfies Config;
