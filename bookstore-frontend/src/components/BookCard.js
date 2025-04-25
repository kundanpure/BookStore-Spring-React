import React from 'react';
import { Link } from 'react-router-dom';
import './BookCard.css';

const BookCard = ({ book }) => {
  return (
    <div className="book-card">
      <div className="book-card-img">
        <div className="book-card-placeholder">
          📚
        </div>
      </div>
      <div className="book-card-content">
        <h3 className="book-card-title">{book.title}</h3>
        <div className="book-card-author">by {book.author}</div>
        <div className="book-card-category">{book.category}</div>
        <div className="book-card-details">
          <div className="book-card-price">${book.price.toFixed(2)}</div>
          <div className="book-card-rating">
            ⭐ {book.rating} / 5.0
          </div>
        </div>
        <Link to={`/books/${book.id}`} className="book-card-link">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default BookCard;