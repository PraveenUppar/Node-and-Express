// Routing in Express
// Routing = defining how your app responds to different URLs and HTTP methods.

const express = require("express");
const app = express();

// ============================================
// Route Parameters (:param) — dynamic parts of the URL
// ============================================

// :id is a route parameter — it captures whatever value is in the URL
app.get("/users/:id", (req, res) => {
  const userId = req.params.id;
  res.json({ message: `User ID is: ${userId}` });
});
// GET /users/5     → { message: "User ID is: 5" }
// GET /users/abc   → { message: "User ID is: abc" }

// Multiple route parameters
app.get("/users/:userId/posts/:postId", (req, res) => {
  const { userId, postId } = req.params;
  res.json({ userId, postId });
});
// GET /users/3/posts/7 → { userId: "3", postId: "7" }

// ============================================
// Query Parameters (?key=value) — optional filters/search
// ============================================

// Query params come after ? in the URL
app.get("/search", (req, res) => {
  const { q, page, limit } = req.query;
  res.json({ searchTerm: q, page, limit });
});
// GET /search?q=nodejs&page=1&limit=10
// → { searchTerm: "nodejs", page: "1", limit: "10" }

// Note: query params are always strings!

// ============================================
// Route Parameters vs Query Parameters
// ============================================

// Route params (:id)   → for identifying a specific resource → /users/5
// Query params (?...)  → for filtering, sorting, pagination → /users?role=admin&sort=name

// ============================================
// express.Router() — modular routes
// ============================================

// Instead of putting all routes in one file, you can split them into modules

// --- routes/users.js ---
const userRouter = express.Router();

userRouter.get("/", (req, res) => {
  res.json({ message: "Get all users" });
});

userRouter.get("/:id", (req, res) => {
  res.json({ message: `Get user ${req.params.id}` });
});

userRouter.post("/", (req, res) => {
  res.json({ message: "Create user" });
});

userRouter.put("/:id", (req, res) => {
  res.json({ message: `Update user ${req.params.id}` });
});

userRouter.delete("/:id", (req, res) => {
  res.json({ message: `Delete user ${req.params.id}` });
});

// Mount the router on /users
app.use("/users", userRouter);
// Now:
// GET  /users       → "Get all users"
// GET  /users/5     → "Get user 5"
// POST /users       → "Create user"
// PUT  /users/5     → "Update user 5"
// DELETE /users/5   → "Delete user 5"

// --- routes/products.js ---
const productRouter = express.Router();

productRouter.get("/", (req, res) => {
  res.json({ message: "Get all products" });
});

productRouter.get("/:id", (req, res) => {
  res.json({ message: `Get product ${req.params.id}` });
});

app.use("/products", productRouter);

// ============================================
// Route Chaining — app.route()
// ============================================

// Instead of writing app.get, app.post, app.put separately:
app
  .route("/books")
  .get((req, res) => {
    res.json({ message: "Get all books" });
  })
  .post((req, res) => {
    res.json({ message: "Add a book" });
  });

app
  .route("/books/:id")
  .get((req, res) => {
    res.json({ message: `Get book ${req.params.id}` });
  })
  .put((req, res) => {
    res.json({ message: `Update book ${req.params.id}` });
  })
  .delete((req, res) => {
    res.json({ message: `Delete book ${req.params.id}` });
  });

// ============================================
// 404 Handler (catch-all route)
// ============================================

// This must be AFTER all other routes
// If no route matches, this runs
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
