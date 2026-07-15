// Assignment 3: Simple HTTP Server
// ==================================
//
// Build a raw HTTP server (no Express!) that serves different pages.
// This will help you understand what Express does under the hood.
//
// Requirements:
// 1. Use the http module to create a server on port 3000
// 2. Handle these routes:
//    GET  /           → Home page (HTML) with a welcome message and links to other pages
//    GET  /about      → About page (HTML) with info about yourself
//    GET  /contact    → Contact page (HTML) with a simple contact form (doesn't need to work)
//    GET  /api/time   → Current server time (JSON response)
//    GET  /api/random → A random number between 1-100 (JSON response)
//    Any other URL    → 404 page (HTML) with a "Go Home" link
//
// 3. Set the correct Content-Type header for each response:
//    - text/html for HTML pages
//    - application/json for API endpoints
//
// 4. Set the correct status codes:
//    - 200 for successful responses
//    - 404 for unknown routes
//
// 5. Create a simple HTML template for each page (inline strings are fine)
//
// Hints:
// - http.createServer((req, res) => { ... })
// - req.url and req.method to determine the route
// - res.writeHead(statusCode, { 'Content-Type': '...' })
// - res.end(content)
// - Math.floor(Math.random() * 100) + 1 for random number
// - new Date().toISOString() for current time
//
// Bonus:
// - Add basic CSS styling inline in the HTML
// - Handle POST /api/echo — read the request body and send it back as JSON
// - Add a visit counter that tracks how many times each page has been visited
