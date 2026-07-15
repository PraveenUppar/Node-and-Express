// Assignment 5: URL Shortener
// =============================
//
// Build an Express app that shortens URLs and redirects users.
// When someone visits the short URL, they get redirected to the original long URL.
//
// Endpoints:
//   POST /shorten          → Create a short URL
//   GET  /:shortCode       → Redirect to the original URL
//   GET  /api/urls         → List all shortened URLs with stats
//   GET  /api/urls/:code   → Get info about a specific short URL
//
// How it works:
// 1. User sends POST /shorten with { "url": "https://www.google.com" }
// 2. Server generates a short code (e.g., "abc123")
// 3. Server responds with { "shortUrl": "http://localhost:3000/abc123", "code": "abc123" }
// 4. When someone visits http://localhost:3000/abc123, they get redirected to https://www.google.com
//
// Requirements:
// 1. Generate a random 6-character short code (use Math.random or a simple function)
// 2. Store the mapping in-memory: { shortCode: { originalUrl, createdAt, visits } }
// 3. Track the number of visits (clicks) for each short URL
// 4. Validate that the URL starts with http:// or https://
// 5. Don't allow duplicate URLs — if the same URL is shortened again, return the existing code
// 6. Use res.redirect() for the redirection
//
// Hints:
// - Math.random().toString(36).substring(2, 8) generates a random 6-char string
// - res.redirect(url) redirects the client
// - Use an object (Map) to store URL mappings
// - Validate URL: url.startsWith('http://') || url.startsWith('https://')
//
// Bonus:
// - Add expiration: short URLs expire after 24 hours
// - Add custom codes: POST /shorten { "url": "...", "customCode": "mylink" }
// - Add a simple HTML page at GET / that shows a form to shorten URLs
