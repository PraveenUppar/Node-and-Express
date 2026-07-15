// Node.js Introduction
// Node.js lets you run JavaScript outside the browser — on your computer, on a server, anywhere.

// Running a file: node 01-intro.js

// console.log works the same as in the browser
console.log("Hello from Node.js!");

// ============================================
// global object (instead of window in browser)
// ============================================

// In browser: window is the global object
// In Node.js: global is the global object
console.log(global); // Shows the global object (very large)

// But we don't usually use `global` directly — Node wraps each file in a module

// ============================================
// __dirname and __filename
// ============================================

// __dirname = the absolute path of the folder containing the current file
console.log("Directory:", __dirname);

// __filename = the absolute path of the current file (including filename)
console.log("File:", __filename);

// ============================================
// process object
// ============================================

// process = a global object that provides info about the current Node.js process

// Process ID
console.log("Process ID:", process.pid);

// Node.js version
console.log("Node Version:", process.version);

// Platform (win32, linux, darwin)
console.log("Platform:", process.platform);

// Current working directory
console.log("CWD:", process.cwd());

// ============================================
// process.argv — command line arguments
// ============================================

// When you run: node 01-intro.js hello world
// process.argv = ['path/to/node', 'path/to/01-intro.js', 'hello', 'world']
console.log("Arguments:", process.argv);

// Get only user-provided arguments
const userArgs = process.argv.slice(2);
console.log("User Args:", userArgs);

// ============================================
// process.exit()
// ============================================

// Manually exit the program
// process.exit(0);  // 0 = success
// process.exit(1);  // 1 = error

// ============================================
// setTimeout and setInterval (same as browser)
// ============================================

setTimeout(() => {
  console.log("This runs after 1 second");
}, 1000);

setInterval(() => {
  console.log("This runs every 2 seconds");
}, 2000);

// To stop the interval, use clearInterval
// const interval = setInterval(() => { ... }, 2000);
// clearInterval(interval);
