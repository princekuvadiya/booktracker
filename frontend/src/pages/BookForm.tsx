import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { booksApi } from '../services/api';
import { BookFormData, BookStatusOptions } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import React from 'react';
import './../main.css'; // if you’re using Tailwind or global styles


// Form validation schema using Zod
const bookSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  author: z.string().min(1, 'Author is required').max(100, 'Author must be less than 100 characters'),
  status: z.enum(['not_started', 'in_progress', 'finished'], {
    errorMap: () => ({ message: 'Please select a valid status' }),
  }),
});

// Type for our form values
type BookFormValues = z.infer<typeof bookSchema>;

const BookForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  // Form state
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<BookFormValues>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: '',
      author: '',
      status: 'not_started',
    },
  });
  
  // Fetch book data when in edit mode
  useEffect(() => {
    if (!isEditMode) return;
    
    const fetchBook = async () => {
      try {
        const book = await booksApi.getBook(id as string);
        
        // Set form values
        setValue('title', book.title);
        setValue('author', book.author);
        setValue('status', book.status as 'not_started' | 'in_progress' | 'finished');
      } catch (err) {
        console.error('Error fetching book:', err);
        setError('Failed to load book. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBook();
  }, [id, isEditMode, setValue]);
  
  // Handle form submission
  const onSubmit = async (data: BookFormValues) => {
    setSubmitting(true);
    setError(null);
    
    try {
      if (isEditMode && id) {
        // Update existing book
        
        await booksApi.updateBook(id, data);
        console.log(data);
      } else {
        // Create new book
        await booksApi.createBook(data);
      }
      
      setSuccess(true);
      
      // Reset form if creating a new book
      if (!isEditMode) {
        reset();
      }
      
      // Navigate away after a delay
      setTimeout(() => {
        if (isEditMode) {
          // Go back to book details
          navigate(`/books/${id}`);
        } else {
          // Show success message for a bit before redirecting
          navigate('/books');
        }
      }, 1500);
    } catch (err) {
      console.error('Error saving book:', err);
      setError(`Failed to ${isEditMode ? 'update' : 'create'} book. Please try again.`);
    } finally {
      setSubmitting(false);
    }
  };
  
  // Page title
  const pageTitle = isEditMode ? 'Edit Book' : 'Add New Book';
  
  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center my-12">
        <LoadingSpinner size="large" message="Loading book data..." />
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{pageTitle}</h1>
      </div>
      
      {/* Navigation */}
      <div className="mb-8">
        <Link 
          to={isEditMode ? `/books/${id}` : '/books'} 
          className="text-indigo-600 hover:text-indigo-800 flex items-center"
        >
          &larr; {isEditMode ? 'Back to Book Details' : 'Back to Books'}
        </Link>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="mb-6">
          <ErrorMessage message={error} />
        </div>
      )}
      
      {/* Success message */}
      {success && (
        <div className="mb-6 bg-green-50 p-4 rounded-md border border-green-200">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                Book {isEditMode ? 'updated' : 'created'} successfully!
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Book form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title field */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              id="title"
              type="text"
              {...register('title')}
              className={`w-full px-4 py-2 border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              placeholder="Enter book title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>
          
          {/* Author field */}
          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
              Author
            </label>
            <input
              id="author"
              type="text"
              {...register('author')}
              className={`w-full px-4 py-2 border ${errors.author ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              placeholder="Enter author name"
            />
            {errors.author && (
              <p className="mt-1 text-sm text-red-600">{errors.author.message}</p>
            )}
          </div>
          
          {/* Status field */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Reading Status
            </label>
            <select
              id="status"
              {...register('status')}
              className={`w-full px-4 py-2 border ${errors.status ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            >
              {BookStatusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.status && (
              <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
            )}
          </div>
          
          {/* Form buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <Link
              to={isEditMode ? `/books/${id}` : '/books'}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <span className="flex items-center space-x-2">
<LoadingSpinner size="small" message={undefined} />
<span>{isEditMode ? 'Updating...' : 'Creating...'}</span>
                </span>
              ) : (
                <span>{isEditMode ? 'Update Book' : 'Add Book'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookForm;

