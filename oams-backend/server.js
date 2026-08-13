/* =========================================================================
 * OAMS Field App — DEMO BACKEND (dummy database via db.json)
 *
 * Run:   cd oams-backend  ->  npm install  ->  npm start
 * Open:  http://localhost:4000   (app is served here, already connected)
 * Login: EMP1024 / 1234   (see db.json)
 * ========================================================================= */
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { buildPptxBase64 } = require("./report");

const app = express();
app.use(cors());
app.use(express.json({ limit: "60mb" })); // photos are sent as base64

const DB_FILE = path.join(__dirname, "db.json");
function loadDB() { return JSON.parse(fs.readFileSync(DB_FILE, "utf8")); }
function saveDB(db) { fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2)); }

app.use("/api", (req, _res, next) => { console.log(`[api] ${req.method} ${req.url}`); next(); });

// ---- POST /api/login ----
app.post("/api/login", (req, res) => {
  const { empCode, password } = req.body || {};
  const db = loadDB();
  const user = db.users.find((u) => String(u.empCode).toLowerCase() === String(empCode || "").toLowerCase());
  if (!user || user.password !== password) return res.status(401).json({ error: "Invalid Employee Code or Password" });
  res.json({ token: "demo-token-" + user.empCode, name: user.name, mode: user.mode });
});

// ---- GET /api/master ----  (element types + surfaces)
app.get("/api/master", (_req, res) => {
  const db = loadDB();
  res.json({ elementTypes: db.elementTypes || [], surfaces: db.surfaces || [] });
});

// ---- GET /api/stores ----
app.get("/api/stores", (_req, res) => {
  const db = loadDB();
  res.json(db.stores || []);
});

// ---- POST /api/recce/save ----  (metadata only; images stay on device/PPT)
app.post("/api/recce/save", (req, res) => {
  const db = loadDB();
  db.submissions = db.submissions || [];
  db.submissions.push(Object.assign({ savedAt: new Date().toISOString() }, req.body || {}));
  saveDB(db);
  res.json({ ok: true, totalSubmissions: db.submissions.length });
});

// ---- GET /api/reports ----
app.get("/api/reports", (_req, res) => {
  const db = loadDB();
  res.json(db.submissions || []);
});

// ---- POST /api/report ----  build a .pptx from { store, work }, return base64
app.post("/api/report", async (req, res) => {
  try {
    const { store, work } = req.body || {};
    if (!work) return res.status(400).json({ error: "No recce data to report" });
    const base64 = await buildPptxBase64(store || {}, work);
    const name = (store && store.storeCode) ? store.storeCode : "store";
    res.json({ fileName: "OAMS_Recce_" + name + "_" + Date.now() + ".pptx", base64 });
  } catch (e) {
    console.error("report error:", e);
    res.status(500).json({ error: "Failed to build report" });
  }
});

// ---- serve the (Capacitor) web app too, if present ----
app.use("/", express.static(path.join(__dirname, "..", "oams-mobile", "www")));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log("──────────────────────────────────────────────");
  console.log(" OAMS demo backend running on http://localhost:" + PORT);
  console.log(" Login: EMP1024 / 1234   (edit oams-backend/db.json)");
  console.log("──────────────────────────────────────────────");
});
