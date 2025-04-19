// Book Types
export interface Book {
  id: string;
  title: string;
  author: string;
  status: 'not_started' | 'in_progress' | 'finished';
  created_at: string;
}

export interface BookFormData {
  title: string;
  author: string;
  status: 'not_started' | 'in_progress' | 'finished';
}

// Note Types
export interface Note {
  id: string;
  book_id: string;
  content: string;
  created_at: string;
}

export interface NoteFormData {
  content: string;
  book_id?: string; // Optional because it might be provided via route params
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  error?: string;
}

export interface ErrorResponse {
  error: string;
  message: string;
  details?: any;
}

// Form State Types
export interface FormState {
  isSubmitting: boolean;
  isSuccess: boolean;
  error: string | null;
}

// Status Display Options
export const BookStatusOptions = [
  { value: 'not_started', label: 'Not Started' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'finished', label: 'Finished' }
];

