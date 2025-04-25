import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { bookService } from '../Services/api';
import './BookForm.css';

const AddBook = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [book, setBook] = useState({
    title: '',
    author: '',
    category: '',
    price: '',
    rating: '',
    publishedDate: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook({ ...book, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Simple validation
    if (!book.title || !book.author) {
      setError('Title and author are required');
      return;
    }
    
    // Convert string values to numbers
    const bookData = {
      ...book,
      price: book.price ? parseFloat(book.price) : 0,
      rating: book.rating ? parseFloat(book.rating) : 0
    };
    
    setLoading(true);
    
    try {
      await bookService.createBook(bookData);
      navigate('/books', { state: { message: 'Book added successfully' } });
    } catch (err) {
      setError('Failed to add book');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="book-form-page">
      <div className="book-form-header">
        <h1>Add New Book</h1>
        <Link to="/books" className="btn">Cancel</Link>
      </div>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="card book-form-card">
        <form onSubmit={handleSubmit} className="book-form">
          <div className="form-group">
            <label htmlFor="title">Title*</label>
            <input
              type="text"
              id="title"
              name="title"
              className="form-control"
              value={book.title}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="author">Author*</label>
            <input
              type="text"
              id="author"
              name="author"
              className="form-control"
              value={book.author}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <input
              type="text"
              id="category"
              name="category"
              className="form-control"
              value={book.category}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Price ($)</label>
              <input
                type="number"
                id="price"
                name="price"
                className="form-control"
                min="0"
                step="0.01"
                value={book.price}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="rating">Rating (0-5)</label>
              <input
                type="number"
                id="rating"
                name="rating"
                className="form-control"
                min="0"
                max="5"
                step="0.1"
                value={book.rating}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="publishedDate">Published Date</label>
            <input
              type="date"
              id="publishedDate"
              name="publishedDate"
              className="form-control"
              value={book.publishedDate}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-actions">
            <button
              type="submit"
              className="btn"
              disabled={loading}
            >
              {loading ? 'Adding Book...' : 'Add Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBook;