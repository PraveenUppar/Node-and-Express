// Middleware in Express
// Middleware = functions that run BETWEEN the request and the response.
// They have access to req, res, and next().
// Think of it as a pipeline: Request → Middleware1 → Middleware2 → Route Handler → Response

const express = require("express");
const app = express();

// ============================================
// How Middleware Works
// ============================================

// Every middleware function receives: (req, res, next)
// - req: the request object
// - res: the response object
// - next: a function that passes control to the NEXT middleware

// If you don't call next(), the request STOPS here (hangs forever)

// ============================================
// Built-in Middleware
// ============================================

// express.json() — parses JSON request bodies
app.use(express.json());

// express.urlencoded() — parses form data
app.use(express.urlencoded({ extended: true }));

// express.static() — serves static files
app.use(express.static("public"));

// ============================================
// Custom Middleware — Auth Check
// ============================================

function authMiddleware(req, res, next) {
  const apiKey = req.headers["x-api-key"];

  if (apiKey === "my-secret-key") {
    next(); // Authorized — proceed to route handler
  } else {
    res.status(401).json({ error: "Unauthorized: Invalid API key" });
    // No next() — request stops here
  }
}

// Apply to specific routes only
app.get("/public", (req, res) => {
  res.json({ message: "This is public — no auth needed" });
});

app.get("/protected", authMiddleware, (req, res) => {
  res.json({ message: "This is protected — you are authorized!" });
});

// ============================================
// Route-level Middleware (apply to specific routes)
// ============================================

function validateUser(req, res, next) {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }
  next();
}

// validateUser runs ONLY for this POST route
app.post("/users", validateUser, (req, res) => {
  res.status(201).json({ message: "User created", user: req.body });
});

// ============================================
// Multiple Middleware on a Single Route
// ============================================

function checkAge(req, res, next) {
  if (req.body.age && req.body.age >= 18) {
    next();
  } else {
    res.status(400).json({ error: "Must be 18 or older" });
  }
}

// Both validateUser AND checkAge run before the route handler
app.post("/register", validateUser, checkAge, (req, res) => {
  res.json({ message: "Registration successful", user: req.body });
});
