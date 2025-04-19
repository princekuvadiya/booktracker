import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { booksApi } from '../services/api';
import { Book } from '../types';
import BookCard from '../components/BookCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import './../main.css'; // if you’re using Tailwind or global styles

type SortField = 'title' | 'author' | 'status' | 'created_at';
type SortOrder = 'asc' | 'desc';
import React from 'react';

const BookList = () => {
  // State
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>('title');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [filter, setFilter] = useState<string>('');

  // Fetch books when component mounts
  useEffect(() => {
    fetchBooks();
  }, []);

  // Fetch books from API
  const fetchBooks = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await booksApi.getBooks();
      setBooks(data);
    } catch (err) {
      setError('Failed to fetch books. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle book deletion
  const handleDelete = async (id: string) => {
    try {
      await booksApi.deleteBook(id);
      setBooks(books.filter(book => book.id !== id));
    } catch (err) {
      setError('Failed to delete book. Please try again.');
      console.error(err);
    }
  };

  // Sort books based on current sort field and order
  const sortedBooks = [...books].sort((a, b) => {
    const fieldA = a[sortField];
    const fieldB = b[sortField];
    
    if (fieldA < fieldB) return sortOrder === 'asc' ? -1 : 1;
    if (fieldA > fieldB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // Filter books by title or author
  const filteredBooks = sortedBooks.filter(book => 
    book.title.toLowerCase().includes(filter.toLowerCase()) || 
    book.author.toLowerCase().includes(filter.toLowerCase())
  );

  // Toggle sort order
  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Render sort indicator
  const renderSortIndicator = (field: SortField) => {
    if (sortField !== field) return null;
    
    return sortOrder === 'asc' 
      ? <span className="ml-1">↑</span> 
      : <span className="ml-1">↓</span>;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Books</h1>
        <Link 
          to="/books/new" 
          className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md font-medium"
        >
          Add New Book
        </Link>
      </div>

      {/* Filters and sorting */}
      <div className="mb-6 bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by title or author..."
              className="w-full p-2 border border-gray-300 rounded-md"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">Sort by:</span>
            <button 
              onClick={() => handleSort('title')} 
              className={`px-2 py-1 rounded ${sortField === 'title' ? 'bg-indigo-100 text-indigo-800' : 'hover:bg-gray-100'}`}
            >
              Title{renderSortIndicator('title')}
            </button>
            <button 
              onClick={() => handleSort('author')} 
              className={`px-2 py-1 rounded ${sortField === 'author' ? 'bg-indigo-100 text-indigo-800' : 'hover:bg-gray-100'}`}
            >
              Author{renderSortIndicator('author')}
            </button>
            <button 
              onClick={() => handleSort('status')} 
              className={`px-2 py-1 rounded ${sortField === 'status' ? 'bg-indigo-100 text-indigo-800' : 'hover:bg-gray-100'}`}
            >
              Status{renderSortIndicator('status')}
            </button>
            <button 
              onClick={() => handleSort('created_at')} 
              className={`px-2 py-1 rounded ${sortField === 'created_at' ? 'bg-indigo-100 text-indigo-800' : 'hover:bg-gray-100'}`}
            >
              Date Added{renderSortIndicator('created_at')}
            </button>
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <ErrorMessage 
          message={error} 
          onRetry={fetchBooks} 
        />
      )}

      {/* Loading state */}
      {loading ? (
        <div className="flex justify-center my-12">
          <LoadingSpinner size="large" message="Loading books..." />
        </div>
      ) : (
        // Empty state
        filteredBooks.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            {filter ? (
              <div>
                <p className="text-gray-600 mb-4">No books match your search criteria.</p>
                <button 
                  onClick={() => setFilter('')}
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  Clear search
                </button>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">No books yet</h3>
                <p className="text-gray-600 mb-4">Start building your collection by adding your first book.</p>
                <Link 
                  to="/books/new" 
                  className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md font-medium"
                >
                  Add Book
                </Link>
              </div>
            )}
          </div>
        ) : (
          // Book grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map(book => (
              <BookCard 
                key={book.id} 
                book={book} 
                onDelete={handleDelete} 
              />
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default BookList;

