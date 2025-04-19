interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
}
import React from 'react';
import './../main.css'; // if you’re using Tailwind or global styles


const LoadingSpinner = ({ size = 'medium', message = 'Loading...' }: LoadingSpinnerProps) => {
  const sizeClasses = {
    small: 'w-4 h-4 border-2',
    medium: 'w-8 h-8 border-4',
    large: 'w-12 h-12 border-4'
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div 
        className={`${sizeClasses[size]} rounded-full border-indigo-600 border-t-transparent animate-spin`} 
        role="status" 
        aria-label="loading"
      />
      {message && (
        <p className="mt-2 text-gray-600">{message}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;

