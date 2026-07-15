// Assignment 2: CLI Todo App
// ============================
//
// Build a command-line todo list application using the fs module.
// The app should store todos in a JSON file and support commands via process.argv.
//
// Usage:
//   node app.js add "Buy groceries"       → adds a todo
//   node app.js list                      → lists all todos
//   node app.js done 1                    → marks todo #1 as complete
//   node app.js delete 2                  → deletes todo #2
//   node app.js clear                     → removes all completed todos
//
// Requirements:
// 1. Store todos in a todos.json file (create if it doesn't exist)
// 2. Each todo should have: id, task, done (boolean), createdAt (timestamp)
// 3. The "list" command should show todos with their status:
//    [✓] 1. Buy groceries
//    [ ] 2. Learn Node.js
//    [ ] 3. Build a project
// 4. The "done" command marks a todo as complete by its ID
// 5. The "delete" command removes a todo by its ID
// 6. The "clear" command removes all completed todos
// 7. Handle edge cases: invalid IDs, empty list, missing arguments
//
// Hints:
// - Use process.argv to get command line arguments
// - Use JSON.parse() and JSON.stringify() to read/write JSON files
// - fs.existsSync() to check if the file exists
// - fs.readFileSync() and fs.writeFileSync() for sync file operations
//
// Bonus:
// - Add a "search" command: node app.js search "grocery"
// - Add priority levels: node app.js add "Urgent task" --priority=high
// - Show how many todos are done vs total
