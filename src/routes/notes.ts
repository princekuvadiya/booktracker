import express, { Request, Response, NextFunction } from 'express';
import { db } from '../db/index.js';
import { notes } from '../models/index.js';
import { noteSchema } from '../schemas/index.js';
import { v4 as uuid } from 'uuid';
import { eq } from 'drizzle-orm';

export const noteRouter = express.Router();

const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// GET notes by bookId
noteRouter.get('/:id', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await db.select().from(notes).where(eq(notes.bookId, id));
  res.json(result);
}));

// POST new note under bookId
noteRouter.post('/:id', asyncHandler(async (req: Request, res: Response) => {
  const { id: bookId } = req.params;
  const data = noteSchema.parse({
    ...req.body,
    id: uuid(),
    bookId,
    createdAt: new Date(),
  });
  await db.insert(notes).values(data);
  res.status(201).json(data);
}));
