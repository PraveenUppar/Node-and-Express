// Environment Variables
// Environment variables store configuration values OUTSIDE your code.
// Used for: API keys, database URLs, port numbers, secrets — anything you don't want hardcoded.

// ============================================
// process.env — accessing environment variables
// ============================================

// Node.js provides process.env to access environment variables
console.log("Node Environment:", process.env.NODE_ENV); // "development", "production", etc.
console.log("Path:", process.env.PATH); // System PATH variable

// ============================================
// Using dotenv Package
// ============================================

// Step 2: Load .env at the top of your main file
require("dotenv").config();
// This loads all variables from .env into process.env

// Step 3: Access the variables
const PORT = process.env.PORT || 3000; // Default to 3000 if not set
const DB_URL = process.env.DATABASE_URL;
const API_KEY = process.env.API_KEY;

console.log("Port:", PORT);
console.log("DB URL:", DB_URL);
console.log("API Key:", API_KEY);
