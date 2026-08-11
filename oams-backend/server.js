/* =========================================================================
 * OAMS Field App — DEMO BACKEND
 * -------------------------------------------------------------------------
 * A tiny Express server that uses db.json as a "dummy database".
 * No MySQL / no cloud setup needed — great for testing and for showing the
 * app talking to a real backend.
 *
 * Run:   cd oams-backend  ->  npm install  ->  npm start
 * Then open  http://localhost:4000  in a browser: the app is served AND
 * connected to this backend automatically.
 *
 * To make the *installed APK* use it, host this server somewhere public,
 * put that URL in oams-mobile/www/js/config.js (API_BASE), and rebuild.
 * ========================================================================= */
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { buildPptxBase64 } = require("./report");

const app = express();
app.use(cors());
app.use(express.json({ limit: "20mb" }));

const DB_FILE = path.join(__dirname, "db.json");
function loadDB() { return JSON.parse(fs.readFileSync(DB_FILE, "utf8")); }
function saveDB(db) { fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2)); }

// simple request log so you can watch the app talk to the DB
app.use("/api", (req, _res, next) => {
  console.log(`[api] ${req.method} ${req.url}`);
  next();
});

// ---- POST /api/login ----
app.post("/api/login", (req, res) => {
  const { empCode, password } = req.body || {};
  const db = loadDB();
  const user = db.users.find(
    (u) => String(u.empCode).toLowerCase() === String(empCode || "").toLowerCase()
  );
  if (!user || user.password !== password) {
    return res.status(401).json({ error: "Invalid Employee Code or Password" });
  }
  res.json({ token: "demo-token-" + user.empCode, name: user.name, mode: user.mode });
});

// ---- GET /api/master ----  (materials + locations)
app.get("/api/master", (_req, res) => {
  const db = loadDB();
  res.json({ materials: db.materials, locations: db.locations });
});

// ---- GET /api/tickets?module=recce ----
app.get("/api/tickets", (req, res) => {
  const module = req.query.module || "recce";
  const db = loadDB();
  const submitted = new Set((db.submissions || []).map((s) => s.ticketNo));
  const list = (db.tickets[module] || []).filter((t) => !submitted.has(t.ticketNo));
  res.json(list);
});

// ---- POST /api/recce/:ticketNo/save ----
app.post("/api/recce/:ticketNo/save", (req, res) => {
  const db = loadDB();
  db.submissions = db.submissions || [];
  db.submissions.push({
    ticketNo: req.params.ticketNo,
    module: req.body.module || null,
    items: req.body.items || [],
    remarks: req.body.remarks || "",
    photoAddress: req.body.photoAddress || "",
    coords: req.body.coords || null,
    hasPhoto: !!req.body.hasPhoto,
    savedAt: new Date().toISOString()
  });
  saveDB(db);
  res.json({ ok: true, totalSubmissions: db.submissions.length });
});

// ---- GET /api/reports ----  (everything saved so far)
app.get("/api/reports", (_req, res) => {
  const db = loadDB();
  res.json(db.submissions || []);
});

// ---- POST /api/report ----  build a .pptx from posted entries, return base64
// body: { module, entries: [ { ticket, work } ] }
app.post("/api/report", async (req, res) => {
  try {
    const module = (req.body && req.body.module) || "Recce";
    const entries = (req.body && req.body.entries) || [];
    if (!entries.length) return res.status(400).json({ error: "No entries to report" });
    const base64 = await buildPptxBase64(module, entries);
    res.json({ fileName: "OAMS_Report_" + module + "_" + Date.now() + ".pptx", base64: base64 });
  } catch (e) {
    console.error("report error:", e);
    res.status(500).json({ error: "Failed to build report" });
  }
});

// ---- serve the app itself so http://localhost:4000 is a connected app ----
app.use("/", express.static(path.join(__dirname, "..", "oams-mobile", "www")));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log("──────────────────────────────────────────────");
  console.log(" OAMS demo backend + app running");
  console.log(" Open:  http://localhost:" + PORT);
  console.log(" Login: EMP1024 / 1234   (see oams-backend/db.json)");
  console.log("──────────────────────────────────────────────");
});
