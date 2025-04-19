import { Elysia, t } from 'elysia';
import { db } from '../db/index.js';
import { eq } from 'drizzle-orm';
import { books } from '../models/index.js';
import { v4 as uuid } from 'uuid';
import { z } from 'zod';


// Define the book schema for Elysia's validation
// Updated to match our PostgreSQL table structure
const createBookSchema = t.Object({
  title: t.String({ minLength: 1 }),
  author: t.String({ minLength: 1 }),
  status: t.Union([
    t.Literal('not_started'),
    t.Literal('in_progress'),
    t.Literal('finished')
  ]),
  });

const updateBookSchema = t.Partial(createBookSchema);

const paramsSchema = t.Object({
  bookId: t.String({ format: 'uuid' }),
});

// Create the books routes Elysia plugin
export const booksRoutes = new Elysia({ prefix: '/books' })
  // GET all books
  .get('/', async () => {
    try {
      const result = await db.select().from(books);
      return result;
    } catch (error) {
      console.error('Error fetching books:', error);
      throw new Error('Failed to fetch books from database');
    }
  })

  // POST new book
  .post('/', 
    async ({ body, set }) => {
      // Generate UUID and set timestamps
      const newBook = {
        id: uuid(),
        title: body.title,
        author: body.author,
        status: body.status,
        // created_at will be set by default in the database
      };
      
      try {
        await db.insert(books).values(newBook);
        set.status = 201;
        return {
          id: newBook.id,
          title: newBook.title,
          author: newBook.author,
          status: newBook.status,
          created_at: new Date()
        };
      } catch (error) {
        console.error('Error creating book:', error);
        throw new Error('Failed to add book to database');
      }
    }, 
    {
      body: createBookSchema
    }
  )

  // GET book by ID
  .get('/:bookId', 
    async ({ params, set }) => {
      try {
        const result = await db.select().from(books).where(eq(books.id, params.bookId));
      console.log(params.bookId);
      
        if (result.length === 0) {
          set.status = 404;
          return { error: 'Book not found' };
        }
        
        return result[0];
      } catch (error) {
        console.error(`Error fetching book ${params.bookId}:`, error);
        throw new Error('Failed to fetch book from database');
      }
    }, 
    {
      params: paramsSchema
    }
  )

  // PUT update book
  .put('/:bookId', 
    async ({ params, body, set }) => {
      try {
        const result = await db.select().from(books).where(eq(books.id, params.bookId));
        console.log(params.bookId);

        if (result.length === 0) {
          set.status = 404;
          return { error: 'Book not found' };
        }
        
        await db.update(books)
          .set(body)
          .where(eq(books.id, params.bookId));
          
        return { updated: true, id: params.bookId };
      } catch (error) {
        console.error(`Error updating book ${params.bookId}:`, error);
        throw new Error('Failed to update book');
      }
    }, 
    {
      params: paramsSchema,
      body: updateBookSchema
    }
  )

  // DELETE book
  .delete('/:bookId', 
    async ({ params, set }) => {
      try {
        const result = await db.select().from(books).where(eq(books.id, params.bookId));
        
        if (result.length === 0) {
          set.status = 404;
          return { error: 'Book not found' };
        }
        
        await db.delete(books).where(eq(books.id, params.bookId));
        return { deleted: true, id: params.bookId};
      } catch (error) {
        console.error(`Error deleting book ${params.bookId}:`, error);
        throw new Error('Failed to delete book');
      }
    }, 
    {
      params: paramsSchema
    }
  );
