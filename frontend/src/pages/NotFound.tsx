import { Link } from 'react-router-dom';
import React from 'react';
import './../main.css'; // if you’re using Tailwind or global styles

const NotFound = () => {
  return (
    <div className="text-center py-12">
      <h1 className="text-4xl font-bold text-indigo-700 mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
      <p className="text-gray-600 mb-8">
        Sorry, we couldn't find the page you're looking for.
      </p>
      <Link 
        to="/" 
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-md"
      >
        Return to Home
      </Link>
    </div>
  );
};

export default NotFound;

