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

const menuFilePath = path.join(__dirname, "data", "menu.json");
const branchesFilePath = path.join(__dirname, "data", "branches.json");
const ordersFilePath = path.join(__dirname, "data", "orders.json");

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

//--------------------------- Client-facing ---------------------------
// 1. Bring the menu
app.get("/api/menu", (req, res) => {
  const menu = readData(menuFilePath);
  res.json(menu);
});

// 2.  Bring branches
app.get("/api/branches", (req, res) => {
  const branches = readData(branchesFilePath);
  res.json(branches);
});

// 3. Save a new request
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
    res
      .status(201)
      .json({
        message: "Order received and saved successfully!",
        order: newOrder,
      });
  } catch (error) {
    console.error("Failed to save order:", error);
    res.status(500).json({ message: "Error saving the order." });
  }
});

// --------------------------- Server operation ---------------------------
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
