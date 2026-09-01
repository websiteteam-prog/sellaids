/* =========================================================================
 * Hanu Multimedia Field App — BACKEND + ADMIN PANEL
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
const XLSX = require("xlsx");

// Columns the client's Excel uses (row of headers can sit anywhere in the sheet).
const TEMPLATE_HEADERS = ["BRAND", "SR. NO.", "DEALER CODE", "DEALER NAME", "ADDRESS", "CITY", "CONTACT NO.", "ELEMENT", "WIDTH (INCH)", "HEIGHT (INCH)", "QTY", "SQFT", "REMARKS"];

// Parse an uploaded Excel buffer into structured dealers (each with an elements[]).
// Dealer info may appear only on the first element row of a dealer, so we carry it forward.
function parseDealers(buffer) {
  const wb = XLSX.read(buffer, { type: "buffer" });
  const ws = wb.Sheets[wb.SheetNames[0]];
  if (!ws) throw new Error("The Excel file has no sheet.");
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });
  const norm = (s) => String(s == null ? "" : s).toUpperCase().replace(/\s+/g, " ").trim();
  let hi = -1; const H = {};
  for (let i = 0; i < rows.length; i++) {
    const cells = rows[i].map(norm);
    if (cells.includes("DEALER CODE") || cells.includes("DEALER NAME") || (cells.includes("ELEMENT") && cells.includes("BRAND"))) {
      hi = i; cells.forEach((c, idx) => { if (c && H[c] == null) H[c] = idx; }); break;
    }
  }
  if (hi < 0) throw new Error("Could not find the header row. It must contain BRAND / DEALER CODE / ELEMENT columns.");
  const col = (names) => { for (const n of names) if (H[n] != null) return H[n]; return -1; };
  const cBrand = col(["BRAND"]), cSr = col(["SR. NO.", "SR NO.", "SR NO", "SRNO", "SR. NO", "S. NO."]),
    cCode = col(["DEALER CODE", "STORE CODE", "RET CODE", "CODE"]), cName = col(["DEALER NAME", "STORE NAME", "DEALER"]),
    cAddr = col(["ADDRESS"]), cCity = col(["CITY"]), cPhone = col(["CONTACT NO.", "CONTACT NO", "CONTACT", "PHONE", "MOBILE"]),
    cEl = col(["ELEMENT", "ELEMENT TYPE", "TYPE"]), cW = col(["WIDTH (INCH)", "WIDTH", "WIDTH(INCH)", "W"]),
    cH = col(["HEIGHT (INCH)", "HEIGHT", "HEIGHT(INCH)", "H"]), cQ = col(["QTY", "QUANTITY", "QNTY"]),
    cSq = col(["SQFT", "SQ FT", "SQ.FT", "AREA"]), cRem = col(["REMARKS", "REMARK", "NOTE"]);
  const val = (row, i) => (i >= 0 ? String(row[i] == null ? "" : row[i]).trim() : "");
  const num = (row, i) => { const v = parseFloat(val(row, i)); return isNaN(v) ? 0 : v; };
  const dealers = []; const byCode = {}; let cur = null;
  for (let i = hi + 1; i < rows.length; i++) {
    const row = rows[i] || [];
    if (row.every((c) => String(c == null ? "" : c).trim() === "")) continue;
    const code = val(row, cCode), name = val(row, cName);
    if (code || name) {
      const key = (code || name).toLowerCase();
      if (byCode[key]) cur = byCode[key];
      else {
        cur = { storeCode: code || name, storeName: name || code, address: val(row, cAddr), phone: val(row, cPhone), city: val(row, cCity), brand: val(row, cBrand), category: "", retType: "", elements: [] };
        byCode[key] = cur; dealers.push(cur);
      }
      if (val(row, cAddr)) cur.address = val(row, cAddr);
      if (val(row, cCity)) cur.city = val(row, cCity);
      if (val(row, cPhone)) cur.phone = val(row, cPhone);
      if (val(row, cBrand)) cur.brand = val(row, cBrand);
    }
    const el = val(row, cEl);
    if (el && cur) {
      const w = num(row, cW), h = num(row, cH), qv = num(row, cQ), q = qv || 1;
      let sq = num(row, cSq); if (!sq) sq = +(((w * h * q) / 144).toFixed(2));
      cur.elements.push({ srNo: val(row, cSr), brand: val(row, cBrand) || cur.brand, element: el, width: w, height: h, qty: q, sqft: sq, remarks: val(row, cRem) });
    }
  }
  return dealers;
}

// Build a blank .xlsx template (header + one example row) for admins to fill.
function buildTemplateBuffer() {
  const example = ["Mi", "1", "626425", "Sharma Electronics Store", "Chandigarh Road, Samrala", "Ludhiana", "9888908988", "GSB NEW", 120, 36, 1, 30, "Main front board"];
  const ws = XLSX.utils.aoa_to_sheet([TEMPLATE_HEADERS, example]);
  ws["!cols"] = TEMPLATE_HEADERS.map((h) => ({ wch: Math.max(10, h.length + 2) }));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Dealers");
  return XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
}

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
    elements: (work.elements || []).map((e) => ({ type: e.type, width: e.width, height: e.height, total: e.total, qty: e.qty, sqft: e.sqft, photoCount: (e.photos || []).length, remark: e.remark })),
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

// ---- Dealers / Excel import ----
app.get("/api/admin/dealers", requireAdmin, wrap(async (_req, res) => res.json(await db.listDealers())));

app.post("/api/admin/import", requireAdmin, wrap(async (req, res) => {
  const { fileBase64 } = req.body || {};
  if (!fileBase64) return res.status(400).json({ error: "No file received." });
  let buffer;
  try { buffer = Buffer.from(String(fileBase64).replace(/^data:.*;base64,/, ""), "base64"); }
  catch (e) { return res.status(400).json({ error: "Bad file data." }); }
  let dealers;
  try { dealers = parseDealers(buffer); }
  catch (e) { return res.status(400).json({ error: e.message || "Could not read the Excel file." }); }
  if (!dealers.length) return res.status(400).json({ error: "No dealer rows found in the file." });
  const result = await db.importDealers(dealers);
  res.json(Object.assign({ ok: true }, result));
}));

app.get("/api/admin/template.xlsx", wrap(async (req, res) => {
  if (!adminOk(req)) return res.status(401).send("Admin auth required");
  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.setHeader("Content-Disposition", 'attachment; filename="Hanu_Multimedia_Dealer_Import_Template.xlsx"');
  res.send(buildTemplateBuffer());
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
// Admin panel (web): /admin
app.use("/admin", express.static(path.join(__dirname, "admin")));
// Field-app WEBSITE at the site root (built with:  cd oams-rn && npm run build:web).
// Served from the same origin as /api, so the web build auto-connects to this backend.
// (If not built yet, "/" simply 404s — the admin panel and API still work.)
app.use("/", express.static(path.join(__dirname, "webapp")));

const PORT = process.env.PORT || 4000;
db.init().then(() => {
  app.listen(PORT, () => {
    console.log("────────────────────────────────────────────────────");
    console.log(" Hanu Multimedia backend running on port " + PORT + "  (" + db.engine + ")");
    console.log(" Admin panel: /admin   (admin / admin)");
    console.log("────────────────────────────────────────────────────");
  });
}).catch((e) => { console.error("DB init failed:", e); process.exit(1); });
