// Express.js Basics
// Express is a minimal and flexible Node.js web framework.
// It makes building web servers and APIs much easier than using the raw http module.

// Install Express: npm install express

const express = require("express");
const app = express();
const PORT = 3000;

// ============================================
// Basic Server
// ============================================

// app.listen() starts the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// ============================================
// HTTP Methods — app.get(), app.post(), app.put(), app.delete()
// ============================================

// GET — retrieve data
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// POST — create data
app.post("/users", (req, res) => {
  res.send("User created!");
});

// PUT — update data
app.put("/users/:id", (req, res) => {
  res.send(`User ${req.params.id} updated!`);
});

// DELETE — delete data
app.delete("/users/:id", (req, res) => {
  res.send(`User ${req.params.id} deleted!`);
});

// ============================================
// Response Methods
// ============================================

// res.send() — send a string response
app.get("/text", (req, res) => {
  res.send("This is plain text");
});

// res.json() — send a JSON response (automatically sets Content-Type)
app.get("/json", (req, res) => {
  res.json({ message: "Hello", status: "success" });
});

// res.status() — set the HTTP status code
app.get("/not-found", (req, res) => {
  res.status(404).json({ error: "Resource not found" });
});

// res.status().send() — chaining status with response
app.get("/error", (req, res) => {
  res.status(500).send("Internal Server Error");
});

// res.sendFile() — send a file
// const path = require('path');
// app.get('/page', (req, res) => {
//   res.sendFile(path.join(__dirname, 'index.html'));
// });

// res.redirect() — redirect to another URL
app.get("/old-page", (req, res) => {
  res.redirect("/");
});

// ============================================
// Parsing Request Body
// ============================================

// Express needs middleware to parse incoming request bodies

// Parse JSON bodies (for API requests)
app.use(express.json());

// Parse URL-encoded bodies (for form submissions)
app.use(express.urlencoded({ extended: true }));

// Now you can access req.body
app.post("/submit", (req, res) => {
  console.log("Body:", req.body);
  res.json({ received: req.body });
});

// ============================================
// Serving Static Files
// ============================================

// express.static() serves files from a directory (CSS, images, JS, HTML)
// app.use(express.static('public'));
// Now files in /public are accessible:
// public/style.css → http://localhost:3000/style.css
// public/image.png → http://localhost:3000/image.png

// ============================================
// app.all() — handle ALL HTTP methods for a route
// ============================================

app.all("/any-method", (req, res) => {
  res.send(`You used the ${req.method} method`);
});

// ============================================
// app.use() — run for EVERY request (middleware)
// ============================================

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
  next(); // Pass to the next middleware/route
});
