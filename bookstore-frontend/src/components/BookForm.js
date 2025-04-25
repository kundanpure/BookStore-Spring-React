// src/components/BookForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const BookForm = () => {
  const [book, setBook] = useState({
    title: '',
    author: '',
    category: '',
    price: '',
    rating: '',
    publishedDate: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  const fetchBook = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found. Please log in.');
        return;
      }
      const response = await axios.get(`http://localhost:8080/api/books/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBook(response.data);
    } catch (err) {
      console.error('Error fetching book:', err.response?.data || err.message);
      setError(`Failed to fetch book: ${err.response?.data || err.message}`);
    }
  };

  useEffect(() => {
    if (id) {
      fetchBook();
    }
  }, [id, fetchBook]); // Added fetchBook as a dependency to fix ESLint warning

  const handleChange = (e) => {
    setBook({ ...book, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found. Please log in.');
        return;
      }
      if (id) {
        await axios.put(`http://localhost:8080/api/books/${id}`, book, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post('http://localhost:8080/api/books', book, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      navigate('/books');
    } catch (err) {
      console.error('Error saving book:', err.response?.data || err.message);
      setError(`Failed to save book: ${err.response?.data || err.message}`);
    }
  };

  return (
    <div className="container mt-5">
      <h2>{id ? 'Edit Book' : 'Add Book'}</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            type="text"
            name="title"
            className="form-control"
            value={book.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Author</label>
          <input
            type="text"
            name="author"
            className="form-control"
            value={book.author}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Category</label>
          <input
            type="text"
            name="category"
            className="form-control"
            value={book.category}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Price</label>
          <input
            type="number"
            name="price"
            className="form-control"
            value={book.price}
            onChange={handleChange}
            required
            step="0.01"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Rating</label>
          <input
            type="number"
            name="rating"
            className="form-control"
            value={book.rating}
            onChange={handleChange}
            required
            min="0"
            max="5"
            step="0.1"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Published Date</label>
          <input
            type="date"
            name="publishedDate"
            className="form-control"
            value={book.publishedDate}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Save</button>
        <button
          type="button"
          className="btn btn-secondary ms-2"
          onClick={() => navigate('/books')}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default BookForm;