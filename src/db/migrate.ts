import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { db } from './index.js';

// Run the migration
async function runMigration() {
  try {
    console.log('Starting migration...');
    await migrate(db, { migrationsFolder: 'drizzle/migrations' });
    console.log('✅ Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
