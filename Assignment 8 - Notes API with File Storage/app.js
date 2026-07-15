// Assignment 8: Notes API with File Storage
// ============================================
//
// Build an Express API that stores notes as JSON files using the fs module.
// Unlike other assignments, this one persists data to disk — so notes survive server restarts!
//
// Endpoints:
//   GET    /notes              → Get all notes
//   GET    /notes/:id          → Get a specific note
//   POST   /notes              → Create a new note
//   PUT    /notes/:id          → Update a note
//   DELETE /notes/:id          → Delete a note
//   GET    /notes/search?q=... → Search notes by title or content
//   GET    /notes/tags/:tag    → Get all notes with a specific tag
//
// Note Object Structure:
// {
//   id: "note-1689412345678",
//   title: "Learning Node.js",
//   content: "Node.js is a runtime environment...",
//   tags: ["nodejs", "backend", "javascript"],
//   createdAt: "2025-07-15T10:30:00.000Z",
//   updatedAt: "2025-07-15T10:30:00.000Z"
// }
//
// File Storage Structure:
//   /data/
//     notes.json    ← stores all notes as a JSON array
//   OR
//   /data/notes/
//     note-1689412345678.json   ← one file per note (advanced)
//
// Requirements:
// 1. Create a "data" folder if it doesn't exist (use fs.mkdirSync with recursive)
// 2. Store all notes in data/notes.json
// 3. On server start, load existing notes from the file
// 4. After every create/update/delete, save the updated notes back to the file
// 5. Generate unique IDs using: `note-${Date.now()}`
// 6. Validate: title and content are required
// 7. Auto-set createdAt on creation, updatedAt on updates
// 8. Tags should be an array of strings (optional)
// 9. Search should check both title and content (case-insensitive)
//
// Hints:
// - fs.readFileSync() + JSON.parse() to load notes
// - fs.writeFileSync() + JSON.stringify(data, null, 2) to save notes (pretty printed)
// - fs.existsSync() to check if data folder/file exists
// - Wrap file operations in try-catch for safety
// - Use path.join(__dirname, 'data', 'notes.json') for the file path
//
// Bonus:
// - Store each note as a separate file (one .json per note in data/notes/)
// - Add a "pin" feature: pinned notes always appear first
// - Add markdown support: store content as markdown
// - Add export: GET /notes/export → downloads all notes as a single JSON file
