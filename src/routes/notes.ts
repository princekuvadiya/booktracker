import { Elysia, t } from 'elysia';
import { db } from '../db/index.js';
import { notes, books } from '../models/index.js';
import { v4 as uuid } from 'uuid';
import { eq } from 'drizzle-orm';

// Define validation schemas for Elysia
const createNoteSchema = t.Object({
  content: t.String({ minLength: 1 }),
});

const updateNoteSchema = t.Partial(createNoteSchema);

const noteParamsSchema = t.Object({
  id: t.String({ format: 'uuid' }),
});

const bookParamsSchema = t.Object({
  bookId: t.String({ format: 'uuid' }),
});

// Create the notes routes Elysia plugin
export const notesRoutes = new Elysia()
  // GET all notes
  .get('/notes', async () => {
    try {
      const result = await db.select().from(notes);
      return result;
    } catch (error) {
      console.error('Error fetching notes:', error);
      throw new Error('Failed to fetch notes from database');
    }
  })

  // GET note by ID
  .get('/notes/:id', 
    async ({ params, set }) => {
      try {
        const result = await db.select().from(notes).where(eq(notes.id, params.id));
        
        if (result.length === 0) {
          set.status = 404;
          return { error: 'Note not found' };
        }
        
        return result[0];
      } catch (error) {
        console.error(`Error fetching note ${params.id}:`, error);
        throw new Error('Failed to fetch note from database');
      }
    },
    {
      params: noteParamsSchema
    }
  )

//   // GET notes by bookId
//   .get('/books/:bookId/notes', 
//     async ({ params }) => {
//       try {
//         const bookResult = await db.select().from(books).where(eq(books.id, params.bookId));
        
//         if (bookResult.length === 0) {
//           console.log(`Book with ID ${params.bookId} not found`);
//           return { error: 'Book not found', notes: [] };
//         }
        
//         const result = await db.select().from(notes).where(eq(notes.book_id, params.bookId));
              
//         return result;
//       } catch (error) {
//         console.error(`Error fetching notes for book ${params.bookId}:`, error);
//         throw new Error('Failed to fetch notes from database');
//       }
//     },
//     {
//       params: bookParamsSchema
//     }
//   )
// // Remove the old route using :id if it exists

.get('/books/:bookId/notes', 
  async ({ params }) => {
    try {
      const bookResult = await db.select().from(books).where(eq(books.id, params.bookId));
      
      if (bookResult.length === 0) {
        console.log(`Book with ID ${params.bookId} not found`);
        return { error: 'Book not found', notes: [] };
      }
      
      const result = await db.select().from(notes).where(eq(notes.book_id, params.bookId));
      return  result ;
    } catch (error) {
      console.error(`Error fetching notes for book ${params.bookId}:`, error);
      throw new Error('Failed to fetch notes from database');
    }
  },
  {
    params: bookParamsSchema // uses `bookId`
  }
)

  // POST new note
  .post('/notes', 
    async ({ body, set }) => {
      try {
        const newNote = {
          id: uuid(),
          content: body.content,
          book_id: body.book_id,
          // created_at will be set by default in the database
        };
        
        // Check if book exists
        const bookResult = await db.select().from(books).where(eq(books.id, body.book_id));
        
        if (bookResult.length === 0) {
          set.status = 404;
          return { error: 'Book not found' };
        }
        
        await db.insert(notes).values(newNote);
        set.status = 201;
        return {
          id: newNote.id,
          content: newNote.content,
          book_id: newNote.book_id,
          created_at: new Date()
        };
      } catch (error) {
        console.error('Error creating note:', error);
        throw new Error('Failed to add note to database');
      }
    },
    {
      body: t.Object({
        content: t.String({ minLength: 1 }),
        book_id: t.String({ format: 'uuid' })
      })
    }
  )

  // POST new note under bookId
  .post('/books/:bookId/notes', 
    async ({ params, body, set }) => {
      try {
        // Check if book exists
        const bookResult = await db.select().from(books).where(eq(books.id, params.bookId));
        
        if (bookResult.length === 0) {

          set.status = 404;
          return { error: 'Book not found' };
        }
        
        const newNote = {
          id: uuid(),
          content: body.content,
          book_id: params.bookId,
          // created_at will be set by default in the database
        };
        
        await db.insert(notes).values(newNote);
        set.status = 201;
        return {
          id: newNote.id,
          content: newNote.content,
          book_id: newNote.book_id,
          created_at: new Date()
        };
      } catch (error) {
        console.error('Error creating note:', error);
        throw new Error('Failed to add note to database');
      }
    },
    {
      params: bookParamsSchema,
      body: createNoteSchema
    }
  )

  // PUT update note
  .put('/notes/:id', 
    async ({ params, body, set }) => {
      try {
        const result = await db.select().from(notes).where(eq(notes.id, params.id));
        
        if (result.length === 0) {
          set.status = 404;
          return { error: 'Note not found' };
        }
        
        await db.update(notes)
          .set(body)
          .where(eq(notes.id, params.id));
          
        return { updated: true, id: params.id };
      } catch (error) {
        console.error(`Error updating note ${params.id}:`, error);
        throw new Error('Failed to update note');
      }
    },
    {
      params: noteParamsSchema,
      body: updateNoteSchema
    }
  )

  // DELETE note
  .delete('/notes/:id', 
    async ({ params, set }) => {
      try {
        const result = await db.select().from(notes).where(eq(notes.id, params.id));
        
        if (result.length === 0) {
          set.status = 404;
          return { error: 'Note not found' };
        }
        
        await db.delete(notes).where(eq(notes.id, params.id));
        return { deleted: true, id: params.id };
      } catch (error) {
        console.error(`Error deleting note ${params.id}:`, error);
        throw new Error('Failed to delete note');
      }
    },
    {
      params: noteParamsSchema
    }
  );
