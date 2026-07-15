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

// Synchronous (blocking) — blocks the thread until done
// try {
//   const data = fs.readFileSync("./example.txt", "utf8");
//   console.log("File content:", data);
// } catch (err) {
//   console.error("Error:", err);
// }

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

// Synchronous version
// fs.writeFileSync("./output.txt", "Hello from Node.js!", "utf8");

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
// fs.unlink("./output.txt", (err) => {
//   if (err) {
//     console.error("Error deleting file:", err);
//     return;
//   }
//   console.log("File deleted!");
// });

// ============================================
// Renaming Files
// ============================================

// fs.rename("./old-name.txt", "./new-name.txt", (err) => {
//   if (err) {
//     console.error("Error renaming:", err);
//     return;
//   }
//   console.log("File renamed!");
// });

// ============================================
// Checking if File Exists
// ============================================

// fs.existsSync — returns true or false
if (fs.existsSync("./output.txt")) {
  console.log("File exists!");
} else {
  console.log("File does not exist.");
}

// ============================================
// Working with Directories
// ============================================

// Create a directory
// fs.mkdir("./new-folder", (err) => {
//   if (err) {
//     console.error("Error creating directory:", err);
//     return;
//   }
//   console.log("Directory created!");
// });

// Create nested directories (recursive: true)
// fs.mkdir("./parent/child/grandchild", { recursive: true }, (err) => {
//   if (err) {
//     console.error("Error:", err);
//     return;
//   }
//   console.log("Nested directories created!");
// });

// Read directory contents
fs.readdir("./", (err, files) => {
  if (err) {
    console.error("Error reading directory:", err);
    return;
  }
  console.log("Files in directory:", files);
});

// Remove a directory (must be empty)
// fs.rmdir("./new-folder", (err) => {
//   if (err) console.error(err);
//   else console.log("Directory removed!");
// });

// Remove directory with contents (recursive)
// fs.rm("./new-folder", { recursive: true }, (err) => {
//   if (err) console.error(err);
//   else console.log("Directory and contents removed!");
// });

// ============================================
// File Stats
// ============================================

fs.stat("./03-file-system.js", (err, stats) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log("Is file:", stats.isFile());
  console.log("Is directory:", stats.isDirectory());
  console.log("File size (bytes):", stats.size);
  console.log("Created:", stats.birthtime);
  console.log("Last modified:", stats.mtime);
});

// ============================================
// Promises version (fs.promises) — modern approach
// ============================================

const fsPromises = require("fs").promises;

async function readFileAsync() {
  try {
    const data = await fsPromises.readFile("./example.txt", "utf8");
    console.log("Async read:", data);
  } catch (err) {
    console.error("Error:", err);
  }
}

async function writeFileAsync() {
  try {
    await fsPromises.writeFile("./async-output.txt", "Written with promises!");
    console.log("Async write complete!");
  } catch (err) {
    console.error("Error:", err);
  }
}

// readFileAsync();
// writeFileAsync();
