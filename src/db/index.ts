import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from '../models/index.js';
import { join } from 'path';
// Use absolute path for the database file to ensure consistency
const dbFilePath = join(process.cwd(), 'booktracker.db');

// Initialize libsql client
const client = createClient({
  url: `file:${dbFilePath}`,
});

// Initialize drizzle with libsql
export const db = drizzle(client, { schema });
