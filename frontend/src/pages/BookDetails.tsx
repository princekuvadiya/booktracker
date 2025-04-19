// import { useState, useEffect } from 'react';
// import { useParams, useNavigate, Link } from 'react-router-dom';
// import { booksApi, notesApi } from '../services/api';
// import { Book, Note, NoteFormData } from '../types';
// import LoadingSpinner from '../components/LoadingSpinner';
// import ErrorMessage from '../components/ErrorMessage';
// import React from 'react';
// import './../main.css'; // if you’re using Tailwind or global styles

// const BookDetails = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
  
//   // State
//   const [book, setBook] = useState<Book | null>(null);
//   const [notes, setNotes] = useState<Note[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [newNote, setNewNote] = useState('');
//   const [addingNote, setAddingNote] = useState(false);
  
//   // Fetch book and notes on component mount
//   useEffect(() => {
//     if (!id) return;
    
//     const fetchBookDetails = async () => {
//       setLoading(true);
//       setError(null);
      
//       try {
//         const [bookData, notesData] = await Promise.all([
//           booksApi.getBook(id),
//           notesApi.getBookNotes(id)
//         ]);
        
//         setBook(bookData);
//         setNotes(notesData);
//       } catch (err) {
//         console.error('Error fetching book details:', err);
//         setError('Failed to load book details. Please try again.');
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     fetchBookDetails();
//   }, [id]);
  
//   // Get readable status label
//   const getStatusLabel = (status: string) => {
//     switch (status) {
//       case 'not_started': return 'Not Started';
//       case 'in_progress': return 'In Progress';
//       case 'finished': return 'Finished';
//       default: return status;
//     }
//   };
  
//   // Get status color
//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'not_started': return 'bg-yellow-100 text-yellow-800';
//       case 'in_progress': return 'bg-blue-100 text-blue-800';
//       case 'finished': return 'bg-green-100 text-green-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };
  
//   // Format date
//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return new Intl.DateTimeFormat('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     }).format(date);
//   };
  
//   // Handle book deletion
//   const handleDeleteBook = async () => {
//     if (!book || !id) return;
    
//     if (window.confirm(`Are you sure you want to delete "${book.title}"?`)) {
//       try {
//         await booksApi.deleteBook(id);
//         navigate('/books', { replace: true });
//       } catch (err) {
//         console.error('Error deleting book:', err);
//         setError('Failed to delete book. Please try again.');
//       }
//     }
//   };
  
//   // Handle adding a new note
//   const handleAddNote = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!newNote.trim() || !id) return;
    
//     setAddingNote(true);
    
//     try {
//       const noteData: NoteFormData = {
//         content: newNote,
//         book_id: id
//       };
      
//       const addedNote = await notesApi.createNote(noteData);
//       setNotes([...notes, addedNote]);
//       setNewNote('');
//     } catch (err) {
//       console.error('Error adding note:', err);
//       setError('Failed to add note. Please try again.');
//     } finally {
//       setAddingNote(false);
//     }
//   };
  
//   // Handle note deletion
//   const handleDeleteNote = async (noteId: string) => {
//     if (window.confirm('Are you sure you want to delete this note?')) {
//       try {
//         await notesApi.deleteNote(noteId);
//         setNotes(notes.filter(note => note.id !== noteId));
//       } catch (err) {
//         console.error('Error deleting note:', err);
//         setError('Failed to delete note. Please try again.');
//       }
//     }
//   };
  
//   if (loading) {
//     return (
//       <div className="flex justify-center my-12">
//         <LoadingSpinner size="large" message="Loading book details..." />
//       </div>
//     );
//   }
  
//   if (error) {
//     return (
//       <ErrorMessage 
//         message={error} 
//         onRetry={() => navigate(0)} 
//       />
//     );
//   }
  
//   if (!book) {
//     return (
//       <div className="text-center py-12">
//         <h2 className="text-xl font-semibold text-gray-800 mb-4">Book not found</h2>
//         <Link 
//           to="/books" 
//           className="text-indigo-600 hover:text-indigo-800"
//         >
//           Back to Books
//         </Link>
//       </div>
//     );
//   }
  
//   return (
//     <div>
//       {/* Book details header */}
//       <div className="flex justify-between items-start mb-6">
//         <div>
//           <div className="flex items-center gap-3 mb-1">
//             <h1 className="text-2xl font-bold text-gray-800">{book.title}</h1>
//             <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(book.status)}`}>
//               {getStatusLabel(book.status)}
//             </span>
//           </div>
//           <p className="text-xl text-gray-600">by {book.author}</p>
//           <p className="text-sm text-gray-500 mt-2">Added on {formatDate(book.created_at)}</p>
//         </div>
        
//         <div className="flex gap-3">
//           <Link 
//             to={`/books/${book.id}/edit`}
//             className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50"
//           >
//             Edit Book
//           </Link>
//           <button 
//             onClick={handleDeleteBook}
//             className="bg-red-50 border border-red-300 text-red-700 py-2 px-4 rounded-md hover:bg-red-100"
//           >
//             Delete Book
//           </button>
//         </div>
//       </div>
      
//       {/* Navigation */}
//       <div className="mb-8">
//         <Link 
//           to="/books" 
//           className="text-indigo-600 hover:text-indigo-800 flex items-center"
//         >
//           &larr; Back to Books
//         </Link>
//       </div>
      
//       {/* Notes section */}
//       <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
//         <h2 className="text-xl font-semibold text-gray-800 mb-6">Notes</h2>
        
//         {/* Add note form */}
//         <form onSubmit={handleAddNote} className="mb-8">
//           <div className="mb-4">
//             <textarea
//               value={newNote}
//               onChange={(e) => setNewNote(e.target.value)}
//               placeholder="Add a new note..."
//               className="w-full p-3 border border-gray-300 rounded-md min-h-[100px]"
//               required
//             />
//           </div>
//           <button 
//             type="submit"
//             disabled={addingNote || !newNote.trim()}
//             className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {addingNote ? 'Adding...' : 'Add Note'}
//           </button>
//         </form>
        
//         {/* Notes list */}
//         {notes.length === 0 ? (
//           <div className="text-center py-8 bg-gray-50 rounded-lg">
//             <p className="text-gray-600">No notes yet. Add your first note above.</p>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {notes.map(note => (
//               <div 
//                 key={note.id} 
//                 className="p-4 bg-gray-50 rounded-lg border border-gray-200"
//               >
//                 <div className="flex justify-between items-start mb-2">
//                   <p className="text-xs text-gray-500">{formatDate(note.created_at)}</p>
//                   <button 
//                     onClick={() => handleDeleteNote(note.id)}
//                     className="text-red-600 hover:text-red-800 text-sm"
//                   >
//                     Delete
//                   </button>
//                 </div>
//                 <p className="text-gray-800 whitespace-pre-wrap">{note.content}</p>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default BookDetails;

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { booksApi, notesApi } from '../services/api';
import { Book, Note, NoteFormData } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import React from 'react';
import './../main.css';

const BookDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [book, setBook] = useState<Book | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newNote, setNewNote] = useState('');
  const [addingNote, setAddingNote] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchBookDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        const [bookData, notesData] = await Promise.all([
          booksApi.getBook(id),
          notesApi.getBookNotes(id).catch((err) => {
            if (err?.response?.status === 404) {
              return [];
            }
            throw err;
          }),
        ]);

        setBook(bookData);
        setNotes(notesData);
      } catch (err) {
        console.error('Error fetching book details:', err);
        setError('Failed to load book details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [id]);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'not_started':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'finished':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleDeleteBook = async () => {
    if (!book || !id) return;

    if (window.confirm(`Are you sure you want to delete "${book.title}"?`)) {
      try {
        await booksApi.deleteBook(id);
        navigate('/books', { replace: true });
      } catch (err) {
        console.error('Error deleting book:', err);
        setError('Failed to delete book. Please try again.');
      }
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim() || !id) return;

    setAddingNote(true);

    try {
      const noteData: NoteFormData = {
        content: newNote,
        book_id: id
      };

      const addedNote = await notesApi.createNote(noteData);
      setNotes([...notes, addedNote]);
      setNewNote('');
    } catch (err) {
      console.error('Error adding note:', err);
      setError('Failed to add note. Please try again.');
    } finally {
      setAddingNote(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await notesApi.deleteNote(noteId);
        setNotes(notes.filter(note => note.id !== noteId));
      } catch (err) {
        console.error('Error deleting note:', err);
        setError('Failed to delete note. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center my-12">
        <LoadingSpinner size="large" message="Loading book details..." />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={() => navigate(0)} />;
  }

  if (!book) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Book not found</h2>
        <Link to="/books" className="text-indigo-600 hover:text-indigo-800">
          Back to Books
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Book Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-gray-800">{book.title}</h1>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(book.status)}`}>
              {getStatusLabel(book.status)}
            </span>
          </div>
          <p className="text-xl text-gray-600">by {book.author}</p>
          <p className="text-sm text-gray-500 mt-2">Added on {formatDate(book.created_at)}</p>
        </div>

        <div className="flex gap-3">
          <Link
            to={`/books/${book.id}/edit`}
            className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50"
          >
            Edit Book
          </Link>
          <button
            onClick={handleDeleteBook}
            className="bg-red-50 border border-red-300 text-red-700 py-2 px-4 rounded-md hover:bg-red-100"
          >
            Delete Book
          </button>
        </div>
      </div>

      {/* Back Navigation */}
      <div className="mb-8">
        <Link to="/books" className="text-indigo-600 hover:text-indigo-800 flex items-center">
          &larr; Back to Books
        </Link>
      </div>

      {/* Notes Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Notes</h2>

        {/* Add Note Form */}
        <form onSubmit={handleAddNote} className="mb-8">
          <div className="mb-4">
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add a new note..."
              className="w-full p-3 border border-gray-300 rounded-md min-h-[100px]"
              required
            />
          </div>
          <button
            type="submit"
            disabled={addingNote || !newNote.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {addingNote ? 'Adding...' : 'Add Note'}
          </button>
        </form>

        {/* Notes List */}
        {notes.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-600 mb-2">You haven't added any notes for this book yet.</p>
            <p className="text-gray-500">Use the text area above to add your first note!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notes.map((note) => (
              <div key={note.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-xs text-gray-500">{formatDate(note.created_at)}</p>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Delete
                  </button>
                </div>
                <p className="text-gray-800 whitespace-pre-wrap">{note.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookDetails;
