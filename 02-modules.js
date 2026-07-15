// Modules in Node.js
// A module is just a file. Each file in Node.js is treated as a separate module.
// Modules help organize code into reusable pieces.

// ============================================
// CommonJS Modules (require / module.exports)
// ============================================
// This is the default module system in Node.js

// --- Exporting from a module ---

// Method 1: module.exports (single export)
// In a file called math.js:
// module.exports = function add(a, b) {
//   return a + b;
// };

// Method 2: module.exports (multiple exports as object)
// In a file called math.js:
// module.exports = {
//   add: (a, b) => a + b,
//   subtract: (a, b) => a - b,
//   multiply: (a, b) => a * b,
// };

// Method 3: exports shorthand
// In a file called math.js:
// exports.add = (a, b) => a + b;
// exports.subtract = (a, b) => a - b;

// --- Importing a module ---

// const add = require('./math');           // Method 1
// const { add, subtract } = require('./math');  // Method 2 (destructuring)

// Example: Creating and using a custom module
// =============================================

// greet.js (the module)
// function greet(name) {
//   return `Hello, ${name}!`;
// }
// module.exports = greet;

// app.js (using the module)
// const greet = require('./greet');
// console.log(greet('Praveen')); // Hello, Praveen!

// ============================================
// Built-in Modules (no install needed)
// ============================================

// fs    — File system operations (read, write, delete files)
const fs = require("fs");

// path  — Work with file paths
const path = require("path");

// http  — Create web servers
const http = require("http");

// os    — Operating system info
const os = require("os");

// events — Event-driven programming
const events = require("events");

// Example: os module
console.log("OS Type:", os.type()); // Windows_NT, Linux, Darwin
console.log("Free Memory:", os.freemem()); // Free memory in bytes
console.log("Total Memory:", os.totalmem()); // Total memory in bytes
console.log("Home Directory:", os.homedir()); // User home directory
console.log("CPU Cores:", os.cpus().length); // Number of CPU cores

// ============================================
// ES Modules (import / export) — Modern syntax
// ============================================
// To use ES modules in Node.js:
// Option 1: Rename file to .mjs
// Option 2: Add "type": "module" in package.json

// --- Named exports ---
// In math.mjs:
// export const add = (a, b) => a + b;
// export const subtract = (a, b) => a - b;

// In app.mjs:
// import { add, subtract } from './math.mjs';

// --- Default export ---
// In greet.mjs:
// export default function greet(name) {
//   return `Hello, ${name}!`;
// }

// In app.mjs:
// import greet from './greet.mjs';

// ============================================
// CommonJS vs ES Modules
// ============================================
// CommonJS:  require() / module.exports  — synchronous, used by default in Node.js
// ES Module: import / export             — asynchronous, modern standard, used in browsers

// CommonJS loads modules at runtime (dynamic)
// ES Modules are analyzed at parse time (static) — enables tree shaking

// ============================================
// require() caching
// ============================================
// When you require a module, Node.js caches it
// Subsequent require() calls return the cached version (not re-executed)

// const mod1 = require('./myModule'); // Executes the module
// const mod2 = require('./myModule'); // Returns cached version (same object)
// console.log(mod1 === mod2); // true
