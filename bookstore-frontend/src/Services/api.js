import axios from 'axios';

const API_URL = 'http://localhost:8080/api'; // Make sure backend is running here

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Uncomment if you're using cookies (e.g., session-based auth)
  // withCredentials: true,
});

// Request Interceptor – Adds token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor – Logs or handles errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Optionally, handle 401 errors globally
    if (error.response && error.response.status === 401) {
      console.warn('Unauthorized! Redirecting to login...');
      // Example: redirect to login or clear localStorage
      // localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

// Auth Services
export const authService = {
  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const token = res.data.token;
    if (token) {
      localStorage.setItem('token', token); // store token for future use
    }
    return res.data;
  },

  signup: async (email, password) => {
    const res = await api.post('/auth/signup', { email, password });
    return res.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },
};

// Book Services
export const bookService = {
  getAllBooks: async () => {
    const res = await api.get('/books');
    return res.data;
  },

  getBookById: async (id) => {
    const res = await api.get(`/books/${id}`);
    return res.data;
  },

  createBook: async (bookData) => {
    const res = await api.post('/books', bookData);
    return res.data;
  },

  updateBook: async (id, bookData) => {
    const res = await api.put(`/books/${id}`, bookData);
    return res.data;
  },

  deleteBook: async (id) => {
    const res = await api.delete(`/books/${id}`);
    return res.data;
  },

  searchBooks: async (keyword) => {
    const res = await api.get(`/books/search`, {
      params: { keyword },
    });
    return res.data;
  },

  filterBooks: async (author, category, rating) => {
    const params = {};
    if (author) params.author = author;
    if (category) params.category = category;
    if (rating) params.rating = rating;

    const res = await api.get('/books/filter', { params });
    return res.data;
  },

  getPaginatedBooks: async (page = 0, size = 5, sortBy = 'price') => {
    const res = await api.get('/books/paginated', {
      params: { page, size, sortBy },
    });
    return res.data;
  },
};
