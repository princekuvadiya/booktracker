import { migrate } from 'drizzle-orm/libsql/migrator';
import { db } from './index.js';
// Run the migration
async function runMigration() {
  try {
    await migrate(db, { migrationsFolder: 'drizzle/migrations' });
    console.log('✅ Migration completed');
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

runMigration();
