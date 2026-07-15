// HTTP Module
// The http module lets you create web servers without any framework.
// This is what Express.js is built on top of.

const http = require("http");

// ============================================
// Creating a Basic HTTP Server
// ============================================

const server = http.createServer((req, res) => {
  // req = the incoming request object (what the client sent)
  // res = the response object (what we send back)

  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Hello World!");
});

// Start the server on port 3000
server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});

// ============================================
// Request Object (req) — useful properties
// ============================================

// const server2 = http.createServer((req, res) => {
//   console.log("Method:", req.method);   // GET, POST, PUT, DELETE
//   console.log("URL:", req.url);          // /about, /users, /
//   console.log("Headers:", req.headers);  // { host: 'localhost:3000', ... }

//   res.end("Request received");
// });

// ============================================
// Manual Routing (handling different URLs)
// ============================================

// const server3 = http.createServer((req, res) => {
//   if (req.url === "/" && req.method === "GET") {
//     res.writeHead(200, { "Content-Type": "text/html" });
//     res.end("<h1>Home Page</h1>");
//   } else if (req.url === "/about" && req.method === "GET") {
//     res.writeHead(200, { "Content-Type": "text/html" });
//     res.end("<h1>About Page</h1>");
//   } else if (req.url === "/api/users" && req.method === "GET") {
//     // Serving JSON
//     const users = [
//       { id: 1, name: "Praveen" },
//       { id: 2, name: "John" },
//     ];
//     res.writeHead(200, { "Content-Type": "application/json" });
//     res.end(JSON.stringify(users));
//   } else {
//     // 404 Not Found
//     res.writeHead(404, { "Content-Type": "text/html" });
//     res.end("<h1>404 - Page Not Found</h1>");
//   }
// });

// server3.listen(3000);

// ============================================
// Serving JSON Response
// ============================================

// const server4 = http.createServer((req, res) => {
//   const data = {
//     message: "Hello from the API",
//     timestamp: new Date().toISOString(),
//   };

//   res.writeHead(200, { "Content-Type": "application/json" });
//   res.end(JSON.stringify(data));
// });

// ============================================
// Handling POST Request Body
// ============================================

// const server5 = http.createServer((req, res) => {
//   if (req.method === "POST" && req.url === "/api/users") {
//     let body = "";

//     // Data comes in chunks
//     req.on("data", (chunk) => {
//       body += chunk.toString();
//     });

//     // When all data is received
//     req.on("end", () => {
//       const user = JSON.parse(body);
//       console.log("Received user:", user);

//       res.writeHead(201, { "Content-Type": "application/json" });
//       res.end(JSON.stringify({ message: "User created", user }));
//     });
//   }
// });

// ============================================
// Why this is hard without Express
// ============================================
// Notice how much code we need for:
// - Different routes? Manual if/else chains
// - JSON parsing? Manual chunk collection
// - Content types? Manual header setting
// - Query params? Manual URL parsing
//
// Express simplifies ALL of this!
// app.get('/users', (req, res) => res.json(users));  // That's it!
