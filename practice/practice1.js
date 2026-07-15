// Practice 1: File System Challenge
// Task: Read a file, modify its content, and write it to a new file.
// Concepts: fs module, readFile, writeFile, string manipulation

const fs = require("fs");
const path = require("path");

// ============================================
// Exercise 1: Read and Write
// ============================================
// Read the Notes.txt file, convert it to uppercase, and save as UPPERCASE_NOTES.txt

fs.readFile(path.join(__dirname, "..", "Notes.txt"), "utf8", (err, data) => {
  if (err) {
    // Note: This reads from the parent directory — the JavaScript Notes.txt
    console.error("Error reading file:", err.message);
    return;
  }

  const uppercased = data.toUpperCase();

  fs.writeFile(
    path.join(__dirname, "uppercase-notes.txt"),
    uppercased,
    "utf8",
    (err) => {
      if (err) {
        console.error("Error writing file:", err.message);
        return;
      }
      console.log("Exercise 1: uppercase-notes.txt created!");
    }
  );
});

// ============================================
// Exercise 2: Line Counter
// ============================================
// Read a file and count the number of lines, words, and characters

function fileStats(filePath) {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error:", err.message);
      return;
    }

    const lines = data.split("\n").length;
    const words = data.split(/\s+/).filter((w) => w.length > 0).length;
    const characters = data.length;

    console.log(`\nExercise 2 — File Stats:`);
    console.log(`Lines: ${lines}`);
    console.log(`Words: ${words}`);
    console.log(`Characters: ${characters}`);
  });
}

fileStats(path.join(__dirname, "..", "Notes.txt"));

// ============================================
// Exercise 3: Append Logger
// ============================================
// Create a simple logger that appends timestamped messages to a log file

function log(message) {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${message}\n`;

  fs.appendFile(path.join(__dirname, "app.log"), logEntry, "utf8", (err) => {
    if (err) {
      console.error("Error logging:", err.message);
      return;
    }
    console.log("Logged:", message);
  });
}

log("Application started");
log("User logged in");
log("Data fetched successfully");

// ============================================
// Exercise 4: Directory Lister (using promises)
// ============================================
// List all files in the current directory with their sizes

const fsPromises = fs.promises;

async function listFilesWithSize(dirPath) {
  try {
    const files = await fsPromises.readdir(dirPath);

    console.log(`\nExercise 4 — Files in ${dirPath}:`);
    for (const file of files) {
      const stats = await fsPromises.stat(path.join(dirPath, file));
      const type = stats.isDirectory() ? "DIR " : "FILE";
      const size = stats.isFile()
        ? `${(stats.size / 1024).toFixed(2)} KB`
        : "-";
      console.log(`  [${type}] ${file} — ${size}`);
    }
  } catch (err) {
    console.error("Error:", err.message);
  }
}

listFilesWithSize(__dirname);
