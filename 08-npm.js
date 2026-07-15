// NPM (Node Package Manager)
// npm is the default package manager for Node.js.
// It lets you install, manage, and share reusable packages (libraries).

// ============================================
// Initializing a Project
// ============================================

// npm init        — creates package.json interactively (asks questions)
// npm init -y     — creates package.json with default values (no questions)

// package.json = the "ID card" of your project
// It contains: project name, version, description, scripts, dependencies

// Example package.json:
// {
//   "name": "my-app",
//   "version": "1.0.0",
//   "description": "My Node.js app",
//   "main": "index.js",
//   "scripts": {
//     "start": "node index.js",
//     "dev": "nodemon index.js"
//   },
//   "dependencies": {
//     "express": "^4.18.2"
//   },
//   "devDependencies": {
//     "nodemon": "^3.0.1"
//   }
// }

// ============================================
// Installing Packages
// ============================================

// npm install <package>        — install as a dependency (goes to "dependencies")
// npm install <package> --save-dev  — install as dev dependency (goes to "devDependencies")
// npm install                  — install all dependencies from package.json
// npm install -g <package>     — install globally (available everywhere)

// Short forms:
// npm i express           — same as npm install express
// npm i nodemon -D        — same as npm install nodemon --save-dev

// ============================================
// dependencies vs devDependencies
// ============================================

// dependencies     — packages needed to RUN the app (express, mongoose, dotenv)
// devDependencies  — packages needed only for DEVELOPMENT (nodemon, jest, eslint)

// ============================================
// node_modules folder
// ============================================

// When you run npm install, packages are downloaded into the node_modules folder.
// This folder can be HUGE — never push it to Git!
// Add it to .gitignore:
// node_modules/

// ============================================
// package-lock.json
// ============================================

// Auto-generated file that locks exact versions of all installed packages.
// Ensures everyone on the team gets the same versions.
// DO commit this to Git.

// ============================================
// Commonly Used Packages
// ============================================

// express       — web framework for building APIs and servers
// nodemon       — auto-restarts server when you save a file (dev only)
// dotenv        — loads environment variables from .env file
// uuid          — generates unique IDs
// cors          — enables Cross-Origin Resource Sharing
// morgan        — HTTP request logger middleware
// body-parser   — parses request body (now built into Express)
// mongoose      — MongoDB ODM (Object Data Modeling)

// ============================================
// NPM Scripts
// ============================================

// Scripts are defined in package.json under "scripts"
// {
//   "scripts": {
//     "start": "node index.js",
//     "dev": "nodemon index.js",
//     "test": "jest"
//   }
// }

// Run scripts:
// npm start      — runs the "start" script (special — no "run" needed)
// npm run dev     — runs the "dev" script
// npm test        — runs the "test" script (special — no "run" needed)

// ============================================
// Useful npm Commands
// ============================================

// npm list                — list installed packages
// npm list -g             — list globally installed packages
// npm outdated            — check for outdated packages
// npm update              — update packages to latest compatible versions
// npm uninstall <package> — remove a package

// ============================================
// Semantic Versioning (SemVer)
// ============================================

// Version format: MAJOR.MINOR.PATCH
// Example: 4.18.2

// MAJOR (4)  — breaking changes (not backward compatible)
// MINOR (18) — new features (backward compatible)
// PATCH (2)  — bug fixes (backward compatible)

// In package.json:
// "^4.18.2"  — accepts MINOR and PATCH updates (4.x.x)
// "~4.18.2"  — accepts only PATCH updates (4.18.x)
// "4.18.2"   — exact version only

// ============================================
// .gitignore for Node.js projects
// ============================================

// node_modules/
// .env
// *.log
