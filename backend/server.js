const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const cors = require('cors');
const app = express();
app.use(cors()); 
const PORT = 3000;

// --------------------------- Middlewares ---------------------------
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// --------------------------- Paths ---------------------------
const dataDir = path.join(__dirname, "data");
const menuFilePath = path.join(dataDir, "menu.json");
const branchesFilePath = path.join(dataDir, "branches.json");
const ordersFilePath = path.join(dataDir, "orders.json");
const legalFilePath = path.join(dataDir, "legal.json");

// --------------------------- Helper Functions ---------------------------
const readData = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (e) {
    console.error("read error", filePath, e);
    return null; 
  }
};
const writeData = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
  } catch (e) {
    console.error("write error", filePath, e);
  }
};
const normalizeLang = (l) => (l === "en" ? "en" : "ar");

const pickLocalized = (obj, lang, base, legacy = base) => {
  const key = `${base}_${lang}`;
  if (typeof obj[key] === "string" && obj[key].trim()) return obj[key];
  if (typeof obj[legacy] === "string" && obj[legacy].trim()) return obj[legacy];
  return "";
};

const categoryMap = {
  الكشري: { ar: "الكشري", en: "Koshary" },
  الإضافات: { ar: "الإضافات", en: "Add-ons" },
  المشروبات: { ar: "المشروبات", en: "Drinks" },
  الحلويات: { ar: "الحلويات", en: "Desserts" },
};

const mapMenuItem = (item, lang) => ({
  id: item.id,
  name: pickLocalized(item, lang, "name"),
  details: pickLocalized(item, lang, "details"),
  price: item.price,
  image: item.image,
  category: item.category,
  categoryLabel:
    (categoryMap[item.category] && categoryMap[item.category][lang]) ||
    item.category,
});

const mapBranch = (branch, lang) => ({
  id: branch.id,
  name: pickLocalized(branch, lang, "name"),
  address: pickLocalized(branch, lang, "address"),
});

// --------------------------- API Endpoints ---------------------------

// --------------------------- 1. Client-facing API ---------------------------
// Bring the full menu
app.get("/api/menu", (req, res) => {
  const lang = normalizeLang(req.query.lang);
  const menu = readData(menuFilePath);
  const localized = Array.isArray(menu)
    ? menu.map((m) => mapMenuItem(m, lang))
    : [];
  res.json(localized);
});

// Get a list of branches
app.get("/api/branches", (req, res) => {
  const lang = normalizeLang(req.query.lang);
  const branches = readData(branchesFilePath);
  const localized = Array.isArray(branches)
    ? branches.map((b) => mapBranch(b, lang))
    : [];
  res.json(localized);
});

// Save a new request
app.post("/api/orders", (req, res) => {
  try {
    const lang = normalizeLang(req.query.lang || req.body?.lang);
    const menu = readData(menuFilePath);
    const branches = readData(branchesFilePath);

    const menuById = new Map(menu.map((m) => [m.id, m]));
    const branchesByName = new Map(branches.map((b) => [b.name, b]));

    const body = req.body || {};
    const originalItems = Array.isArray(body.cartItems) ? body.cartItems : [];

    const localizedCartItems = originalItems.map((ci) => {
      const src = menuById.get(ci.id);
      return {
        ...ci,
        name: src ? pickLocalized(src, lang, "name") : ci.name,
        details: src ? pickLocalized(src, lang, "details") : ci.details || "",
      };
    });

    const branchSrc = body.userInfo?.branch
      ? branchesByName.get(body.userInfo.branch)
      : null;
    const localizedBranchName = branchSrc
      ? pickLocalized(branchSrc, lang, "name")
      : body.userInfo?.branch || "";

    const orders = readData(ordersFilePath);
    const newOrder = {
      orderId: Date.now(),
      orderDate: new Date().toISOString(),
      lang,
      userInfo: body.userInfo,
      cartItems: originalItems,
      localizedCartItems,
      localizedBranchName,
      totalPrice: body.totalPrice,
    };

    orders.push(newOrder);
    writeData(ordersFilePath, orders);

    const successMsg =
      lang === "en"
        ? "Order received and saved successfully!"
        : "تم استلام الطلب وحفظه بنجاح!";

    res.status(201).json({ message: successMsg, order: newOrder });
  } catch (error) {
    console.error("Failed to save order:", error);
    res.status(500).json({ message: "Error saving the order." });
  }
});

app.get("/api/legal/:pageKey", (req, res) => {
  const { pageKey } = req.params;
  const lang = normalizeLang(req.query.lang);
  const legalData = readData(legalFilePath);

  if (!legalData || !legalData[pageKey]) {
    return res.status(404).json({ message: "Page not found" });
  }

  const pageContent = legalData[pageKey];
  const localizedData = {
    title: pickLocalized(pageContent, lang, "title"),
    content: pickLocalized(pageContent, lang, "content"),
  };

  res.json(localizedData);
});

// --------------------------- 2. Admin-facing API (CRUD Operations) ---------------------------

// --------------------------- Menu CRUD ---------------------------
// Add a new item to the list
app.post("/api/admin/menu", (req, res) => {
  const menu = readData(menuFilePath);
  const body = req.body || {};
  const newItem = {
    id: Date.now(),
    name_ar: body.name_ar || body.name || "",
    name_en: body.name_en || "",
    details_ar: body.details_ar || body.details || "",
    details_en: body.details_en || "",
    price: body.price,
    image: body.image,
    category: body.category,
  };
  if (!body.name && newItem.name_ar) newItem.name = newItem.name_ar;
  if (!body.details && newItem.details_ar) newItem.details = newItem.details_ar;
  menu.push(newItem);
  writeData(menuFilePath, menu);
  res.status(201).json(newItem);
});

// Edit an existing item in the list
app.put("/api/admin/menu/:id", (req, res) => {
  const menu = readData(menuFilePath);
  const idx = menu.findIndex((i) => i.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ message: "Item not found" });
  const ex = menu[idx],
    b = req.body || {};
  const up = {
    ...ex,
    name_ar: b.name_ar ?? ex.name_ar,
    name_en: b.name_en ?? ex.name_en,
    details_ar: b.details_ar ?? ex.details_ar,
    details_en: b.details_en ?? ex.details_en,
    price: b.price ?? ex.price,
    image: b.image ?? ex.image,
    category: b.category ?? ex.category,
  };
  if (b.name !== undefined) up.name = b.name;
  if (b.details !== undefined) up.details = b.details;
  if (!up.name && up.name_ar) up.name = up.name_ar;
  if (!up.details && up.details_ar) up.details = up.details_ar;
  menu[idx] = up;
  writeData(menuFilePath, menu);
  res.json(menu[idx]);
});

// Delete an item from the list
app.delete("/api/admin/menu/:id", (req, res) => {
  const menu = readData(menuFilePath);
  const updated = menu.filter((i) => i.id !== parseInt(req.params.id));
  if (updated.length === menu.length)
    return res.status(404).json({ message: "Item not found" });
  writeData(menuFilePath, updated);
  res.json({ message: "Item deleted successfully" });
});

// --------------------------- Branches CRUD ---------------------------

// Add a new branch
app.post("/api/admin/branches", (req, res) => {
  const branches = readData(branchesFilePath);
  const b = req.body || {};
  const newB = {
    id: Date.now(),
    name_ar: b.name_ar || b.name || "",
    name_en: b.name_en || "",
    address_ar: b.address_ar || b.address || "",
    address_en: b.address_en || "",
  };
  if (!b.name && newB.name_ar) newB.name = newB.name_ar;
  if (!b.address && newB.address_ar) newB.address = newB.address_ar;
  branches.push(newB);
  writeData(branchesFilePath, branches);
  res.status(201).json(newB);
});

// Edit branch data
app.put("/api/admin/branches/:id", (req, res) => {
  const branches = readData(branchesFilePath);
  const idx = branches.findIndex((i) => i.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ message: "Branch not found" });
  const ex = branches[idx],
    b = req.body || {};
  const up = {
    ...ex,
    name_ar: b.name_ar ?? ex.name_ar,
    name_en: b.name_en ?? ex.name_en,
    address_ar: b.address_ar ?? ex.address_ar,
    address_en: b.address_en ?? ex.address_en,
  };
  if (b.name !== undefined) up.name = b.name;
  if (b.address !== undefined) up.address = b.address;
  if (!up.name && up.name_ar) up.name = up.name_ar;
  if (!up.address && up.address_ar) up.address = up.address_ar;
  branches[idx] = up;
  writeData(branchesFilePath, branches);
  res.json(branches[idx]);
});

// Delete branch
app.delete("/api/admin/branches/:id", (req, res) => {
  const branches = readData(branchesFilePath);
  const updated = branches.filter((i) => i.id !== parseInt(req.params.id));
  if (updated.length === branches.length)
    return res.status(404).json({ message: "Branch not found" });
  writeData(branchesFilePath, updated);
  res.json({ message: "Branch deleted successfully" });
});

// --------------------------- Server Operation ---------------------------
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
