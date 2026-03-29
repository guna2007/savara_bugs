const express = require("express");
const cors = require("cors");
const crypto = require("crypto");

const app = express();
app.use(cors());
app.use(express.json());

let USERS = [{ username: "user", password: "1234" }];
const ADMIN = { username: "admin", password: "1234" };

let products = [
  { id: 1, name: "MacBook Pro", price: 150000 },
  { id: 2, name: "iPhone", price: 80000 },
  { id: 3, name: "AirPods", price: 20000 },
  { id: 4, name: "iPad Air", price: 62000 },
  { id: 5, name: "Apple Watch", price: 35000 },
  { id: 6, name: "Sony WH-1000XM5", price: 28000 },
  { id: 7, name: "Logitech MX Master 3S", price: 10500 },
  { id: 8, name: "Samsung 27in 4K Monitor", price: 29000 },
  { id: 9, name: "Kindle Paperwhite", price: 14000 },
  { id: 10, name: "Mechanical Keyboard", price: 6500 },
];

let orders = [];
const adminSessions = new Set();

function requireAdmin(req, res, next) {
  const token = req.headers["x-admin-token"];
  if (!token || !adminSessions.has(token)) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  next();
}

/* REGISTER */
app.post("/api/user/register", (req, res) => {
  const { username, password } = req.body;
  const cleanUsername = typeof username === "string" ? username.trim() : "";
  const cleanPassword = typeof password === "string" ? password : "";

  if (cleanUsername.length < 3 || cleanPassword.length < 4) {
    return res.json({ success: false, message: "Invalid input" });
  }

  const exists = USERS.some(
    (u) => u.username.toLowerCase() === cleanUsername.toLowerCase(),
  );
  if (exists) {
    return res.json({ success: false, message: "Username already exists" });
  }

  USERS.push({ username: cleanUsername, password: cleanPassword });
  res.json({ success: true });
});

/* LOGIN */
app.post("/api/user/login", (req, res) => {
  const user = USERS.find(
    (u) => u.username === req.body.username && u.password === req.body.password,
  );
  res.json({ success: !!user });
});

/* ADMIN */
app.post("/api/admin/login", (req, res) => {
  const isValid =
    req.body.username === ADMIN.username &&
    req.body.password === ADMIN.password;

  if (!isValid) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials" });
  }

  const token = crypto.randomBytes(24).toString("hex");
  adminSessions.add(token);
  res.json({ success: true, token });
});

/* PRODUCTS */
app.get("/api/products", (req, res) => res.json(products));

app.post("/api/products", requireAdmin, (req, res) => {
  const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
  const price = Number(req.body.price);

  if (!name || !Number.isFinite(price) || price <= 0) {
    return res.json({ success: false, message: "Invalid product data" });
  }

  products.push({ id: Date.now(), name, price });
  res.json({ success: true });
});

app.delete("/api/products/:id", requireAdmin, (req, res) => {
  const id = parseInt(req.params.id);
  products = products.filter((p) => p.id !== id);
  res.json({ success: true });
});

/* ORDERS */
app.post("/api/orders", (req, res) => {
  const items = Array.isArray(req.body.items) ? req.body.items : [];
  const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
  const card = typeof req.body.card === "string" ? req.body.card : "";
  const last4 = card.replace(/\D/g, "").slice(-4);

  if (!name || !items.length || !last4) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid order data" });
  }

  orders.push({
    items,
    name,
    cardLast4: last4,
    createdAt: Date.now(),
  });
  res.json({ success: true });
});

app.get("/api/orders", requireAdmin, (req, res) => res.json(orders));

app.post("/api/admin/logout", requireAdmin, (req, res) => {
  const token = req.headers["x-admin-token"];
  adminSessions.delete(token);
  res.json({ success: true });
});

app.listen(5000, () => console.log("Server running on 5000"));
