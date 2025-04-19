// import { Elysia } from 'elysia';
//   import type { ErrorHandler } from 'elysia';

//   import corsModule from '@elysiajs/cors';
//   import swaggerModule from '@elysiajs/swagger';
// import { booksRoutes } from './routes/books.js';
// import { notesRoutes } from './routes/notes.js';
// import { config } from 'dotenv';

// // Load environment variables
// config();
// const cors = corsModule.default;
// const swagger = swaggerModule.default;

// const PORT = process.env.PORT || 3000;

// // Initialize the Elysia app
// const app = new Elysia()
//   // Add middleware
//   .use(cors())
//   .use(swagger({
//     documentation: {
//       info: {
//         title: 'Book Tracker API',
//         version: '1.0.0',
//         description: 'API for tracking books and notes'
//       }
//     }
//   }))

//   .onError(<ErrorHandler>(({ code, error, set }) => {
//     console.error(`Error: ${code}`, error);
  
//     if (code === 'VALIDATION') {
//       set.status = 400;
//       return {
//         error: 'Validation Error',
//         message: error.message,
//         details: error.all
//       };
//     }
  
//     if (code === 'NOT_FOUND') {
//       set.status = 404;
//       return { error: 'Not Found', message: 'The requested resource was not found' };
//     }
  
//     set.status = 500;
//     return { error: 'Internal Server Error', message: error.message };
//   }))
  
//   // Mount routes
//   .use(booksRoutes)
//   .use(notesRoutes)
//   // Add root route
//   .get('/', () => ({ message: 'Book Tracker API is running' }));

// // Start the server
// app.listen(PORT, () => {
//   console.log(`🚀 Server running at http://localhost:${PORT}`);
  
//   console.log(`📚 Documentation available at http://localhost:${PORT}/swagger`);
// });

import { Elysia } from 'elysia';
import { booksRoutes } from './routes/books.js';
import { notesRoutes } from './routes/notes.js';
import { config } from 'dotenv';

// Load environment variables
config();

const PORT = process.env.PORT || 3000;

const start = async () => {
  // Use dynamic import to get default exports from ESM packages
  const { default: cors } = await import('@elysiajs/cors');
  const { default: swagger } = await import('@elysiajs/swagger');

  const app = new Elysia()
    // CORS configuration with allowed methods (GET, PUT, POST, DELETE, etc.)
    .use(cors({
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],  // Specify the methods you want to allow
      allowedHeaders: ['Content-Type', 'Authorization'],  // Specify the headers that are allowed
      credentials: true,  // Allow cookies and authentication headers
    }))
    // Add Swagger documentation
    .use(swagger({
      documentation: {
        info: {
          title: 'Book Tracker API',
          version: '1.0.0',
          description: 'API for tracking books and notes'
        }
      }
    }))
    // Error handling
    .onError(({ code, error, set }) => {
      set.status = code === 'VALIDATION' ? 400 : code === 'NOT_FOUND' ? 404 : 500;
      return {
        error: code === 'VALIDATION'
          ? 'Validation Error'
          : code === 'NOT_FOUND'
          ? 'Not Found'
          : 'Internal Server Error',
        message: error.message,
        ...(code === 'VALIDATION' && { details: error.all })
      };
    })
    // Use routes for books and notes
    .use(notesRoutes)
    .use(booksRoutes)
    // Root route
    .get('/', () => ({ message: 'Book Tracker API is running' }));

  // Start the server
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`📚 Documentation available at http://localhost:${PORT}/swagger`);
  });
};

start();
