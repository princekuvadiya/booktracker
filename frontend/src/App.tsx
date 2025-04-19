import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import React from 'react';
import './main.css'; // if you’re using Tailwind or global styles

import BookList from './pages/BookList';
import BookDetails from './pages/BookDetails';
import BookForm from './pages/BookForm';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Book routes */}
          <Route index element={<BookList />} />
          <Route path="books">
            <Route index element={<BookList />} />
            <Route path="new" element={<BookForm />} />
            <Route path=":id" element={<BookDetails />} />
            <Route path=":id/edit" element={<BookForm />} />
          </Route>
          
          {/* 404 page */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

