import axios, { AxiosError, AxiosResponse } from 'axios';
import { API_URL, API_TIMEOUT } from '../config';
import { 
  Book, 
  BookFormData, 
  Note, 
  NoteFormData, 
  ApiResponse, 
  ErrorResponse 
} from '../types';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Request interceptor for adding headers, etc.
api.interceptors.request.use(
  config => {
    // You can add auth tokens here if needed in the future
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor for global error handling
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<ErrorResponse>) => {
    // Handle specific error cases
    const errorMessage = error.response?.data?.message || error.message || 'An unknown error occurred';
    
    // You can handle different status codes here
    if (error.response?.status === 404) {
      console.error('Resource not found:', errorMessage);
    } else if (error.response?.status === 401) {
      console.error('Unauthorized:', errorMessage);
      // Handle auth errors if needed in the future
    } else if (error.response?.status === 400) {
      console.error('Validation error:', errorMessage);
    } else {
      console.error('API error:', errorMessage);
    }
    
    return Promise.reject(error);
  }
);

// Helper function to handle responses and errors
const handleResponse = async <T>(promise: Promise<AxiosResponse<T>>): Promise<T> => {
  try {
    const response = await promise;
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw error;
  }
};

// Books API
export const booksApi = {
  // Get all books
  getBooks: () => 
    handleResponse<Book[]>(api.get('/books')),
  
  // Get a single book by ID
  getBook: (id: string) => 
    handleResponse<Book>(api.get(`/books/${id}`)),
  
  // Create a new book
  createBook: (data: BookFormData) => 
    handleResponse<Book>(api.post('/books', data)),
  
  // Update an existing book
  updateBook: (id: string, data: Partial<BookFormData>) => 
    handleResponse<{updated: boolean, id: string}>(api.put(`/books/${id}`, data)),
  
  // Delete a book
  deleteBook: (id: string) => 
    handleResponse<{deleted: boolean, id: string}>(api.delete(`/books/${id}`))
};

// Notes API
export const notesApi = {
  // Get all notes
  getNotes: () => 
    handleResponse<Note[]>(api.get('/notes')),
  
  // Get notes for a specific book
  getBookNotes: (bookId: string) => 
    handleResponse<Note[]>(api.get(`/books/${bookId}/notes`)),
  
  // Get a single note by ID
  getNote: (id: string) => 
    handleResponse<Note>(api.get(`/notes/${id}`)),
  
  // Create a new note
  createNote: (data: NoteFormData) => 
    handleResponse<Note>(api.post('/notes', data)),
  
  // Create a new note for a specific book
  createBookNote: (bookId: string, data: Omit<NoteFormData, 'book_id'>) => 
    handleResponse<Note>(api.post(`/books/${bookId}/notes`, data)),
  
  // Update an existing note
  updateNote: (id: string, data: Partial<Omit<NoteFormData, 'book_id'>>) => 
    handleResponse<{updated: boolean, id: string}>(api.put(`/notes/${id}`, data)),
  
  // Delete a note
  deleteNote: (id: string) => 
    handleResponse<{deleted: boolean, id: string}>(api.delete(`/notes/${id}`))
};

export default {
  books: booksApi,
  notes: notesApi
};

