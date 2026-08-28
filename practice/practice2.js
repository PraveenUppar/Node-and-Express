// Practice 4: Middleware Chain
// Task: Build a request logger + auth checker + rate limiter middleware.
// Concepts: custom middleware, next(), middleware order, request timing

const express = require("express");
const app = express();

app.use(express.json());

// ============================================
// Middleware 1: Request Logger
// ============================================
// Logs every incoming request with method, URL, and timestamp

function requestLogger(req, res, next) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);

  // Track response time
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `[${timestamp}] ${req.method} ${req.url} — ${res.statusCode} — ${duration}ms`
    );
  });

  next();
}

app.use(requestLogger);

// ============================================
// Middleware 2: Request ID Generator
// ============================================
// Adds a unique request ID to every request

function requestIdGenerator(req, res, next) {
  req.requestId = `req-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
  res.set("X-Request-ID", req.requestId);
  console.log(`  Request ID: ${req.requestId}`);
  next();
}

app.use(requestIdGenerator);

// ============================================
// Middleware 3: Simple Rate Limiter
// ============================================
// Limits requests per IP to prevent abuse

const requestCounts = {}; // { ip: { count, resetTime } }
const RATE_LIMIT = 10; // Max requests per window
const WINDOW_MS = 60 * 1000; // 1 minute window

function rateLimiter(req, res, next) {
  const ip = req.ip;
  const now = Date.now();

  if (!requestCounts[ip] || now > requestCounts[ip].resetTime) {
    requestCounts[ip] = { count: 1, resetTime: now + WINDOW_MS };
  } else {
    requestCounts[ip].count++;
  }

  const remaining = RATE_LIMIT - requestCounts[ip].count;

  // Set rate limit headers
  res.set("X-RateLimit-Limit", RATE_LIMIT);
  res.set("X-RateLimit-Remaining", Math.max(0, remaining));

  if (requestCounts[ip].count > RATE_LIMIT) {
    return res.status(429).json({
      error: "Too many requests. Please try again later.",
      retryAfter: Math.ceil((requestCounts[ip].resetTime - now) / 1000),
    });
  }

  next();
}

app.use(rateLimiter);

// ============================================
// Middleware 4: Auth Checker (route-level)
// ============================================
// Only applied to specific routes that need authentication

function authChecker(req, res, next) {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ error: "No authorization token provided" });
  }

  // Simple token check (in real apps, use JWT)
  if (token === "Bearer my-secret-token") {
    req.user = { id: 1, name: "Praveen", role: "admin" };
    next();
  } else {
    res.status(403).json({ error: "Invalid token" });
  }
}

// ============================================
// Routes
// ============================================

// Public route — no auth needed
app.get("/", (req, res) => {
  res.json({
    message: "Welcome! This is a public route.",
    requestId: req.requestId,
  });
});

// Public route
app.get("/health", (req, res) => {
  res.json({ status: "OK", uptime: process.uptime() });
});

// Protected route — auth required
app.get("/profile", authChecker, (req, res) => {
  res.json({
    message: "This is your profile",
    user: req.user,
    requestId: req.requestId,
  });
});

// Protected route — auth required
app.get("/dashboard", authChecker, (req, res) => {
  res.json({
    message: "Admin Dashboard",
    user: req.user,
    stats: { totalUsers: 150, activeToday: 42 },
  });
});

// ============================================
// Error-handling Middleware (always last)
// ============================================

app.use((err, req, res, next) => {
  console.error(`[ERROR] ${req.requestId}:`, err.message);
  res.status(500).json({
    error: "Internal server error",
    requestId: req.requestId,
  });
});

// ============================================
// Test Instructions
// ============================================

// 1. Run: node practice4.js
// 2. Visit: http://localhost:3000/ (public)
// 3. Visit: http://localhost:3000/health (public)
// 4. Visit: http://localhost:3000/profile (will get 401 — no token)
// 5. Use curl with auth header:
//    curl http://localhost:3000/profile -H "Authorization: Bearer my-secret-token"
// 6. Spam requests to test rate limiter (10 per minute limit)

app.listen(3000, () => {
  console.log("Middleware Practice running at http://localhost:3000");
});
