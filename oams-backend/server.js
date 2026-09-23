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
const archiver = require("archiver");
// Optional: build a nicely STYLED .xlsx template (coloured header, borders).
// If the package isn't installed we fall back to plain xlsx, so the app always runs.
let ExcelJS = null;
try { ExcelJS = require("exceljs"); } catch (e) {}

// Clean column set the client wants for the downloadable template (matches their sample).
const TEMPLATE_HEADERS = ["BRAND", "CODE", "DEALER NAME", "ADDRESS", "CITY", "DEALER CONTACT NO.", "ELEMENT", "W", "H", "QTY"];
// Example rows shown inside the template so admins see how to fill multi-element dealers.
const TEMPLATE_EXAMPLE = [
  ["Daikin", "8935", "BAJAJ ELECTRIC and WATCH SERVICE", "Main Bazar, Rampura", "Rampura", "9465106000", "GSB NEW", 144, 48, 1],
  ["Daikin", "8935", "BAJAJ ELECTRIC and WATCH SERVICE", "Main Bazar, Rampura", "Rampura", "9465106000", "SUNBOARD 3MM", 48, 150, 1],
  ["SAMSUNG", "8936", "NAURATA RAM MURARI LAL", "Sadar Bazar, Dhuri", "Dhuri", "9417512001", "ACP BOARD", 120, 48, 1]
];

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
    cAddr = col(["ADDRESS"]), cCity = col(["CITY"]), cPhone = col(["DEALER CONTACT NO.", "CONTACT NO.", "CONTACT NO", "CONTACT", "PHONE", "MOBILE"]),
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

// Column widths (in characters) shared by the template and the recce export.
const SHEET_WIDTHS = [12, 10, 30, 26, 14, 18, 20, 8, 8, 8];

// Build a clean, STYLED .xlsx (coloured header, borders, frozen header row) via
// ExcelJS; falls back to plain xlsx (same columns) if ExcelJS isn't installed.
async function buildXlsxBuffer(sheetName, headers, dataRows, widths) {
  widths = widths || headers.map((h) => Math.max(10, h.length + 4));
  if (ExcelJS) {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet(sheetName, { views: [{ state: "frozen", ySplit: 1 }] });
    ws.columns = headers.map((h, i) => ({ header: h, width: widths[i] || 14 }));
    const edge = { style: "thin", color: { argb: "FF9FA8DA" } };
    const border = { top: edge, bottom: edge, left: edge, right: edge };
    const head = ws.getRow(1);
    head.height = 26;
    head.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FF1A237E" }, size: 11 };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFC5CAE9" } };
      cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
      cell.border = border;
    });
    dataRows.forEach((r) => {
      const row = ws.addRow(r);
      row.height = 28;
      row.eachCell((cell) => {
        cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
        cell.border = border;
      });
    });
    return await wb.xlsx.writeBuffer();
  }
  // Fallback: plain xlsx (no colours) with the same clean columns.
  const ws = XLSX.utils.aoa_to_sheet([headers, ...dataRows]);
  ws["!cols"] = widths.map((w) => ({ wch: w }));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  return XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
}

// Downloadable dealer-import template (clean columns + example rows).
function buildTemplateBuffer() {
  return buildXlsxBuffer("Dealers", TEMPLATE_HEADERS, TEMPLATE_EXAMPLE, SHEET_WIDTHS);
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
    brand: store.brand || "", gstNo: work.gstNo || "",
    userEmpCode: user && user.empCode, userName: user && user.name,
    storePhotoCount: (work.storeImages || []).length, storeRemark: work.storeRemark || "", finalRemark: work.finalRemark || "",
    elements: (work.elements || []).map((e) => ({ type: e.type, width: e.width, height: e.height, total: e.total, qty: e.qty, photoCount: (e.photos || []).length, remark: e.remark })),
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
  const { q, user, city, brand, from, to } = req.query;
  res.json(await db.listSubmissions({ q, user, city, brand, from, to }));
}));

app.get("/api/admin/filters", requireAdmin, wrap(async (_req, res) => res.json(await db.distinctFilters())));

// ---- Bulk: download all filtered recces' PPTs as one ZIP ----
app.get("/api/admin/recces/ppt-zip", wrap(async (req, res) => {
  if (!adminOk(req)) return res.status(401).send("Admin auth required");
  const { q, user, city, brand, from, to } = req.query;
  const list = await db.listSubmissions({ q, user, city, brand, from, to });
  res.setHeader("Content-Type", "application/zip");
  res.setHeader("Content-Disposition", 'attachment; filename="Hanu_Multimedia_Recces_PPT.zip"');
  const archive = archiver("zip", { zlib: { level: 6 } });
  archive.on("error", () => { try { res.status(500).end(); } catch (e) {} });
  archive.pipe(res);
  const used = {};
  for (const r of list) {
    const file = path.join(REPORTS_DIR, r.pptFile || "");
    if (r.pptFile && fs.existsSync(file)) {
      let name = (r.storeCode || r.id) + ".pptx";
      if (used[name]) name = (r.storeCode || r.id) + "_" + r.id + ".pptx";
      used[name] = 1;
      archive.file(file, { name });
    }
  }
  archive.finalize();
}));

// ---- Export the filtered recces as an Excel file (ONE ROW PER ELEMENT) ----
// Clean client format: BRAND, CODE, DEALER NAME, ADDRESS, CITY, DEALER CONTACT NO.,
// ELEMENT, W, H, QTY. Address + Contact aren't stored on the submission, so we look
// them up from the dealer master by dealer code.
app.get("/api/admin/recces/excel", wrap(async (req, res) => {
  if (!adminOk(req)) return res.status(401).send("Admin auth required");
  const { q, user, city, brand, from, to } = req.query;
  const list = await db.listSubmissions({ q, user, city, brand, from, to });
  const dealers = await db.listDealers();
  const dmap = {};
  dealers.forEach((d) => { dmap[String(d.storeCode || "").toLowerCase()] = d; });
  const headers = ["BRAND", "CODE", "DEALER NAME", "ADDRESS", "CITY", "DEALER CONTACT NO.", "ELEMENT", "W", "H", "QTY"];
  const rows = [];
  list.forEach((r) => {
    const d = dmap[String(r.storeCode || "").toLowerCase()] || {};
    const base = [r.brand || "", r.storeCode || "", r.storeName || "", d.address || "", r.city || "", d.phone || ""];
    const els = r.elements || [];
    if (els.length) els.forEach((e) => rows.push(base.concat([e.type || "", e.width || "", e.height || "", e.qty || ""])));
    else rows.push(base.concat(["", "", "", ""]));
  });
  const buf = await buildXlsxBuffer("Recces", headers, rows, SHEET_WIDTHS);
  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.setHeader("Content-Disposition", 'attachment; filename="Hanu_Multimedia_Recces.xlsx"');
  res.send(buf);
}));

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
  res.send(await buildTemplateBuffer());
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
// The WEBSITE is the ADMIN PANEL only. Recce submissions happen in the mobile
// app; they save to this backend's database and show up here in /admin.
app.use("/admin", express.static(path.join(__dirname, "admin")));
// Site root -> admin panel (the field app is NOT served on the website).
app.get("/", (_req, res) => res.redirect("/admin/"));

const PORT = process.env.PORT || 4000;
db.init().then(() => {
  app.listen(PORT, () => {
    console.log("────────────────────────────────────────────────────");
    console.log(" Hanu Multimedia backend running on port " + PORT + "  (" + db.engine + ")");
    console.log(" Admin panel: /admin   (admin / admin)");
    console.log("────────────────────────────────────────────────────");
  });
}).catch((e) => { console.error("DB init failed:", e); process.exit(1); });
