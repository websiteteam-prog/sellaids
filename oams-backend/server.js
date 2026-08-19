/* =========================================================================
 * OAMS Field App — BACKEND + ADMIN PANEL (dummy database via db.json)
 *
 * Run:   cd oams-backend  ->  npm install  ->  npm start
 * User API:  http://localhost:4000/api/...
 * Admin panel (web): http://localhost:4000/admin      (login: admin / admin)
 * User login (app):  EMP1024 / 1234                    (see db.json)
 * ========================================================================= */
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { buildPptxBuffer } = require("./report");

const app = express();
app.use(cors());
app.use(express.json({ limit: "80mb" })); // photos are sent as base64

const DB_FILE = path.join(__dirname, "db.json");
const REPORTS_DIR = path.join(__dirname, "reports");
if (!fs.existsSync(REPORTS_DIR)) fs.mkdirSync(REPORTS_DIR, { recursive: true });

function loadDB() { return JSON.parse(fs.readFileSync(DB_FILE, "utf8")); }
function saveDB(db) { fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2)); }

app.use("/api", (req, _res, next) => { console.log(`[api] ${req.method} ${req.url}`); next(); });

/* =========================== USER API =========================== */

app.post("/api/login", (req, res) => {
  const { empCode, password } = req.body || {};
  const db = loadDB();
  const user = (db.users || []).find((u) => String(u.empCode).toLowerCase() === String(empCode || "").toLowerCase());
  if (!user || user.password !== password) return res.status(401).json({ error: "Invalid Employee Code or Password" });
  res.json({ token: "user-token-" + user.empCode, name: user.name, empCode: user.empCode, mode: user.mode });
});

app.get("/api/master", (_req, res) => {
  const db = loadDB();
  res.json({ elementTypes: db.elementTypes || [] });
});

// stores whose recce is NOT yet done
app.get("/api/stores", (_req, res) => {
  const db = loadDB();
  const done = new Set((db.submissions || []).map((s) => s.storeCode));
  res.json((db.stores || []).filter((s) => !done.has(s.storeCode)));
});

// submit a completed recce -> save metadata, generate + store the PPT, mark store done
app.post("/api/recce/submit", async (req, res) => {
  try {
    const { store, user, work } = req.body || {};
    if (!store || !work) return res.status(400).json({ error: "Missing store or work" });
    const db = loadDB();
    const id = "REC-" + Date.now();
    const submittedAt = new Date().toISOString();

    // build + save the PPT (photos live inside the file, keeping db.json lean)
    const buf = await buildPptxBuffer(store, work, {
      userName: user && user.name, userEmpCode: user && user.empCode, submittedAt
    });
    const pptFile = id + ".pptx";
    fs.writeFileSync(path.join(REPORTS_DIR, pptFile), buf);

    db.submissions = db.submissions || [];
    db.submissions.push({
      id,
      storeCode: store.storeCode, storeName: store.storeName, city: store.city, category: store.category,
      userEmpCode: user && user.empCode, userName: user && user.name,
      storePhotoCount: (work.storeImages || []).length,
      storeRemark: work.storeRemark || "",
      finalRemark: work.finalRemark || "",
      elements: (work.elements || []).map((e) => ({
        type: e.type, width: e.width, height: e.height, total: e.total,
        photoCount: (e.photos || []).length, remark: e.remark
      })),
      elementsCount: (work.elements || []).length,
      pptFile,
      submittedAt
    });
    saveDB(db);
    res.json({ ok: true, id });
  } catch (e) {
    console.error("submit error:", e);
    res.status(500).json({ error: "Failed to submit recce" });
  }
});

/* =========================== ADMIN API =========================== */

function adminOk(req) {
  const t = req.headers["x-admin-token"] || "";
  return typeof t === "string" && t.indexOf("admin-token-") === 0;
}
function requireAdmin(req, res, next) {
  if (!adminOk(req)) return res.status(401).json({ error: "Admin auth required" });
  next();
}

app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body || {};
  const db = loadDB();
  const admin = (db.admins || []).find((a) => String(a.username).toLowerCase() === String(username || "").toLowerCase());
  if (!admin || admin.password !== password) return res.status(401).json({ error: "Invalid admin credentials" });
  res.json({ token: "admin-token-" + admin.username, name: admin.name });
});

// completed recces with filters: q, user, city, category, from, to
app.get("/api/admin/recces", requireAdmin, (req, res) => {
  const db = loadDB();
  let list = (db.submissions || []).slice().reverse();
  const { q, user, city, category, from, to } = req.query;
  if (q) { const s = String(q).toLowerCase(); list = list.filter((r) => (r.storeName + " " + r.storeCode).toLowerCase().includes(s)); }
  if (user) list = list.filter((r) => r.userEmpCode === user);
  if (city) list = list.filter((r) => r.city === city);
  if (category) list = list.filter((r) => r.category === category);
  if (from) list = list.filter((r) => new Date(r.submittedAt) >= new Date(from));
  if (to) list = list.filter((r) => new Date(r.submittedAt) <= new Date(to + "T23:59:59"));
  res.json(list);
});

// distinct values for filter dropdowns
app.get("/api/admin/filters", requireAdmin, (_req, res) => {
  const db = loadDB();
  const subs = db.submissions || [];
  const uniq = (arr) => Array.from(new Set(arr.filter(Boolean)));
  res.json({
    cities: uniq(subs.map((s) => s.city)),
    categories: uniq(subs.map((s) => s.category)),
    users: uniq(subs.map((s) => (s.userEmpCode ? s.userEmpCode + " · " + (s.userName || "") : ""))).map((u) => {
      const code = u.split(" · ")[0]; const name = u.split(" · ")[1] || "";
      return { empCode: code, name };
    })
  });
});

app.get("/api/admin/recces/:id/ppt", (req, res) => {
  // allow token via header OR ?t= (so a browser link can download it)
  const t = req.headers["x-admin-token"] || req.query.t || "";
  if (String(t).indexOf("admin-token-") !== 0) return res.status(401).send("Admin auth required");
  const db = loadDB();
  const rec = (db.submissions || []).find((r) => r.id === req.params.id);
  if (!rec) return res.status(404).send("Not found");
  const file = path.join(REPORTS_DIR, rec.pptFile);
  if (!fs.existsSync(file)) return res.status(404).send("Report file missing");
  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.presentationml.presentation");
  res.setHeader("Content-Disposition", 'attachment; filename="' + (rec.storeCode || rec.id) + '.pptx"');
  fs.createReadStream(file).pipe(res);
});

// ---- user management ----
app.get("/api/admin/users", requireAdmin, (_req, res) => {
  const db = loadDB();
  res.json((db.users || []).map((u) => ({ empCode: u.empCode, name: u.name, mode: u.mode })));
});

app.post("/api/admin/users", requireAdmin, (req, res) => {
  const { empCode, name, password, mode } = req.body || {};
  if (!empCode || !password || !name) return res.status(400).json({ error: "empCode, name and password are required" });
  const db = loadDB();
  db.users = db.users || [];
  if (db.users.some((u) => String(u.empCode).toLowerCase() === String(empCode).toLowerCase()))
    return res.status(409).json({ error: "Employee Code already exists" });
  db.users.push({ empCode, name, password, mode: mode || "Recce" });
  saveDB(db);
  res.json({ ok: true });
});

app.delete("/api/admin/users/:empCode", requireAdmin, (req, res) => {
  const db = loadDB();
  const before = (db.users || []).length;
  db.users = (db.users || []).filter((u) => String(u.empCode).toLowerCase() !== String(req.params.empCode).toLowerCase());
  saveDB(db);
  res.json({ ok: true, removed: before - db.users.length });
});

/* =========================== STATIC =========================== */
app.use("/admin", express.static(path.join(__dirname, "admin")));
app.use("/", express.static(path.join(__dirname, "..", "oams-mobile", "www")));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log("────────────────────────────────────────────────────");
  console.log(" OAMS backend running on http://localhost:" + PORT);
  console.log(" Admin panel:  http://localhost:" + PORT + "/admin   (admin / admin)");
  console.log(" User login:   EMP1024 / 1234   (edit oams-backend/db.json)");
  console.log("────────────────────────────────────────────────────");
});
