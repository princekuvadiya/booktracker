import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const books = sqliteTable('books', {
  id: text('id').primaryKey(),
  title: text('title'),
  author: text('author'),
  status: text('status'),
  createdAt: integer('createdAt', { mode: 'timestamp' }),
});

export const notes = sqliteTable('notes', {
  id: text('id').primaryKey(),
  bookId: text('bookId'),
  content: text('content'),
  createdAt: integer('createdAt', { mode: 'timestamp' }),
});
