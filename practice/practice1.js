// Practice 3: Express Routing
// Task: Create routes for a simple user management system (in-memory).
// Concepts: express.Router(), route params, query params, modular routes

const express = require("express");
const app = express();

app.use(express.json());

// ============================================
// In-memory users data
// ============================================

let users = [
  { id: 1, name: "Praveen", role: "admin", active: true },
  { id: 2, name: "John", role: "user", active: true },
  { id: 3, name: "Jane", role: "user", active: false },
  { id: 4, name: "Alice", role: "moderator", active: true },
];

let nextId = 5;

// ============================================
// User Router
// ============================================

const userRouter = express.Router();

// GET /users — List all users (with optional filters)
// Try: /users?role=admin  or  /users?active=true
userRouter.get("/", (req, res) => {
  let result = [...users];

  // Filter by role
  if (req.query.role) {
    result = result.filter((u) => u.role === req.query.role);
  }

  // Filter by active status
  if (req.query.active !== undefined) {
    const isActive = req.query.active === "true";
    result = result.filter((u) => u.active === isActive);
  }

  res.json({ count: result.length, users: result });
});

// GET /users/:id — Get single user
userRouter.get("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find((u) => u.id === id);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json({ user });
});

// POST /users — Create user
userRouter.post("/", (req, res) => {
  const { name, role } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }

  const newUser = {
    id: nextId++,
    name,
    role: role || "user",
    active: true,
  };

  users.push(newUser);
  res.status(201).json({ message: "User created", user: newUser });
});

// PUT /users/:id — Update user
userRouter.put("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex((u) => u.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "User not found" });
  }

  const { name, role, active } = req.body;
  users[index] = { ...users[index], ...{ name, role, active }, id };
  res.json({ message: "User updated", user: users[index] });
});

// DELETE /users/:id — Delete user
userRouter.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex((u) => u.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "User not found" });
  }

  const deleted = users.splice(index, 1)[0];
  res.json({ message: "User deleted", user: deleted });
});

// PATCH /users/:id/toggle — Toggle active status
userRouter.patch("/:id/toggle", (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find((u) => u.id === id);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  user.active = !user.active;
  res.json({ message: `User ${user.active ? "activated" : "deactivated"}`, user });
});

// Mount router
app.use("/users", userRouter);

// ============================================
// Home route
// ============================================

app.get("/", (req, res) => {
  res.json({
    message: "User Management API",
    endpoints: {
      "GET /users": "List all users (query: ?role=admin&active=true)",
      "GET /users/:id": "Get user by ID",
      "POST /users": "Create user (body: { name, role })",
      "PUT /users/:id": "Update user",
      "DELETE /users/:id": "Delete user",
      "PATCH /users/:id/toggle": "Toggle active status",
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(3000, () => {
  console.log("User Management API running at http://localhost:3000");
});
