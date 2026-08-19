/* =========================================================================
 * OAMS Field App — BACKEND + ADMIN PANEL
 *   • Local dev:   uses db.json         (just `npm start`)
 *   • Production:  uses MySQL           (set DB_HOST/DB_USER/... in .env)
 *
 * Admin panel (web): /admin      (login admin / admin)
 * App user login:    EMP1024 / 1234
 * ========================================================================= */
try { require("dotenv").config(); } catch (e) {}
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const db = require("./db");
const { buildPptxBuffer } = require("./report");

const app = express();
app.use(cors());
app.use(express.json({ limit: "80mb" }));

const REPORTS_DIR = path.join(__dirname, "reports");
if (!fs.existsSync(REPORTS_DIR)) fs.mkdirSync(REPORTS_DIR, { recursive: true });

app.use("/api", (req, _res, next) => { console.log(`[api] ${req.method} ${req.url}`); next(); });

const wrap = (fn) => (req, res) => Promise.resolve(fn(req, res)).catch((e) => { console.error(e); res.status(500).json({ error: "Server error" }); });

/* =========================== USER API =========================== */
app.post("/api/login", wrap(async (req, res) => {
  const { empCode, password } = req.body || {};
  const u = await db.userByEmpCode(empCode || "");
  if (!u || u.password !== password) return res.status(401).json({ error: "Invalid Employee Code or Password" });
  res.json({ token: "user-token-" + u.empCode, name: u.name, empCode: u.empCode, mode: u.mode });
}));

app.get("/api/master", wrap(async (_req, res) => res.json({ elementTypes: await db.listElementTypes() })));

app.get("/api/stores", wrap(async (_req, res) => res.json(await db.listPendingStores())));

app.post("/api/recce/submit", wrap(async (req, res) => {
  const { store, user, work } = req.body || {};
  if (!store || !work) return res.status(400).json({ error: "Missing store or work" });
  const id = "REC-" + Date.now();
  const submittedAt = new Date().toISOString();
  const pptFile = id + ".pptx";
  const buf = await buildPptxBuffer(store, work, { userName: user && user.name, userEmpCode: user && user.empCode, submittedAt });
  fs.writeFileSync(path.join(REPORTS_DIR, pptFile), buf);
  await db.addSubmission({
    id, storeCode: store.storeCode, storeName: store.storeName, city: store.city, category: store.category,
    userEmpCode: user && user.empCode, userName: user && user.name,
    storePhotoCount: (work.storeImages || []).length, storeRemark: work.storeRemark || "", finalRemark: work.finalRemark || "",
    elements: (work.elements || []).map((e) => ({ type: e.type, width: e.width, height: e.height, total: e.total, photoCount: (e.photos || []).length, remark: e.remark })),
    elementsCount: (work.elements || []).length, pptFile, submittedAt
  });
  res.json({ ok: true, id });
}));

/* =========================== ADMIN API =========================== */
function adminOk(req) { const t = req.headers["x-admin-token"] || req.query.t || ""; return typeof t === "string" && t.indexOf("admin-token-") === 0; }
function requireAdmin(req, res, next) { if (!adminOk(req)) return res.status(401).json({ error: "Admin auth required" }); next(); }

app.post("/api/admin/login", wrap(async (req, res) => {
  const { username, password } = req.body || {};
  const a = await db.adminByUsername(username || "");
  if (!a || a.password !== password) return res.status(401).json({ error: "Invalid admin credentials" });
  res.json({ token: "admin-token-" + a.username, name: a.name });
}));

app.get("/api/admin/recces", requireAdmin, wrap(async (req, res) => {
  const { q, user, city, category, from, to } = req.query;
  res.json(await db.listSubmissions({ q, user, city, category, from, to }));
}));

app.get("/api/admin/filters", requireAdmin, wrap(async (_req, res) => res.json(await db.distinctFilters())));

app.get("/api/admin/recces/:id/ppt", wrap(async (req, res) => {
  if (!adminOk(req)) return res.status(401).send("Admin auth required");
  const rec = await db.submissionById(req.params.id);
  if (!rec) return res.status(404).send("Not found");
  const file = path.join(REPORTS_DIR, rec.pptFile);
  if (!fs.existsSync(file)) return res.status(404).send("Report file missing");
  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.presentationml.presentation");
  res.setHeader("Content-Disposition", 'attachment; filename="' + (rec.storeCode || rec.id) + '.pptx"');
  fs.createReadStream(file).pipe(res);
}));

app.get("/api/admin/users", requireAdmin, wrap(async (_req, res) => res.json(await db.listUsers())));
app.post("/api/admin/users", requireAdmin, wrap(async (req, res) => {
  const { empCode, name, password, mode } = req.body || {};
  if (!empCode || !password || !name) return res.status(400).json({ error: "empCode, name and password are required" });
  try { await db.addUser({ empCode, name, password, mode }); res.json({ ok: true }); }
  catch (e) { if (e.code === "EXISTS") return res.status(409).json({ error: "Employee Code already exists" }); throw e; }
}));
app.delete("/api/admin/users/:empCode", requireAdmin, wrap(async (req, res) => { await db.deleteUser(req.params.empCode); res.json({ ok: true }); }));

/* =========================== STATIC =========================== */
app.use("/admin", express.static(path.join(__dirname, "admin")));
app.use("/", express.static(path.join(__dirname, "..", "oams-mobile", "www")));

const PORT = process.env.PORT || 4000;
db.init().then(() => {
  app.listen(PORT, () => {
    console.log("────────────────────────────────────────────────────");
    console.log(" OAMS backend running on port " + PORT + "  (" + db.engine + ")");
    console.log(" Admin panel: /admin   (admin / admin)");
    console.log("────────────────────────────────────────────────────");
  });
}).catch((e) => { console.error("DB init failed:", e); process.exit(1); });
