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

const express = require("express");

const app = express();
const PORT = 3000;
const categories = [
  "Food",
  "Transport",
  "Entertainment",
  "Bills",
  "Shopping",
  "Other",
];
const paymentMethods = ["Cash", "Card", "UPI"];
const budgets = new Map();

app.use(express.json());

let nextId = 6;
let expenses = [
  {
    id: 1,
    description: "Grocery shopping",
    amount: 45.5,
    category: "Food",
    date: "2025-07-15",
    paymentMethod: "Card",
  },
  {
    id: 2,
    description: "Bus pass",
    amount: 25,
    category: "Transport",
    date: "2025-07-08",
    paymentMethod: "Cash",
  },
  {
    id: 3,
    description: "Movie tickets",
    amount: 30,
    category: "Entertainment",
    date: "2025-07-20",
    paymentMethod: "UPI",
  },
  {
    id: 4,
    description: "Electricity bill",
    amount: 75,
    category: "Bills",
    date: "2025-07-05",
    paymentMethod: "Card",
  },
  {
    id: 5,
    description: "New shirt",
    amount: 40,
    category: "Shopping",
    date: "2025-07-12",
    paymentMethod: "UPI",
  },
];

function isValidDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
}

function validateExpense(data, requireAllFields = true) {
  const errors = [];
  const description =
    typeof data.description === "string"
      ? data.description.trim()
      : data.description;
  const amount =
    typeof data.amount === "string" && data.amount.trim() !== ""
      ? Number(data.amount)
      : data.amount;

  if (requireAllFields && !description) errors.push("description is required");
  if (
    requireAllFields &&
    (data.amount === undefined || data.amount === null || data.amount === "")
  )
    errors.push("amount is required");
  if (requireAllFields && !data.category) errors.push("category is required");
  if (data.amount !== undefined && (!Number.isFinite(amount) || amount <= 0))
    errors.push("amount must be a positive number");
  if (data.category !== undefined && !categories.includes(data.category))
    errors.push(`category must be one of: ${categories.join(", ")}`);
  if (data.date !== undefined && !isValidDate(data.date))
    errors.push("date must use YYYY-MM-DD format");
  if (
    data.paymentMethod !== undefined &&
    !paymentMethods.includes(data.paymentMethod)
  )
    errors.push(`paymentMethod must be one of: ${paymentMethods.join(", ")}`);

  return { errors, description, amount };
}

function invalidId(id) {
  return !/^\d+$/.test(id) || Number(id) < 1;
}

function getExpense(id) {
  return expenses.find((expense) => expense.id === Number(id));
}

function parseNumberQuery(value, field) {
  if (value === undefined) return null;
  const number = Number(value);
  return Number.isFinite(number)
    ? number
    : { error: `${field} must be a number` };
}

function calculateSummary(items) {
  const totalSpending = items.reduce(
    (total, expense) => total + expense.amount,
    0,
  );
  const spendingByCategory = {};
  const expenseCountByCategory = {};

  for (const expense of items) {
    spendingByCategory[expense.category] =
      (spendingByCategory[expense.category] || 0) + expense.amount;
    expenseCountByCategory[expense.category] =
      (expenseCountByCategory[expense.category] || 0) + 1;
  }

  const mostExpensiveCategory =
    Object.entries(spendingByCategory).sort((a, b) => b[1] - a[1])[0]?.[0] ||
    null;
  return {
    totalSpending,
    spendingByCategory,
    averageExpense: items.length ? totalSpending / items.length : 0,
    mostExpensiveCategory,
    expenseCountByCategory,
    numberOfExpenses: items.length,
  };
}

app.get("/expenses/summary", (req, res) => {
  let items = expenses;
  if (req.query.month !== undefined || req.query.year !== undefined) {
    const month = Number(req.query.month);
    const year = Number(req.query.year);
    if (
      !Number.isInteger(month) ||
      month < 1 ||
      month > 12 ||
      !Number.isInteger(year) ||
      year < 1
    ) {
      return res
        .status(400)
        .json({
          error: "month must be 1-12 and year must be a positive integer",
        });
    }
    const prefix = `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-`;
    items = expenses.filter((expense) => expense.date.startsWith(prefix));
  }
  res.json(calculateSummary(items));
});

app.get("/expenses", (req, res) => {
  let results = [...expenses];
  if (req.query.category !== undefined) {
    if (!categories.includes(req.query.category))
      return res.status(400).json({ error: "invalid category" });
    results = results.filter(
      (expense) => expense.category === req.query.category,
    );
  }

  const minAmount = parseNumberQuery(req.query.minAmount, "minAmount");
  const maxAmount = parseNumberQuery(req.query.maxAmount, "maxAmount");
  if (minAmount?.error || maxAmount?.error)
    return res.status(400).json({ error: minAmount?.error || maxAmount.error });
  if (minAmount !== null)
    results = results.filter((expense) => expense.amount >= minAmount);
  if (maxAmount !== null)
    results = results.filter((expense) => expense.amount <= maxAmount);
  if (req.query.startDate !== undefined && !isValidDate(req.query.startDate))
    return res
      .status(400)
      .json({ error: "startDate must use YYYY-MM-DD format" });
  if (req.query.endDate !== undefined && !isValidDate(req.query.endDate))
    return res
      .status(400)
      .json({ error: "endDate must use YYYY-MM-DD format" });
  if (req.query.startDate)
    results = results.filter((expense) => expense.date >= req.query.startDate);
  if (req.query.endDate)
    results = results.filter((expense) => expense.date <= req.query.endDate);
  if (
    req.query.sort === "amount" ||
    req.query.sort === "date" ||
    req.query.sort === "description"
  ) {
    const direction = req.query.order === "desc" ? -1 : 1;
    results.sort((a, b) =>
      a[req.query.sort] > b[req.query.sort] ? direction : -direction,
    );
  }
  res.json(results);
});

app.get("/expenses/:id", (req, res) => {
  if (invalidId(req.params.id) || !getExpense(req.params.id))
    return res.status(404).json({ error: "expense not found" });
  res.json(getExpense(req.params.id));
});

app.post("/expenses", (req, res) => {
  const validation = validateExpense(req.body);
  if (validation.errors.length)
    return res.status(400).json({ errors: validation.errors });
  const expense = {
    id: nextId++,
    description: validation.description,
    amount: validation.amount,
    category: req.body.category,
    date: req.body.date || new Date().toISOString().slice(0, 10),
    paymentMethod: req.body.paymentMethod || "Cash",
  };
  expenses.push(expense);
  res.status(201).json(expense);
});

function updateExpense(req, res) {
  if (invalidId(req.params.id))
    return res.status(404).json({ error: "expense not found" });
  const expense = getExpense(req.params.id);
  if (!expense) return res.status(404).json({ error: "expense not found" });
  const validation = validateExpense(req.body);
  if (validation.errors.length)
    return res.status(400).json({ errors: validation.errors });
  Object.assign(expense, {
    description: validation.description,
    amount: validation.amount,
    category: req.body.category,
    date: req.body.date || expense.date,
    paymentMethod: req.body.paymentMethod || "Cash",
  });
  res.json(expense);
}

app.put("/expenses/:id", updateExpense);

app.delete("/expenses/:id", (req, res) => {
  if (invalidId(req.params.id))
    return res.status(404).json({ error: "expense not found" });
  const index = expenses.findIndex(
    (expense) => expense.id === Number(req.params.id),
  );
  if (index === -1) return res.status(404).json({ error: "expense not found" });
  const deleted = expenses.splice(index, 1)[0];
  res.json({ message: "expense deleted", expense: deleted });
});

app.post("/budget", (req, res) => {
  const month = Number(req.body.month);
  const year = Number(req.body.year);
  const amount = Number(req.body.amount);
  if (
    !Number.isInteger(month) ||
    month < 1 ||
    month > 12 ||
    !Number.isInteger(year) ||
    year < 1 ||
    !Number.isFinite(amount) ||
    amount <= 0
  ) {
    return res
      .status(400)
      .json({ error: "month, year, and a positive amount are required" });
  }
  const key = `${year}-${String(month).padStart(2, "0")}`;
  budgets.set(key, amount);
  res.status(201).json({ month, year, budget: amount });
});

app.get("/budget", (req, res) => {
  const month = Number(req.query.month);
  const year = Number(req.query.year);
  if (
    !Number.isInteger(month) ||
    month < 1 ||
    month > 12 ||
    !Number.isInteger(year) ||
    year < 1
  )
    return res.status(400).json({ error: "month and year are required" });
  const key = `${year}-${String(month).padStart(2, "0")}`;
  const spending = calculateSummary(
    expenses.filter((expense) => expense.date.startsWith(`${key}-`)),
  ).totalSpending;
  const budget = budgets.get(key) || 0;
  res.json({
    month,
    year,
    budget,
    spending,
    remaining: budget - spending,
    exceeded: spending > budget,
  });
});

if (require.main === module) {
  app.listen(PORT, () =>
    console.log(`Expense Tracker API running at http://localhost:${PORT}`),
  );
}

module.exports = app;
