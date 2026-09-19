// Express.js Basics
// Express is a minimal and flexible Node.js web framework.
// It makes building web servers and APIs much easier than using the raw http module.

// Install Express: npm install express

// import express from "express";
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

// What you already know how to do manually:
// res.writeHead(200, { "Content-Type": "text/plain" });
// res.end("This is plain text");

// What Express's res.send() does internally — literally this, wrapped in one call:
// res.send("This is plain text");

// What you'd have to do manually with raw Node for JSON:
// res.writeHead(200, { "Content-Type": "application/json" });
// res.end(JSON.stringify({ message: "Hello", status: "success" }));

// What res.json() does internally — same thing, one call:
// res.json({ message: "Hello", status: "success" });

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

// ============================================
// Parsing Request Body
// ============================================

// Express needs middleware to parse incoming request bodies

// The body arrives as raw bytes, not as a ready-made JavaScript object.
// Node itself has no idea what those bytes mean — they could be JSON, plain text, an image, form data, anything.
// The middleware is responsible for converting those bytes into a JavaScript object that you can work with.

// Parse JSON bodies (for API requests)
app.use(express.json());

// Parse URL-encoded bodies (for form submissions)
app.use(express.urlencoded({ extended: true }));

// Now you can access req.body - if not the body is undefined
app.post("/submit", (req, res) => {
  console.log("Body:", req.body);
  res.json({ received: req.body });
});
