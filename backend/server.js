const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// --------------------------- Middlewares ---------------------------
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// --------------------------- Paths ---------------------------
const menuFilePath = path.join(__dirname, "data", "menu.json");
const branchesFilePath = path.join(__dirname, "data", "branches.json");
const ordersFilePath = path.join(__dirname, "data", "orders.json");

// --------------------------- Helper Functions ---------------------------
const readData = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading file from path: ${filePath}`, error);
    return [];
  }
};

const writeData = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
  } catch (error) {
    console.error(`Error writing file to path: ${filePath}`, error);
  }
};

// --------------------------- API Endpoints ---------------------------

// --------------------------- 1. Client-facing API ---------------------------
// Bring the full menu
app.get("/api/menu", (req, res) => {
  const menu = readData(menuFilePath);
  res.json(menu);
});

// Get a list of branches
app.get("/api/branches", (req, res) => {
  const branches = readData(branchesFilePath);
  res.json(branches);
});

// Save a new request
app.post("/api/orders", (req, res) => {
  try {
    const orders = readData(ordersFilePath);
    const newOrder = {
      orderId: Date.now(),
      orderDate: new Date().toISOString(),
      ...req.body,
    };
    orders.push(newOrder);
    writeData(ordersFilePath, orders);
    console.log("Order saved:", newOrder.orderId);
    res.status(201).json({
      message: "Order received and saved successfully!",
      order: newOrder,
    });
  } catch (error) {
    console.error("Failed to save order:", error);
    res.status(500).json({ message: "Error saving the order." });
  }
});

// --------------------------- 2. Admin-facing API (CRUD Operations) ---------------------------

// --------------------------- Menu CRUD ---------------------------
// Add a new item to the list
app.post("/api/admin/menu", (req, res) => {
  const menu = readData(menuFilePath);
  const newItem = { id: Date.now(), ...req.body };
  menu.push(newItem);
  writeData(menuFilePath, menu);
  res.status(201).json(newItem);
});

// Edit an existing item in the list
app.put("/api/admin/menu/:id", (req, res) => {
  const menu = readData(menuFilePath);
  const itemIndex = menu.findIndex(
    (item) => item.id === parseInt(req.params.id)
  );
  if (itemIndex === -1) {
    return res.status(404).json({ message: "Item not found" });
  }
  menu[itemIndex] = { ...menu[itemIndex], ...req.body };
  writeData(menuFilePath, menu);
  res.json(menu[itemIndex]);
});

// Delete an item from the list
app.delete("/api/admin/menu/:id", (req, res) => {
  let menu = readData(menuFilePath);
  const updatedMenu = menu.filter(
    (item) => item.id !== parseInt(req.params.id)
  );
  if (menu.length === updatedMenu.length) {
    return res.status(404).json({ message: "Item not found" });
  }
  writeData(menuFilePath, updatedMenu);
  res.status(200).json({ message: "Item deleted successfully" });
});

// --------------------------- Branches CRUD ---------------------------

// Add a new branch
app.post("/api/admin/branches", (req, res) => {
  const branches = readData(branchesFilePath);
  const newBranch = { id: Date.now(), ...req.body };
  branches.push(newBranch);
  writeData(branchesFilePath, branches);
  res.status(201).json(newBranch);
});

// Edit branch data
app.put("/api/admin/branches/:id", (req, res) => {
  const branches = readData(branchesFilePath);
  const branchIndex = branches.findIndex(
    (b) => b.id === parseInt(req.params.id)
  );
  if (branchIndex === -1) {
    return res.status(404).json({ message: "Branch not found" });
  }
  branches[branchIndex] = { ...branches[branchIndex], ...req.body };
  writeData(branchesFilePath, branches);
  res.json(branches[branchIndex]);
});

// Delete branch
app.delete("/api/admin/branches/:id", (req, res) => {
  let branches = readData(branchesFilePath);
  const updatedBranches = branches.filter(
    (b) => b.id !== parseInt(req.params.id)
  );
  if (branches.length === updatedBranches.length) {
    return res.status(404).json({ message: "Branch not found" });
  }
  writeData(branchesFilePath, updatedBranches);
  res.status(200).json({ message: "Branch deleted successfully" });
});

// --------------------------- Server Operation ---------------------------
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
