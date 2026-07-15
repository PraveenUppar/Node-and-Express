// Path Module
// The path module helps work with file and directory paths in a cross-platform way.
// Important because: Windows uses \ (backslash) and Mac/Linux use / (forward slash)

const path = require("path");

// ============================================
// path.join() — joins path segments together
// ============================================
// Automatically uses the correct separator for the OS

const filePath = path.join("folder", "subfolder", "file.txt");
console.log("Joined path:", filePath);
// Windows: folder\subfolder\file.txt
// Mac/Linux: folder/subfolder/file.txt

// Join with __dirname (get absolute path to a file relative to current script)
const absolutePath = path.join(__dirname, "data", "users.json");
console.log("Absolute path:", absolutePath);

// ============================================
// path.resolve() — resolves to an absolute path
// ============================================
// Similar to join, but always returns an absolute path

const resolved = path.resolve("folder", "file.txt");
console.log("Resolved:", resolved);
// Returns full path from root: C:\...\folder\file.txt

// Difference from join:
console.log("join:", path.join("a", "b", "c")); // a\b\c (relative)
console.log("resolve:", path.resolve("a", "b", "c")); // C:\...\a\b\c (absolute)

// ============================================
// path.basename() — get the filename from a path
// ============================================

const fullPath = "/users/praveen/documents/report.pdf";

console.log("Basename:", path.basename(fullPath));
// Output: report.pdf

console.log("Without extension:", path.basename(fullPath, ".pdf"));
// Output: report

// ============================================
// path.dirname() — get the directory name from a path
// ============================================

console.log("Directory:", path.dirname(fullPath));
// Output: /users/praveen/documents

// ============================================
// path.extname() — get the file extension
// ============================================

console.log("Extension:", path.extname(fullPath));
// Output: .pdf

console.log("Extension:", path.extname("script.min.js"));
// Output: .js

console.log("Extension:", path.extname("Makefile"));
// Output: "" (empty string, no extension)

// ============================================
// path.parse() — break a path into its parts
// ============================================

const parsed = path.parse("/users/praveen/documents/report.pdf");
console.log("Parsed:", parsed);
// Output:
// {
//   root: '/',
//   dir: '/users/praveen/documents',
//   base: 'report.pdf',
//   ext: '.pdf',
//   name: 'report'
// }

// ============================================
// path.format() — build a path from parts (opposite of parse)
// ============================================

const formatted = path.format({
  dir: "/users/praveen",
  base: "file.txt",
});
console.log("Formatted:", formatted);
// Output: /users/praveen/file.txt

// ============================================
// path.isAbsolute() — check if a path is absolute
// ============================================

console.log(path.isAbsolute("/users/praveen")); // true
console.log(path.isAbsolute("./folder/file")); // false
console.log(path.isAbsolute("C:\\Users")); // true (Windows)

// ============================================
// path.sep — the path separator for the OS
// ============================================

console.log("Separator:", path.sep);
// Windows: \
// Mac/Linux: /

// Useful for splitting paths
const parts = "/users/praveen/file.txt".split(path.sep);
console.log("Parts:", parts);
