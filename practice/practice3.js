// Practice 5: Complete CRUD API
// Task: Full Express REST API with validation, error handling, and search.
// Concepts: Everything combined — CRUD, middleware, validation, error handling, filtering

const express = require("express");
const app = express();

app.use(express.json());

// ============================================
// Logger Middleware
// ============================================

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ============================================
// Custom Error Class
// ============================================

class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

// ============================================
// Data Store
// ============================================

let books = [
  { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", year: 1925, genre: "Fiction", rating: 4.5 },
  { id: 2, title: "To Kill a Mockingbird", author: "Harper Lee", year: 1960, genre: "Fiction", rating: 4.8 },
  { id: 3, title: "1984", author: "George Orwell", year: 1949, genre: "Dystopian", rating: 4.7 },
  { id: 4, title: "Clean Code", author: "Robert C. Martin", year: 2008, genre: "Technology", rating: 4.3 },
  { id: 5, title: "The Pragmatic Programmer", author: "David Thomas", year: 1999, genre: "Technology", rating: 4.6 },
];

let nextId = 6;

// ============================================
// Validation Middleware
// ============================================

function validateBook(req, res, next) {
  const { title, author } = req.body;
  const errors = [];

  if (!title || title.trim() === "") errors.push("Title is required");
  if (!author || author.trim() === "") errors.push("Author is required");
  if (req.body.year && (req.body.year < 0 || req.body.year > new Date().getFullYear())) {
    errors.push("Invalid year");
  }
  if (req.body.rating && (req.body.rating < 0 || req.body.rating > 5)) {
    errors.push("Rating must be between 0 and 5");
  }

  if (errors.length > 0) {
    return next(new ApiError(errors.join(", "), 400));
  }

  next();
}

// ============================================
// Routes
// ============================================

const bookRouter = express.Router();

// GET /books — List all books (with filters and sorting)
// Query: ?genre=Fiction&minRating=4.5&sort=year&order=desc
bookRouter.get("/", (req, res) => {
  let result = [...books];

  // Filter by genre
  if (req.query.genre) {
    result = result.filter(
      (b) => b.genre.toLowerCase() === req.query.genre.toLowerCase()
    );
  }

  // Filter by author
  if (req.query.author) {
    result = result.filter((b) =>
      b.author.toLowerCase().includes(req.query.author.toLowerCase())
    );
  }

  // Filter by minimum rating
  if (req.query.minRating) {
    result = result.filter((b) => b.rating >= parseFloat(req.query.minRating));
  }

  // Search by title
  if (req.query.search) {
    result = result.filter((b) =>
      b.title.toLowerCase().includes(req.query.search.toLowerCase())
    );
  }

  // Sort
  if (req.query.sort) {
    const sortField = req.query.sort;
    const order = req.query.order === "desc" ? -1 : 1;
    result.sort((a, b) => {
      if (a[sortField] < b[sortField]) return -1 * order;
      if (a[sortField] > b[sortField]) return 1 * order;
      return 0;
    });
  }

  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;
  const paginatedResult = result.slice(startIndex, startIndex + limit);

  res.json({
    total: result.length,
    page,
    limit,
    books: paginatedResult,
  });
});

// GET /books/stats — Get statistics
bookRouter.get("/stats", (req, res) => {
  const totalBooks = books.length;
  const avgRating = (books.reduce((sum, b) => sum + b.rating, 0) / totalBooks).toFixed(2);
  const genres = [...new Set(books.map((b) => b.genre))];
  const topRated = [...books].sort((a, b) => b.rating - a.rating)[0];

  res.json({ totalBooks, avgRating: parseFloat(avgRating), genres, topRated });
});

// GET /books/:id — Get single book
bookRouter.get("/:id", (req, res, next) => {
  const id = parseInt(req.params.id);
  const book = books.find((b) => b.id === id);

  if (!book) {
    return next(new ApiError(`Book with ID ${id} not found`, 404));
  }

  res.json({ book });
});

// POST /books — Create book
bookRouter.post("/", validateBook, (req, res) => {
  const { title, author, year, genre, rating } = req.body;

  const newBook = {
    id: nextId++,
    title: title.trim(),
    author: author.trim(),
    year: year || null,
    genre: genre || "Uncategorized",
    rating: rating || 0,
  };

  books.push(newBook);
  res.status(201).json({ message: "Book created", book: newBook });
});

// PUT /books/:id — Update book (full)
bookRouter.put("/:id", validateBook, (req, res, next) => {
  const id = parseInt(req.params.id);
  const index = books.findIndex((b) => b.id === id);

  if (index === -1) {
    return next(new ApiError(`Book with ID ${id} not found`, 404));
  }

  const { title, author, year, genre, rating } = req.body;
  books[index] = {
    id,
    title: title.trim(),
    author: author.trim(),
    year: year || null,
    genre: genre || "Uncategorized",
    rating: rating || 0,
  };

  res.json({ message: "Book updated", book: books[index] });
});

// PATCH /books/:id — Update book (partial)
bookRouter.patch("/:id", (req, res, next) => {
  const id = parseInt(req.params.id);
  const index = books.findIndex((b) => b.id === id);

  if (index === -1) {
    return next(new ApiError(`Book with ID ${id} not found`, 404));
  }

  books[index] = { ...books[index], ...req.body, id };
  res.json({ message: "Book patched", book: books[index] });
});

// DELETE /books/:id — Delete book
bookRouter.delete("/:id", (req, res, next) => {
  const id = parseInt(req.params.id);
  const index = books.findIndex((b) => b.id === id);

  if (index === -1) {
    return next(new ApiError(`Book with ID ${id} not found`, 404));
  }

  const deleted = books.splice(index, 1)[0];
  res.json({ message: "Book deleted", book: deleted });
});

// Mount router
app.use("/books", bookRouter);

// ============================================
// Home route
// ============================================

app.get("/", (req, res) => {
  res.json({
    message: "📚 Book API",
    endpoints: {
      "GET /books": "List all books (?genre, ?author, ?minRating, ?search, ?sort, ?order, ?page, ?limit)",
      "GET /books/stats": "Get book statistics",
      "GET /books/:id": "Get book by ID",
      "POST /books": "Create book (body: { title, author, year, genre, rating })",
      "PUT /books/:id": "Update book (full)",
      "PATCH /books/:id": "Update book (partial)",
      "DELETE /books/:id": "Delete book",
    },
  });
});

// ============================================
// 404 Handler
// ============================================

app.use((req, res, next) => {
  next(new ApiError(`Route ${req.method} ${req.url} not found`, 404));
});

// ============================================
// Error Handler
// ============================================

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: err.message || "Internal server error",
  });
});

app.listen(3000, () => {
  console.log("📚 Book API running at http://localhost:3000");
});
