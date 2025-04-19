import express, { Request, Response, NextFunction } from 'express';
import { db } from '../db/index.js';
import { eq } from 'drizzle-orm';
import { books } from '../models/index.js';
import { bookSchema } from '../schemas/index.js';
import { v4 as uuid } from 'uuid';
import { ZodError } from 'zod';
// Create the router
export const bookRouter = express.Router();

// Error handling middleware
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// GET all books
bookRouter.get('/', asyncHandler(async (req: Request, res: Response) => {
  try {
    const result = await db.select().from(books);
    res.json(result);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: 'Failed to fetch books from database' });
  }
}));

// POST new book
bookRouter.post('/', asyncHandler(async (req: Request, res: Response) => {
  try {
    const data = bookSchema.parse({ ...req.body, id: uuid(), createdAt: new Date() });
    await db.insert(books).values(data);
    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating book:', error);
    if (error instanceof ZodError) {
      res.status(400).json({ error: 'Invalid book data', details: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to add book to database' });
    }
  }
}));

// GET book by ID

bookRouter.get('/:id', asyncHandler(async (req: Request, res: Response) => {
  try {
    const result = await db.select().from(books).where(eq(books.id, req.params.id));
    if (result.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json(result[0]);
  } catch (error) {
    console.error(`Error fetching book ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to fetch book from database' });
  }
}));

// PUT update book
bookRouter.put('/:id', asyncHandler(async (req: Request, res: Response) => {
  try {
    const data = bookSchema.partial().parse(req.body);
    await db.update(books).set(data).where(eq(books.id, req.params.id));
    res.json({ updated: true });
  } catch (error) {
    console.error(`Error updating book ${req.params.id}:`, error);
    if (error instanceof ZodError) {
      res.status(400).json({ error: 'Invalid book data', details: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to update book' });
    }
  }
}));

// DELETE book
bookRouter.delete('/:id', asyncHandler(async (req: Request, res: Response) => {
  try {
    await db.delete(books).where(eq(books.id, req.params.id));
    res.json({ deleted: true });
  } catch (error) {
    console.error(`Error deleting book ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to delete book' });
  }
}));

// Error middleware
bookRouter.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Book route error:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});
