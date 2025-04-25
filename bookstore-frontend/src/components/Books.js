// src/components/Books.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found. Please log in.");
        const response = await axios.get("http://localhost:8080/api/books", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBooks(response.data);
      } catch (err) {
        console.error("Fetch books error:", err.response?.data || err.message);
        setError("Failed to fetch books");
      }
    };
    fetchBooks();
  }, []);

  return (
    <div className="container mt-5">
      <h2>Books</h2>
      <Link to="/add-book" className="btn btn-primary mb-3">
        Add Book
      </Link>
      {error && <div className="alert alert-danger">{error}</div>}
      {books.length === 0 && !error ? (
        <p>No books available</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Category</th>
              <th>Price</th>
              <th>Rating</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.category}</td>
                <td>{book.price}</td>
                <td>{book.rating}</td>
                <td>
                  {/* Add edit/delete buttons if needed */}
                  <button className="btn btn-sm btn-info">Edit</button>
                  <button className="btn btn-sm btn-danger ms-2">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Books;