import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <div className="hero">
        <div className="hero-content">
          <h1>Welcome to BookStore</h1>
          <p>Your one-stop shop for all your reading needs</p>
          <Link to="/books" className="hero-btn">Browse Books</Link>
        </div>
      </div>
      
      <div className="features">
        <div className="feature">
          <div className="feature-icon">🔍</div>
          <h3>Find Books</h3>
          <p>Search our extensive collection by title, author, or category</p>
        </div>
        <div className="feature">
          <div className="feature-icon">⭐</div>
          <h3>Rate Books</h3>
          <p>Share your opinions with our community of readers</p>
        </div>
        <div className="feature">
          <div className="feature-icon">📚</div>
          <h3>Stay Updated</h3>
          <p>Get notifications about new releases and special offers</p>
        </div>
      </div>
    </div>
  );
};

export default Home;