import { Link, NavLink } from 'react-router-dom';
import { APP_CONFIG } from '../config';
import React from 'react';
import './../main.css'; // if you’re using Tailwind or global styles

const Navbar = () => {
  return (
    <nav className="bg-indigo-600 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <h1 className="text-white font-bold text-xl">
                {APP_CONFIG.name}
              </h1>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <NavLink 
                to="/" 
                className={({ isActive }) => 
                  isActive
                    ? "bg-indigo-800 text-white px-3 py-2 rounded-md text-sm font-medium"
                    : "text-indigo-100 hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium"
                }
                end
              >
                Home
              </NavLink>
              <NavLink 
                to="/books" 
                className={({ isActive }) => 
                  isActive
                    ? "bg-indigo-800 text-white px-3 py-2 rounded-md text-sm font-medium"
                    : "text-indigo-100 hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium"
                }
              >
                Books
              </NavLink>
              <NavLink 
                to="/books/new" 
                className={({ isActive }) => 
                  isActive
                    ? "bg-indigo-800 text-white px-3 py-2 rounded-md text-sm font-medium"
                    : "text-indigo-100 hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium"
                }
              >
                Add Book
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

