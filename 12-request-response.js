// Request and Response Objects in Express
// Understanding what's inside req and res — the two most important objects.

const express = require("express");
const path = require("path");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// REQUEST OBJECT (req) — what the client sends
// ============================================

app.all("/inspect", (req, res) => {
  res.json({
    // HTTP method used
    method: req.method, // "GET", "POST", "PUT", "DELETE"

    // The URL path
    url: req.url, // "/inspect?page=1"
    path: req.path, // "/inspect"

    // Route parameters (from :param in URL)
    params: req.params, // { id: "5" } for /users/:id

    // Query parameters (from ?key=value)
    query: req.query, // { page: "1", limit: "10" }

    // Request headers
    headers: req.headers, // { host, content-type, user-agent, ... }

    // Request body (needs express.json() middleware)
    body: req.body, // { name: "John" } for POST with JSON body

    // Client IP address
    ip: req.ip, // "127.0.0.1"

    // Protocol
    protocol: req.protocol, // "http" or "https"

    // Hostname
    hostname: req.hostname, // "localhost"
  });
});

// ============================================
// req.params — Route Parameters
// ============================================

app.get("/users/:id", (req, res) => {
  console.log(req.params); // { id: "5" }
  console.log(req.params.id); // "5" (always a string!)
  res.json({ userId: req.params.id });
});

app.get("/users/:userId/posts/:postId", (req, res) => {
  console.log(req.params); // { userId: "3", postId: "7" }
  res.json(req.params);
});

// ============================================
// req.query — Query Parameters
// ============================================

app.get("/search", (req, res) => {
  // URL: /search?q=nodejs&page=2&limit=5
  console.log(req.query); // { q: "nodejs", page: "2", limit: "5" }
  console.log(req.query.q); // "nodejs"

  // Query params are always STRINGS — convert if needed
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  res.json({ searchTerm: req.query.q, page, limit });
});

// ============================================
// req.body — Request Body (for POST, PUT)
// ============================================

app.post("/users", (req, res) => {
  // Requires express.json() middleware to parse JSON bodies
  console.log(req.body); // { name: "John", age: 30 }
  res.status(201).json({ message: "User created", user: req.body });
});

// ============================================
// req.headers — Request Headers
// ============================================

app.get("/headers", (req, res) => {
  console.log(req.headers); // All headers
  console.log(req.headers["content-type"]); // Specific header (lowercase!)
  console.log(req.headers["authorization"]); // Auth header
  res.json({ headers: req.headers });
});

// ============================================
// RESPONSE OBJECT (res) — what we send back
// ============================================

// res.send() — send text, HTML, or Buffer
app.get("/send", (req, res) => {
  res.send("Hello World!"); // text/plain
  // res.send('<h1>Hello</h1>');  // text/html (auto-detected)
});

// res.json() — send JSON (auto-sets Content-Type to application/json)
app.get("/json-response", (req, res) => {
  res.json({
    success: true,
    data: { name: "Praveen", age: 22 },
  });
});

// res.status() — set HTTP status code (chain with other methods)
app.get("/status-example", (req, res) => {
  res.status(200).json({ message: "OK" });
  // res.status(201).json({ message: "Created" });
  // res.status(400).json({ error: "Bad Request" });
  // res.status(404).json({ error: "Not Found" });
  // res.status(500).json({ error: "Server Error" });
});
