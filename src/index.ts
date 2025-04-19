import express from 'express';
import { bookRouter } from './routes/books.js';
import { noteRouter } from './routes/notes.js';
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Routes
app.use('/books', bookRouter);
app.use('/notes', noteRouter);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
