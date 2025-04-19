import { Link } from 'react-router-dom';
import { Book } from '../types';
import React from 'react';
import './../main.css'; // if you’re using Tailwind or global styles

interface BookCardProps {
  book: Book;
  onDelete: (id: string) => void;
}

const BookCard = ({ book, onDelete }: BookCardProps) => {
  // Format the date string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  // Define status badge color based on status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'not_started':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'finished':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get readable status label
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'not_started':
        return 'Not Started';
      case 'in_progress':
        return 'In Progress';
      case 'finished':
        return 'Finished';
      default:
        return status;
    }
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${book.title}"?`)) {
      onDelete(book.id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
      <div className="p-5">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">
            {book.title}
          </h3>
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(book.status)}`}>
            {getStatusLabel(book.status)}
          </span>
        </div>
        
        <p className="text-gray-600 mb-3">by {book.author}</p>
        
        <p className="text-xs text-gray-500 mb-4">
          Added on {formatDate(book.created_at)}
        </p>
        
        <div className="flex justify-between items-center">
          <Link 
            to={`/books/${book.id}`}
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
          >
            View Details
          </Link>
          
          <div className="flex space-x-2">
            <Link 
              to={`/books/${book.id}/edit`}
              className="text-gray-600 hover:text-gray-800 text-sm px-2 py-1 rounded-md hover:bg-gray-100"
            >
              Edit
            </Link>
            <button 
              onClick={handleDelete}
              className="text-red-600 hover:text-red-800 text-sm px-2 py-1 rounded-md hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;

