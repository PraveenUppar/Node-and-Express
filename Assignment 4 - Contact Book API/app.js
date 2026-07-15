// Assignment 4: Contact Book API
// ================================
//
// Build an Express REST API to manage contacts (name, phone, email).
// All data is stored in-memory (no database needed).
//
// Endpoints:
//   GET    /contacts              → Get all contacts
//   GET    /contacts/:id          → Get a specific contact by ID
//   POST   /contacts              → Create a new contact
//   PUT    /contacts/:id          → Update a contact
//   DELETE /contacts/:id          → Delete a contact
//   GET    /contacts/search?q=... → Search contacts by name or email
//
// Contact Object Structure:
// {
//   id: 1,
//   name: "Praveen",
//   phone: "+91-9876543210",
//   email: "praveen@example.com",
//   group: "Friends"    // optional: Friends, Family, Work, Other
// }
//
// Requirements:
// 1. Use Express and express.json() middleware
// 2. Start with at least 3 sample contacts
// 3. Auto-increment IDs for new contacts
// 4. Validate: name and phone are required for POST and PUT
// 5. Validate: email format (must contain @) if provided
// 6. Validate: phone format (must be at least 10 digits)
// 7. Return proper status codes (200, 201, 400, 404)
// 8. Search should be case-insensitive and match partial names/emails
//
// Hints:
// - npm init -y && npm install express
// - Use express.Router() for clean routing
// - Use Array methods: find(), findIndex(), filter(), push(), splice()
// - String methods: includes(), toLowerCase()
//
// Bonus:
// - Add a "favorite" field (boolean) and a route GET /contacts/favorites
// - Add pagination: GET /contacts?page=1&limit=5
// - Add grouping: GET /contacts?group=Work
// - Add a PATCH route for partial updates
