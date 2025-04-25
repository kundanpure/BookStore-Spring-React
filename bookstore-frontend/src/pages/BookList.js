// src/pages/BookList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookService } from '../Services/api';
import BookCard from '../components/BookCard';
import Pagination from '../components/Pagination';
import './BookList.css';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [sortBy, setSortBy] = useState('price');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    author: '',
    category: '',
    rating: '',
  });

  useEffect(() => {
    fetchBooks();
  }, [page, sortBy]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await bookService.getPaginatedBooks(page, 6, sortBy);
      setBooks(response.content);
      setTotalPages(response.totalPages);
    } catch (err) {
      setError('Failed to fetch books');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (searchTerm.trim()) {
        const response = await bookService.searchBooks(searchTerm);
        setBooks(response);
        setTotalPages(1); // Reset pagination for search results
      } else {
        fetchBooks();
      }
    } catch (err) {
      setError('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { author, category, rating } = filters;
      if (author || category || rating) {
        const response = await bookService.filterBooks(
          author || null,
          category || null,
          rating ? parseFloat(rating) : null
        );
        setBooks(response);
        setTotalPages(1); // Reset pagination for filtered results
      } else {
        fetchBooks();
      }
    } catch (err) {
      setError('Filter failed');
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setFilters({
      author: '',
      category: '',
      rating: '',
    });
    fetchBooks();
  };

  return (
    <div className="book-list-page">
      <div className="book-list-header">
        <h1>Books</h1>
        <Link to="/books/add" className="btn">Add New Book</Link>
      </div>

      <div className="book-list-filters">
        <div className="search-form">
          <form onSubmit={handleSearch}>
            <div className="search-group">
              <input
                type="text"
                placeholder="Search by title..."
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="form-control"
              />
              <button type="submit" className="btn">Search</button>
            </div>
          </form>
        </div>

        <form onSubmit={handleFilter} className="filter-form">
          <div className="filter-controls">
            <div className="filter-group">
              <input
                type="text"
                placeholder="Author"
                value={filters.author}
                onChange={(e) => setFilters({...filters, author: e.target.value})}
                className="form-control"
              />
            </div>
            <div className="filter-group">
              <input
                type="text"
                placeholder="Category"
                value={filters.category}
                onChange={(e) => setFilters({...filters, category: e.target.value})}
                className="form-control"
              />
            </div>
            <div className="filter-group">
              <input
                type="number"
                placeholder="Min Rating"
                min="0"
                max="5"
                step="0.1"
                value={filters.rating}
                onChange={(e) => setFilters({...filters, rating: e.target.value})}
                className="form-control"
              />
            </div>
            <button type="submit" className="btn">Filter</button>
            <button type="button" className="btn" onClick={resetFilters}>Reset</button>
          </div>
        </form>

        <div className="sort-control">
          <label htmlFor="sort">Sort by:</label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="form-control"
          >
            <option value="price">Price</option>
            <option value="title">Title</option>
            <option value="author">Author</option>
            <option value="rating">Rating</option>
            <option value="publishedDate">Published Date</option>
          </select>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="loading">Loading books...</div>
      ) : books.length === 0 ? (
        <div className="no-books">
          <p>No books found</p>
          <button onClick={resetFilters} className="btn">Clear filters</button>
        </div>
      ) : (
        <>
          <div className="book-grid">
            {books.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
          <Pagination
            currentPage={page + 1}
            totalPages={totalPages}
            onPageChange={(newPage) => setPage(newPage - 1)}
          />
        </>
      )}
    </div>
  );
};

export default BookList;