// File System (fs) Module
// The fs module lets you work with files — read, write, update, delete, and more.

const fs = require("fs");

// ============================================
// Reading Files
// ============================================

// Asynchronous (non-blocking) — preferred
fs.readFile("./example.txt", "utf8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }
  console.log("File content:", data);
});

// ============================================
// Writing Files
// ============================================

// writeFile — creates file if it doesn't exist, overwrites if it does
fs.writeFile("./output.txt", "Hello from Node.js!", "utf8", (err) => {
  if (err) {
    console.error("Error writing file:", err);
    return;
  }
  console.log("File written successfully!");
});

// ============================================
// Appending to Files
// ============================================

// appendFile — adds content to the end of a file (creates if doesn't exist)
fs.appendFile("./output.txt", "\nAppended text!", "utf8", (err) => {
  if (err) {
    console.error("Error appending:", err);
    return;
  }
  console.log("Content appended!");
});

// ============================================
// Deleting Files
// ============================================

// unlink — deletes a file
fs.unlink("./output.txt", (err) => {
  if (err) {
    console.error("Error deleting file:", err);
    return;
  }
  console.log("File deleted!");
});

// ============================================
// Renaming Files
// ============================================

fs.rename("./old-name.txt", "./new-name.txt", (err) => {
  if (err) {
    console.error("Error renaming:", err);
    return;
  }
  console.log("File renamed!");
});

// ============================================
// Working with Directories
// ============================================

// Create a directory
fs.mkdir("./new-folder", (err) => {
  if (err) {
    console.error("Error creating directory:", err);
    return;
  }
  console.log("Directory created!");
});

// Read directory contents
fs.readdir("./", (err, files) => {
  if (err) {
    console.error("Error reading directory:", err);
    return;
  }
  console.log("Files in directory:", files);
});

// Remove a directory (must be empty)
fs.rmdir("./new-folder", (err) => {
  if (err) console.error(err);
  else console.log("Directory removed!");
});
