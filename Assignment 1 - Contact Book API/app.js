// Assignment 4: Contact Book API
// ================================
//
// Build an Express REST API to manage contacts (name, phone, email).
// All data is stored in-memory (no database needed).
//
// Endpoints:
//   GET    /contacts              → Get all contacts
//   GET    /contacts/:id          → Get a specific contact by ID
//   POST   /contacts              → Create a new contact
//   PUT    /contacts/:id          → Update a contact
//   DELETE /contacts/:id          → Delete a contact
//   GET    /contacts/search?q=... → Search contacts by name or email
//
// Contact Object Structure:
// {
//   id: 1,
//   name: "Praveen",
//   phone: "+91-9876543210",
//   email: "praveen@example.com",
//   group: "Friends"    // optional: Friends, Family, Work, Other
// }
//
// Requirements:
// 1. Use Express and express.json() middleware
// 2. Start with at least 3 sample contacts
// 3. Auto-increment IDs for new contacts
// 4. Validate: name and phone are required for POST and PUT
// 5. Validate: email format (must contain @) if provided
// 6. Validate: phone format (must be at least 10 digits)
// 7. Return proper status codes (200, 201, 400, 404)
// 8. Search should be case-insensitive and match partial names/emails
//
// Hints:
// - npm init -y && npm install express
// - Use express.Router() for clean routing
// - Use Array methods: find(), findIndex(), filter(), push(), splice()
// - String methods: includes(), toLowerCase()
//
// Bonus:
// - Add a "favorite" field (boolean) and a route GET /contacts/favorites
// - Add pagination: GET /contacts?page=1&limit=5
// - Add grouping: GET /contacts?group=Work
// - Add a PATCH route for partial updates

const express = require("express");

const app = express();
const PORT = 3000;
const allowedGroups = ["Friends", "Family", "Work", "Other"];

app.use(express.json());

let nextId = 4;
let contacts = [
  {
    id: 1,
    name: "Praveen",
    phone: "+91-9876543210",
    email: "praveen@example.com",
    group: "Friends",
    favorite: true,
  },
  {
    id: 2,
    name: "Anita",
    phone: "+91-9876543211",
    email: "anita@example.com",
    group: "Family",
    favorite: false,
  },
  {
    id: 3,
    name: "Rahul",
    phone: "+91-9876543212",
    email: "rahul@workmail.com",
    group: "Work",
    favorite: false,
  },
];

function validateContact(data, requireNameAndPhone = true) {
  const errors = [];
  const name = typeof data.name === "string" ? data.name.trim() : data.name;
  const phone = typeof data.phone === "string" ? data.phone.trim() : data.phone;

  if (requireNameAndPhone && (!name || typeof name !== "string")) {
    errors.push("name is required");
  }
  if (requireNameAndPhone && (!phone || typeof phone !== "string")) {
    errors.push("phone is required");
  }
  if (phone && (phone.match(/\d/g) || []).length < 10) {
    errors.push("phone must contain at least 10 digits");
  }
  if (
    data.email !== undefined &&
    data.email !== "" &&
    (typeof data.email !== "string" || !data.email.includes("@"))
  ) {
    errors.push("email must contain @");
  }
  if (data.group !== undefined && !allowedGroups.includes(data.group)) {
    errors.push(`group must be one of: ${allowedGroups.join(", ")}`);
  }
  if (data.favorite !== undefined && typeof data.favorite !== "boolean") {
    errors.push("favorite must be a boolean");
  }

  return { errors, name, phone };
}

function findContact(id) {
  return contacts.find((contact) => contact.id === Number(id));
}

function invalidId(id) {
  return !Number.isInteger(Number(id)) || Number(id) < 1;
}

app.get("/contacts/search", (req, res) => {
  const query =
    typeof req.query.q === "string" ? req.query.q.trim().toLowerCase() : "";

  if (!query) {
    return res.status(400).json({ error: "search query q is required" });
  }

  const results = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(query) ||
      (contact.email || "").toLowerCase().includes(query),
  );
  return res.json(results);
});

app.get("/contacts/favorites", (req, res) => {
  res.json(contacts.filter((contact) => contact.favorite));
});

app.get("/contacts", (req, res) => {
  let results = contacts;
  if (req.query.group) {
    results = results.filter((contact) => contact.group === req.query.group);
  }

  if (req.query.page !== undefined || req.query.limit !== undefined) {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 5);
    if (
      !Number.isInteger(page) ||
      page < 1 ||
      !Number.isInteger(limit) ||
      limit < 1
    ) {
      return res
        .status(400)
        .json({ error: "page and limit must be positive integers" });
    }
    const start = (page - 1) * limit;
    return res.json({
      contacts: results.slice(start, start + limit),
      page,
      limit,
      total: results.length,
    });
  }

  res.json(results);
});

app.get("/contacts/:id", (req, res) => {
  if (invalidId(req.params.id)) {
    return res.status(404).json({ error: "contact not found" });
  }
  const contact = findContact(req.params.id);
  if (!contact) {
    return res.status(404).json({ error: "contact not found" });
  }
  res.json(contact);
});

app.post("/contacts", (req, res) => {
  const validation = validateContact(req.body);
  if (validation.errors.length) {
    return res.status(400).json({ errors: validation.errors });
  }

  const contact = {
    id: nextId++,
    name: validation.name,
    phone: validation.phone,
    email: req.body.email || "",
    group: req.body.group || "Other",
    favorite: req.body.favorite || false,
  };
  contacts.push(contact);
  res.status(201).json(contact);
});

function updateContact(req, res, partial) {
  if (invalidId(req.params.id)) {
    return res.status(404).json({ error: "contact not found" });
  }
  const contact = findContact(req.params.id);
  if (!contact) {
    return res.status(404).json({ error: "contact not found" });
  }

  const data = partial ? { ...contact, ...req.body } : req.body;
  const validation = validateContact(data);
  if (validation.errors.length) {
    return res.status(400).json({ errors: validation.errors });
  }

  contact.name = validation.name;
  contact.phone = validation.phone;
  contact.email = data.email || "";
  contact.group = data.group || "Other";
  contact.favorite = data.favorite || false;
  res.json(contact);
}

app.put("/contacts/:id", (req, res) => updateContact(req, res, false));
app.patch("/contacts/:id", (req, res) => updateContact(req, res, true));

app.delete("/contacts/:id", (req, res) => {
  if (invalidId(req.params.id)) {
    return res.status(404).json({ error: "contact not found" });
  }
  const index = contacts.findIndex(
    (contact) => contact.id === Number(req.params.id),
  );
  if (index === -1) {
    return res.status(404).json({ error: "contact not found" });
  }
  const deletedContact = contacts.splice(index, 1)[0];
  res.json({ message: "contact deleted", contact: deletedContact });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Contact Book API running at http://localhost:${PORT}`);
  });
}

module.exports = app;
