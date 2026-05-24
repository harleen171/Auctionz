const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

router.use((req, res, next) => {
  console.log("storeRoutes:", req.method, req.originalUrl);
  next();
});

const dataDir = path.join(__dirname, "data");
const cartPath = path.join(dataDir, "cart.json");
const ordersPath = path.join(dataDir, "orders.json");

function readJsonFile(filePath, fallback) {
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    if (!raw.trim()) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    if (e.code === "ENOENT") return fallback;
    throw e;
  }
}

function writeJsonFile(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}

function normalizeCartPayload(parsed) {
  if (Array.isArray(parsed)) return parsed;
  if (parsed && Array.isArray(parsed.cart)) return parsed.cart;
  return [];
}

function readCart() {
  return normalizeCartPayload(readJsonFile(cartPath, []));
}

function writeCart(cart) {
  writeJsonFile(cartPath, cart);
}

const demoItems = [
  { id: 1, name: "Apple iPhone 16 PRO MAX", price: 144900 },
  { id: 2, name: "Dell Alienware x16", price: 442990 },
  { id: 3, name: "Samsung Galaxy Buds 2", price: 13990 },
];

router.get("/items", (req, res) => {
  res.json({ items: demoItems });
});

router.get("/items/:id", (req, res) => {
  const id = Number(req.params.id);
  const item = demoItems.find((it) => it.id === id);
  if (!item) {
    return res.status(404).json({ message: "Item not found" });
  }
  res.json({ item });
});

router.post("/login", (req, res) => {
  const { email } = req.body;
  res.json({
    message: "Login data received (demo only)",
    email,
  });
});

router.post("/signup", (req, res) => {
  const { name, email } = req.body;
  res.status(201).json({
    message: "Signup data received (demo only)",
    user: { name, email },
  });
});

router.get("/cart", (req, res) => {
  try {
    const cart = readCart();
    res.json({ cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not read cart", cart: [] });
  }
});

router.post("/cart", (req, res) => {
  const item = req.body;
  if (!item || !item.id) {
    return res.status(400).json({ error: "id is required", cart: readCart() });
  }

  try {
    const cart = readCart();
    const addQty = Number(item.quantity) > 0 ? Number(item.quantity) : 1;
    const idx = cart.findIndex((c) => c.id === item.id);
    if (idx >= 0) {
      cart[idx].quantity = (Number(cart[idx].quantity) || 1) + addQty;
    } else {
      cart.push({
        id: item.id,
        name: item.name || "Item",
        price: Number(item.price) || 0,
        quantity: addQty,
      });
    }
    writeCart(cart);
    res.json({ message: "Item added", cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not update cart", cart: [] });
  }
});

router.delete("/cart/:id", (req, res) => {
  const id = req.params.id;
  try {
    let cart = readCart();
    cart = cart.filter((row) => String(row.id) !== String(id));
    writeCart(cart);
    res.json({ message: "Item removed", cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not update cart" });
  }
});

const bids = {};

router.post("/bid", (req, res, next) => {
  const { product, amount } = req.body;
  if (!product || !amount) {
    const err = new Error("product and amount are required");
    err.status = 400;
    return next(err);
  }
  bids[product] = amount;
  res.json({
    message: "Bid placed",
    product,
    amount,
  });
});

router.post("/checkout", (req, res) => {
  const {
    fullName,
    email,
    phone,
    addressLine1,
    city,
    state,
    pin,
    paymentMethod,
  } = req.body || {};

  if (!fullName || !email || !phone || !addressLine1 || !city || !state || !pin) {
    return res.status(400).json({
      success: false,
      error: "Missing shipping fields",
    });
  }

  try {
    const cart = readCart();
    if (!cart.length) {
      return res.status(400).json({
        success: false,
        error: "Cart is empty",
        cart: [],
      });
    }

    let total = 0;
    cart.forEach((row) => {
      const qty = Number(row.quantity) || 1;
      total += qty * (Number(row.price) || 0);
    });

    const rawOrders = readJsonFile(ordersPath, []);
    const orderList = Array.isArray(rawOrders) ? rawOrders : [];
    const order = {
      id: `ORD-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: "confirmed",
      paymentMethod: paymentMethod || "demo",
      shipping: {
        fullName,
        email,
        phone,
        addressLine1,
        city,
        state,
        pin,
      },
      items: cart.map((c) => ({
        id: c.id,
        name: c.name,
        price: c.price,
        quantity: Number(c.quantity) || 1,
      })),
      total,
    };

    writeJsonFile(ordersPath, [...orderList, order]);
    writeCart([]);

    res.json({
      success: true,
      orderId: order.id,
      total,
      message: "Order placed successfully (demo — no real payment)",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Checkout failed" });
  }
});

module.exports = router;
