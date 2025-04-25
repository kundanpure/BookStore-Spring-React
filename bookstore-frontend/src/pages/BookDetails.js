import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { bookService } from '../Services/api';
import './BookDetails.css';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const data = await bookService.getBookById(id);
        setBook(data);
      } catch (err) {
        setError('Failed to fetch book details');
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    try {
      await bookService.deleteBook(id);
      navigate('/books', { state: { message: 'Book deleted successfully' } });
    } catch (err) {
      setError('Failed to delete book');
    }
  };

  if (loading) {
    return <div className="loading">Loading book details...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!book) {
    return <div className="alert alert-danger">Book not found</div>;
  }

  const formattedDate = book.publishedDate
    ? new Date(book.publishedDate).toLocaleDateString()
    : 'Unknown';

  return (
    <div className="book-details">
      <div className="book-details-header">
        <Link to="/books" className="back-link">← Back to Books</Link>
      </div>

      <div className="book-details-content">
        <div className="book-details-image">
          <div className="book-image-placeholder">
            📚
          </div>
        </div>

        <div className="book-details-info">
          <h1>{book.title || 'Untitled Book'}</h1>
          <div className="book-author">by {book.author || 'Unknown Author'}</div>

          <div className="book-meta">
            <div className="book-category">
              Category: <span>{book.category || 'N/A'}</span>
            </div>
            <div className="book-price">
              Price: <span>${book.price ? book.price.toFixed(2) : 'N/A'}</span>
            </div>
            <div className="book-rating">
              Rating: <span>{book.rating ? `⭐ ${book.rating} / 5.0` : 'No rating'}</span>
            </div>
            <div className="book-published">
              Published: <span>{formattedDate}</span>
            </div>
          </div>

          <div className="book-actions">
            <Link to={`/books/edit/${book.id}`} className="btn">
              Edit Book
            </Link>
            <button
              onClick={handleDelete}
              className={`btn btn-danger ${confirmDelete ? 'confirm' : ''}`}
            >
              {confirmDelete ? 'Confirm Delete' : 'Delete Book'}
            </button>
            {confirmDelete && (
              <button className="btn btn-secondary" onClick={() => setConfirmDelete(false)}>
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
