// src/components/AddBook.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddBook = () => {
  const [book, setBook] = useState({
    title: "",
    author: "",
    category: "",
    price: "",
    rating: "",
    publishedDate: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook((prev) => ({ ...prev, [name]: value }));
  };

  const convertDate = (dateStr) => {
    const [day, month, year] = dateStr.split("-");
    return `${year}-${month}-${day}`; // "09-04-2025" -> "2025-04-09"
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found. Please log in.");
      const formattedBook = {
        ...book,
        price: parseFloat(book.price),
        rating: parseFloat(book.rating),
        publishedDate: convertDate(book.publishedDate),
      };
      await axios.post("http://localhost:8080/api/books", formattedBook, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      navigate("/books");
    } catch (err) {
      console.error("Add book error:", err.response?.data || err.message);
      setError("Failed to save book");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Add Book</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Title</label>
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
          <label>Author</label>
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
          <label>Category</label>
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
          <label>Price</label>
          <input
            type="number"
            name="price"
            className="form-control"
            value={book.price}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Rating</label>
          <input
            type="number"
            name="rating"
            className="form-control"
            value={book.rating}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Published Date (DD-MM-YYYY)</label>
          <input
            type="text"
            name="publishedDate"
            className="form-control"
            value={book.publishedDate}
            onChange={handleChange}
            placeholder="e.g., 09-04-2025"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Save Book
        </button>
      </form>
    </div>
  );
};

export default AddBook;