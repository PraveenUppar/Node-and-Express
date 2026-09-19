// CRUD Operations with Express
// CRUD = Create, Read, Update, Delete — the four basic operations for any data.
// This file builds a full CRUD API using an in-memory array (no database needed).

const express = require("express");
const app = express();

app.use(express.json());

// ============================================
// In-memory data store (acts like a simple database)
// ============================================

let users = [
  { id: 1, name: "Praveen", email: "praveen@example.com", age: 22 },
  { id: 2, name: "John", email: "john@example.com", age: 25 },
  { id: 3, name: "Jane", email: "jane@example.com", age: 28 },
];

let nextId = 4; // Auto-increment ID

// ============================================
// CREATE — POST /users
// ============================================
// Status: 201 Created

app.post("/users", (req, res) => {
  const { name, email, age } = req.body;

  // Validation
  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }

  const newUser = {
    id: nextId++,
    name,
    email,
    age: age || null,
  };

  users.push(newUser);
  res.status(201).json({ message: "User created", user: newUser });
});

// ============================================
// READ ALL — GET /users
// ============================================
// Status: 200 OK

app.get("/users", (req, res) => {
  res.json({ count: users.length, users });
});

// ============================================
// READ ONE — GET /users/:id
// ============================================
// Status: 200 OK or 404 Not Found

app.get("/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find((u) => u.id === id);

  if (!user) {
    return res.status(404).json({ error: `User with ID ${id} not found` });
  }

  res.json({ user });
});

// ============================================
// UPDATE (Full) — PUT /users/:id
// ============================================
// PUT replaces the entire resource
// Status: 200 OK or 404 Not Found

app.put("/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex((u) => u.id === id);

  if (index === -1) {
    return res.status(404).json({ error: `User with ID ${id} not found` });
  }

  const { name, email, age } = req.body;

  // Validation
  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }

  // Replace the entire user object (keeping the same ID)
  users[index] = { id, name, email, age: age || null };
  res.json({ message: "User updated", user: users[index] });
});

// ============================================
// UPDATE (Partial) — PATCH /users/:id
// ============================================
// PATCH updates only the fields provided
// Status: 200 OK or 404 Not Found

app.patch("/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex((u) => u.id === id);

  if (index === -1) {
    return res.status(404).json({ error: `User with ID ${id} not found` });
  }

  // Merge existing data with new data (spread operator!)
  users[index] = { ...users[index], ...req.body, id }; // Keep original ID
  res.json({ message: "User patched", user: users[index] });
});

// ============================================
// DELETE — DELETE /users/:id
// ============================================
// Status: 200 OK or 404 Not Found

app.delete("/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex((u) => u.id === id);

  if (index === -1) {
    return res.status(404).json({ error: `User with ID ${id} not found` });
  }

  const deletedUser = users.splice(index, 1)[0]; // Remove and get deleted user
  res.json({ message: "User deleted", user: deletedUser });
});
