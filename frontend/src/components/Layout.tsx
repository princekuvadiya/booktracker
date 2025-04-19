import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import React from 'react';
import './../main.css'; // if you’re using Tailwind or global styles

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <footer className="bg-white shadow-inner py-4 mt-12">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>© {new Date().getFullYear()} Book Tracker | Built with Bun and ElysiaJS</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

