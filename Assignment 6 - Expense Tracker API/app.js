// Assignment 6: Expense Tracker API
// ====================================
//
// Build an Express CRUD API for tracking personal expenses with categories and totals.
//
// Endpoints:
//   GET    /expenses              → Get all expenses (with optional filters)
//   GET    /expenses/:id          → Get a specific expense
//   POST   /expenses              → Add a new expense
//   PUT    /expenses/:id          → Update an expense
//   DELETE /expenses/:id          → Delete an expense
//   GET    /expenses/summary      → Get spending summary (totals by category)
//
// Expense Object Structure:
// {
//   id: 1,
//   description: "Grocery shopping",
//   amount: 45.50,
//   category: "Food",          // Food, Transport, Entertainment, Bills, Shopping, Other
//   date: "2025-07-15",
//   paymentMethod: "Card"      // Cash, Card, UPI
// }
//
// Requirements:
// 1. Start with at least 5 sample expenses across different categories
// 2. Validate: description, amount, and category are required
// 3. Validate: amount must be a positive number
// 4. Validate: category must be one of the allowed values
// 5. Filter expenses: GET /expenses?category=Food&minAmount=10&maxAmount=100
// 6. Filter by date range: GET /expenses?startDate=2025-01-01&endDate=2025-12-31
// 7. The summary endpoint should return:
//    - Total spending across all expenses
//    - Spending breakdown by category
//    - Average expense amount
//    - Most expensive category
//    - Number of expenses per category
//
// Hints:
// - Use Array.reduce() for calculating totals
// - Use parseFloat() for amount validation
// - Date comparison: new Date(date1) >= new Date(date2)
// - Use [...new Set()] to get unique categories
//
// Bonus:
// - Add monthly summaries: GET /expenses/summary?month=7&year=2025
// - Add sorting: GET /expenses?sort=amount&order=desc
// - Add a budget feature: set a monthly budget and check if spending exceeds it
