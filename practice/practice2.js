// Practice 2: HTTP Server (without Express)
// Task: Build a basic HTTP server that serves different responses based on URL.
// Concepts: http module, manual routing, serving JSON, handling methods

const http = require("http");

// In-memory data
const todos = [
  { id: 1, task: "Learn Node.js", done: false },
  { id: 2, task: "Learn Express", done: false },
  { id: 3, task: "Build a project", done: false },
];

const server = http.createServer((req, res) => {
  const { url, method } = req;

  // ============================================
  // Route: GET / — Home page
  // ============================================
  if (url === "/" && method === "GET") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(`
      <h1>Welcome to the Todo Server</h1>
      <p>Available routes:</p>
      <ul>
        <li>GET /todos — List all todos</li>
        <li>GET /todos/:id — Get a specific todo</li>
        <li>POST /todos — Create a todo</li>
        <li>GET /about — About page</li>
      </ul>
    `);
  }

  // ============================================
  // Route: GET /about — About page
  // ============================================
  else if (url === "/about" && method === "GET") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("<h1>About</h1><p>A simple HTTP server built with Node.js</p>");
  }

  // ============================================
  // Route: GET /todos — List all todos (JSON)
  // ============================================
  else if (url === "/todos" && method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ count: todos.length, todos }));
  }

  // ============================================
  // Route: GET /todos/:id — Get one todo
  // ============================================
  else if (url.match(/^\/todos\/\d+$/) && method === "GET") {
    const id = parseInt(url.split("/")[2]);
    const todo = todos.find((t) => t.id === id);

    if (todo) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ todo }));
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Todo not found" }));
    }
  }

  // ============================================
  // Route: POST /todos — Create a todo
  // ============================================
  else if (url === "/todos" && method === "POST") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        const { task } = JSON.parse(body);

        if (!task) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Task is required" }));
          return;
        }

        const newTodo = {
          id: todos.length + 1,
          task,
          done: false,
        };

        todos.push(newTodo);

        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Todo created", todo: newTodo }));
      } catch (err) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid JSON" }));
      }
    });
  }

  // ============================================
  // 404 — Route not found
  // ============================================
  else {
    res.writeHead(404, { "Content-Type": "text/html" });
    res.end("<h1>404 — Page Not Found</h1>");
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log("Try visiting:");
  console.log(`  http://localhost:${PORT}/`);
  console.log(`  http://localhost:${PORT}/todos`);
  console.log(`  http://localhost:${PORT}/todos/1`);
  console.log(`  http://localhost:${PORT}/about`);
});
