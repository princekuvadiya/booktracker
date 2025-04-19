import { z } from 'zod';

export const bookSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  author: z.string().min(1),
  status: z.enum(['not_started', 'in_progress', 'finished']),
  createdAt: z.date(),
});

export const noteSchema = z.object({
  id: z.string().uuid(),
  bookId: z.string().uuid(),
  content: z.string().min(1),
  createdAt: z.date(),
});
