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

// Install: npm install dotenv

// Step 1: Create a .env file in your project root
// -----------------------------------------------
// .env file contents:
// PORT=3000
// DATABASE_URL=mongodb://localhost:27017/myapp
// API_KEY=abc123secret
// JWT_SECRET=my-super-secret-key
// NODE_ENV=development

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

// ============================================
// Using env variables in Express
// ============================================

const express = require("express");
const app = express();

// Use the PORT from .env
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Use API key for authentication
app.get("/api/data", (req, res) => {
  const clientKey = req.headers["x-api-key"];

  if (clientKey !== process.env.API_KEY) {
    return res.status(401).json({ error: "Invalid API key" });
  }

  res.json({ message: "Authorized! Here's your data." });
});

// ============================================
// Default Values (Fallback)
// ============================================

// Use || to provide defaults if env variable is not set
const port = process.env.PORT || 3000;
const nodeEnv = process.env.NODE_ENV || "development";
const dbUrl =
  process.env.DATABASE_URL || "mongodb://localhost:27017/default-db";

// ============================================
// Different Environments
// ============================================

// Development vs Production
if (process.env.NODE_ENV === "production") {
  console.log("Running in PRODUCTION mode");
  // Use real database, disable debug logs, enable HTTPS
} else {
  console.log("Running in DEVELOPMENT mode");
  // Use local database, enable debug logs, allow CORS from localhost
}

// ============================================
// IMPORTANT: Keeping .env Safe
// ============================================

// 1. NEVER commit .env to Git!
//    Add it to .gitignore:
//    .env

// 2. Create a .env.example file (commit this to Git)
//    It shows what variables are needed, without actual values:
//    PORT=3000
//    DATABASE_URL=your_database_url_here
//    API_KEY=your_api_key_here
//    JWT_SECRET=your_jwt_secret_here
//    NODE_ENV=development

// 3. Each developer creates their own .env based on .env.example

// ============================================
// Setting env variables without dotenv (command line)
// ============================================

// Windows (PowerShell):
// $env:PORT="4000"; node app.js

// Windows (CMD):
// set PORT=4000 && node app.js

// Mac/Linux:
// PORT=4000 node app.js

// Or use cross-env package for cross-platform:
// npm install cross-env
// "scripts": { "start": "cross-env NODE_ENV=production node app.js" }
