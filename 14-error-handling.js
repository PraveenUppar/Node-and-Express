// Error Handling in Express
// Proper error handling prevents your server from crashing and gives clients useful error messages.

const express = require("express");
const app = express();

app.use(express.json());

// ============================================
// Basic Try-Catch in Route Handlers
// ============================================

const users = [
  { id: 1, name: "Praveen" },
  { id: 2, name: "John" },
];

app.get("/users/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "ID must be a number" });
    }

    const user = users.find((u) => u.id === id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ============================================
// Passing Errors to Error Middleware with next()
// ============================================

// Instead of handling errors in every route, pass them to a centralized handler
app.get("/fail", (req, res, next) => {
  try {
    // Simulate something going wrong
    throw new Error("Something broke!");
  } catch (error) {
    next(error); // Pass error to the error-handling middleware
  }
});

// ============================================
// Custom Error Class
// ============================================

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Distinguishes expected errors from bugs
  }
}

// Usage in routes
app.get("/products/:id", (req, res, next) => {
  const id = parseInt(req.params.id);
  const product = null; // Simulating not found

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  res.json({ product });
});

app.post("/products", (req, res, next) => {
  const { name, price } = req.body;

  if (!name) {
    return next(new AppError("Product name is required", 400));
  }

  if (!price || price < 0) {
    return next(new AppError("Valid price is required", 400));
  }

  res.status(201).json({ message: "Product created" });
});

// ============================================
// Async Error Handling
// ============================================

// Problem: try-catch in every async route is repetitive
// Solution: a wrapper function

// Wrapper function — catches errors automatically and passes to next()
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// Usage: no try-catch needed!
app.get(
  "/async-example",
  asyncHandler(async (req, res) => {
    // If this throws, asyncHandler catches it and calls next(error)
    const data = await someAsyncOperation();
    res.json({ data });
  })
);

async function someAsyncOperation() {
  // Simulating async work
  return { message: "Async data" };
}

// ============================================
// 404 Handler (Route Not Found)
// ============================================

// This must be AFTER all routes, BEFORE error middleware
app.use((req, res, next) => {
  next(new AppError(`Cannot find ${req.method} ${req.url}`, 404));
});

// ============================================
// Global Error-handling Middleware
// ============================================

// MUST have exactly 4 parameters (err, req, res, next)
// MUST be defined AFTER all routes

app.use((err, req, res, next) => {
  // Log the error
  console.error("ERROR:", err.message);

  // Set status code (default to 500 if not set)
  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : "Internal server error";

  // Send error response
  res.status(statusCode).json({
    success: false,
    error: message,
    // Include stack trace only in development
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// ============================================
// Common Error Patterns Summary
// ============================================

// 400 — Bad Request (invalid input, missing fields)
// 401 — Unauthorized (not logged in)
// 403 — Forbidden (logged in but no permission)
// 404 — Not Found (resource doesn't exist)
// 409 — Conflict (duplicate data)
// 422 — Unprocessable Entity (validation error)
// 500 — Internal Server Error (unexpected bug)

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
