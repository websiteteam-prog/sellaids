/* =========================================================================
 * Data layer — auto-switches:
 *   • DB_HOST set (VPS/production)  -> MySQL (mysql2)
 *   • otherwise (local dev)         -> db.json file
 * Same async API either way, so server.js doesn't care.
 * ========================================================================= */
const fs = require("fs");
const path = require("path");

const USE_MYSQL = !!process.env.DB_HOST;

const DEFAULT_ADMINS = [{ username: "admin", password: "admin", name: "OAMS Admin" }];
const DEFAULT_USERS = [
  { empCode: "EMP1024", password: "1234", name: "Rahul Mehta", mode: "Recce" },
  { empCode: "EMP2048", password: "1234", name: "Sneha Kulkarni", mode: "Recce" }
];
const DEFAULT_ELEMENT_TYPES = [
  "SUNBOARD 3MM", "SUNBOARD 5MM", "VINYL", "ONEWAY VISION", "TRANSLIT",
  "FABRIC PRINT", "FABRIC BOX NEW", "GSB FLEX CHANGE", "GSB NEW", "GSB NEW D/S",
  "NONLIT BOARD", "NONLIT FLEX CHANGE", "ACP BOARD", "FROSTED VINYL",
  "LIT ACRYLIC HEADER", "IRON ANGLE", "LIT CLIPON", "SCAFFOLDING/CRANE",
  "ROCKET PILLAR", "REPAIR", "ACRYLIC SANDWICH", "LIT FLANGE"
];
const DEFAULT_STORES = [
  { storeCode: "626425", storeName: "Sharma Electronics Store", address: "Opp. HDFC Bank, Chandigarh Road, Samrala (LDH)", phone: "9888908988, 9464681941", city: "Ludhiana", category: "Consumer Electronics", brand: "Mi", retType: "" },
  { storeCode: "STR-0478", storeName: "Croma - Powai", address: "Powai Plaza, Powai", phone: "022-99870 44556", city: "Mumbai", category: "OT", brand: "Croma", retType: "" },
  { storeCode: "STR-0451", storeName: "Reliance Trends - Andheri West", address: "Link Road, Andheri West", phone: "022-98200 11223", city: "Mumbai", category: "MBO", brand: "Reliance", retType: "" },
  { storeCode: "STR-0502", storeName: "Vijay Sales - Thane", address: "Station Road, Thane West", phone: "022-98330 77889", city: "Thane", category: "ISB", brand: "Vijay Sales", retType: "" },
  { storeCode: "STR-0311", storeName: "Big Bazaar - Malad", address: "Mindspace, Malad West", phone: "022-98200 11223", city: "Mumbai", category: "OT", brand: "Big Bazaar", retType: "" },
  { storeCode: "STR-0388", storeName: "DMart - Kandivali", address: "SV Road, Kandivali", phone: "022-99870 44556", city: "Mumbai", category: "MBO", brand: "DMart", retType: "" },
  { storeCode: "STR-0450", storeName: "Shoppers Stop - Ghatkopar", address: "R City Mall, Ghatkopar", phone: "022-98330 77889", city: "Mumbai", category: "ISB", brand: "Shoppers Stop", retType: "" },
  { storeCode: "STR-0604", storeName: "Reliance Digital - Borivali", address: "SV Road, Borivali West", phone: "022-99870 44556", city: "Mumbai", category: "OT", brand: "Reliance Digital", retType: "" }
];
// Planned elements per store (admin loads these via the Excel import).
// Each row = one element the field user must recce for that dealer/store.
const DEFAULT_STORE_ELEMENTS = [
  { storeCode: "626425",   srNo: "1", brand: "Mi",    element: "GSB NEW",      width: 120, height: 36, qty: 1, sqft: 30,  remarks: "Main front board" },
  { storeCode: "626425",   srNo: "2", brand: "Mi",    element: "SUNBOARD 3MM", width: 48,  height: 24, qty: 2, sqft: 16,  remarks: "Side panels" },
  { storeCode: "626425",   srNo: "3", brand: "Mi",    element: "LIT CLIPON",   width: 36,  height: 36, qty: 1, sqft: 9,   remarks: "Entry clip-on" },
  { storeCode: "STR-0478", srNo: "1", brand: "Croma", element: "VINYL",        width: 60,  height: 18, qty: 1, sqft: 7.5, remarks: "Window vinyl" },
  { storeCode: "STR-0478", srNo: "2", brand: "Croma", element: "ACP BOARD",    width: 96,  height: 48, qty: 1, sqft: 32,  remarks: "Facade ACP" }
];

function safeJson(s) { try { return typeof s === "string" ? JSON.parse(s) : (s || []); } catch (e) { return []; } }
function uniq(a) { return Array.from(new Set(a.filter(Boolean))); }

/* ============================ MySQL ============================ */
function mysqlBackend() {
  const mysql = require("mysql2/promise");
  let pool;
  async function q(sql, p) { const [r] = await pool.execute(sql, p || []); return r; }

  const storeRow = (r) => ({ storeCode: r.store_code, storeName: r.store_name, address: r.address, phone: r.phone, city: r.city, category: r.category, brand: r.brand, retType: r.ret_type });
  const seRow = (r) => ({ srNo: r.sr_no, brand: r.brand, element: r.element, width: Number(r.width) || 0, height: Number(r.height) || 0, qty: Number(r.qty) || 0, sqft: Number(r.sqft) || 0, remarks: r.remarks || "" });
  const subRow = (r) => ({
    id: r.id, storeCode: r.store_code, storeName: r.store_name, city: r.city, category: r.category,
    userEmpCode: r.user_emp_code, userName: r.user_name, storePhotoCount: r.store_photo_count,
    storeRemark: r.store_remark, finalRemark: r.final_remark, elementsCount: r.elements_count,
    elements: safeJson(r.elements_json), pptFile: r.ppt_file,
    submittedAt: r.submitted_at instanceof Date ? r.submitted_at.toISOString() : r.submitted_at
  });

  return {
    engine: "mysql",
    async init() {
      pool = mysql.createPool({
        host: process.env.DB_HOST, port: Number(process.env.DB_PORT || 3306),
        user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_NAME,
        waitForConnections: true, connectionLimit: 5, charset: "utf8mb4"
      });
      await q(`CREATE TABLE IF NOT EXISTS admins (username VARCHAR(64) PRIMARY KEY, password VARCHAR(255), name VARCHAR(128))`);
      await q(`CREATE TABLE IF NOT EXISTS users (emp_code VARCHAR(64) PRIMARY KEY, password VARCHAR(255), name VARCHAR(128), mode VARCHAR(32))`);
      await q(`CREATE TABLE IF NOT EXISTS stores (store_code VARCHAR(64) PRIMARY KEY, store_name VARCHAR(255), address VARCHAR(255), phone VARCHAR(128), city VARCHAR(128), category VARCHAR(64), brand VARCHAR(128), ret_type VARCHAR(64))`);
      await q(`CREATE TABLE IF NOT EXISTS element_types (name VARCHAR(128) PRIMARY KEY)`);
      await q(`CREATE TABLE IF NOT EXISTS store_elements (
        id INT AUTO_INCREMENT PRIMARY KEY, store_code VARCHAR(64), sr_no VARCHAR(32), brand VARCHAR(128),
        element VARCHAR(128), width DECIMAL(10,2), height DECIMAL(10,2), qty INT, sqft DECIMAL(12,2), remarks TEXT,
        INDEX idx_store_code (store_code))`);
      await q(`CREATE TABLE IF NOT EXISTS submissions (
        id VARCHAR(64) PRIMARY KEY, store_code VARCHAR(64), store_name VARCHAR(255), city VARCHAR(128), category VARCHAR(64),
        user_emp_code VARCHAR(64), user_name VARCHAR(128), store_photo_count INT, store_remark TEXT, final_remark TEXT,
        elements_count INT, elements_json LONGTEXT, ppt_file VARCHAR(255), submitted_at DATETIME)`);
      if ((await q(`SELECT COUNT(*) c FROM admins`))[0].c === 0)
        for (const a of DEFAULT_ADMINS) await q(`INSERT INTO admins (username,password,name) VALUES (?,?,?)`, [a.username, a.password, a.name]);
      if ((await q(`SELECT COUNT(*) c FROM element_types`))[0].c === 0)
        for (const n of DEFAULT_ELEMENT_TYPES) await q(`INSERT INTO element_types (name) VALUES (?)`, [n]);
      if ((await q(`SELECT COUNT(*) c FROM stores`))[0].c === 0)
        for (const s of DEFAULT_STORES) await q(`INSERT INTO stores (store_code,store_name,address,phone,city,category,brand,ret_type) VALUES (?,?,?,?,?,?,?,?)`,
          [s.storeCode, s.storeName, s.address, s.phone, s.city, s.category, s.brand, s.retType]);
      if ((await q(`SELECT COUNT(*) c FROM users`))[0].c === 0)
        for (const u of DEFAULT_USERS) await q(`INSERT INTO users (emp_code,password,name,mode) VALUES (?,?,?,?)`, [u.empCode, u.password, u.name, u.mode]);
      if ((await q(`SELECT COUNT(*) c FROM store_elements`))[0].c === 0)
        for (const e of DEFAULT_STORE_ELEMENTS) await q(`INSERT INTO store_elements (store_code,sr_no,brand,element,width,height,qty,sqft,remarks) VALUES (?,?,?,?,?,?,?,?,?)`,
          [e.storeCode, e.srNo, e.brand, e.element, e.width, e.height, e.qty, e.sqft, e.remarks]);
      console.log("[db] MySQL connected:", process.env.DB_NAME);
    },
    async adminByUsername(u) { const r = await q(`SELECT * FROM admins WHERE LOWER(username)=LOWER(?)`, [u]); return r[0] || null; },
    async userByEmpCode(c) { const r = await q(`SELECT * FROM users WHERE LOWER(emp_code)=LOWER(?)`, [c]); return r[0] ? { empCode: r[0].emp_code, password: r[0].password, name: r[0].name, mode: r[0].mode } : null; },
    async listUsers() { return (await q(`SELECT emp_code,name,mode FROM users ORDER BY emp_code`)).map((x) => ({ empCode: x.emp_code, name: x.name, mode: x.mode })); },
    async addUser(u) {
      if ((await q(`SELECT emp_code FROM users WHERE LOWER(emp_code)=LOWER(?)`, [u.empCode])).length) { const e = new Error("exists"); e.code = "EXISTS"; throw e; }
      await q(`INSERT INTO users (emp_code,password,name,mode) VALUES (?,?,?,?)`, [u.empCode, u.password, u.name, u.mode || "Recce"]);
    },
    async deleteUser(c) { return (await q(`DELETE FROM users WHERE LOWER(emp_code)=LOWER(?)`, [c])).affectedRows; },
    async listElementTypes() { return (await q(`SELECT name FROM element_types ORDER BY name`)).map((x) => x.name); },
    async listStoreElements(code) { return (await q(`SELECT * FROM store_elements WHERE store_code=? ORDER BY id`, [code])).map(seRow); },
    async listPendingStores() {
      const stores = (await q(`SELECT * FROM stores WHERE store_code NOT IN (SELECT DISTINCT store_code FROM submissions) ORDER BY store_name`)).map(storeRow);
      const els = (await q(`SELECT * FROM store_elements ORDER BY id`)).map((r) => Object.assign(seRow(r), { storeCode: r.store_code }));
      return stores.map((s) => Object.assign({}, s, { elements: els.filter((e) => e.storeCode === s.storeCode) }));
    },
    async listDealers() {
      const stores = (await q(`SELECT * FROM stores ORDER BY store_name`)).map(storeRow);
      const counts = await q(`SELECT store_code, COUNT(*) c FROM store_elements GROUP BY store_code`);
      const done = new Set((await q(`SELECT DISTINCT store_code FROM submissions`)).map((r) => r.store_code));
      const cmap = {}; counts.forEach((r) => { cmap[r.store_code] = r.c; });
      return stores.map((s) => Object.assign({}, s, { elementCount: cmap[s.storeCode] || 0, done: done.has(s.storeCode) }));
    },
    async importDealers(dealers) {
      let storesAdded = 0, storesUpdated = 0, elements = 0;
      for (const d of dealers) {
        const exists = (await q(`SELECT store_code FROM stores WHERE LOWER(store_code)=LOWER(?)`, [d.storeCode])).length;
        await q(`INSERT INTO stores (store_code,store_name,address,phone,city,category,brand,ret_type) VALUES (?,?,?,?,?,?,?,?)
                 ON DUPLICATE KEY UPDATE store_name=VALUES(store_name), address=VALUES(address), phone=VALUES(phone), city=VALUES(city), brand=VALUES(brand)`,
          [d.storeCode, d.storeName, d.address, d.phone, d.city, d.category || "", d.brand, d.retType || ""]);
        if (exists) storesUpdated++; else storesAdded++;
        await q(`DELETE FROM store_elements WHERE LOWER(store_code)=LOWER(?)`, [d.storeCode]);
        for (const e of (d.elements || [])) {
          await q(`INSERT INTO store_elements (store_code,sr_no,brand,element,width,height,qty,sqft,remarks) VALUES (?,?,?,?,?,?,?,?,?)`,
            [d.storeCode, e.srNo || "", e.brand || d.brand || "", e.element, e.width || 0, e.height || 0, e.qty || 0, e.sqft || 0, e.remarks || ""]);
          elements++;
        }
      }
      return { dealers: dealers.length, storesAdded, storesUpdated, elements };
    },
    async addSubmission(s) {
      await q(`INSERT INTO submissions (id,store_code,store_name,city,category,user_emp_code,user_name,store_photo_count,store_remark,final_remark,elements_count,elements_json,ppt_file,submitted_at)
               VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [s.id, s.storeCode, s.storeName, s.city, s.category, s.userEmpCode, s.userName, s.storePhotoCount, s.storeRemark, s.finalRemark, s.elementsCount, JSON.stringify(s.elements || []), s.pptFile, new Date(s.submittedAt)]);
    },
    async listSubmissions(f) {
      f = f || {}; const w = []; const p = [];
      if (f.q) { w.push(`(LOWER(store_name) LIKE ? OR LOWER(store_code) LIKE ?)`); p.push("%" + f.q.toLowerCase() + "%", "%" + f.q.toLowerCase() + "%"); }
      if (f.user) { w.push(`user_emp_code=?`); p.push(f.user); }
      if (f.city) { w.push(`city=?`); p.push(f.city); }
      if (f.category) { w.push(`category=?`); p.push(f.category); }
      if (f.from) { w.push(`submitted_at>=?`); p.push(new Date(f.from + "T00:00:00")); }
      if (f.to) { w.push(`submitted_at<=?`); p.push(new Date(f.to + "T23:59:59")); }
      return (await q(`SELECT * FROM submissions ${w.length ? "WHERE " + w.join(" AND ") : ""} ORDER BY submitted_at DESC`, p)).map(subRow);
    },
    async submissionById(id) { const r = await q(`SELECT * FROM submissions WHERE id=?`, [id]); return r[0] ? subRow(r[0]) : null; },
    async distinctFilters() {
      const s = (await q(`SELECT * FROM submissions`)).map(subRow);
      return { cities: uniq(s.map((x) => x.city)), categories: uniq(s.map((x) => x.category)),
        users: uniq(s.map((x) => x.userEmpCode)).map((code) => ({ empCode: code, name: (s.find((x) => x.userEmpCode === code) || {}).userName || "" })) };
    }
  };
}

/* ============================ JSON file ============================ */
function jsonBackend() {
  const FILE = path.join(__dirname, "db.json");
  function load() { return JSON.parse(fs.readFileSync(FILE, "utf8")); }
  function save(d) { fs.writeFileSync(FILE, JSON.stringify(d, null, 2)); }
  return {
    engine: "json",
    async init() {
      if (!fs.existsSync(FILE)) save({ admins: DEFAULT_ADMINS, users: DEFAULT_USERS, elementTypes: DEFAULT_ELEMENT_TYPES, stores: DEFAULT_STORES, storeElements: DEFAULT_STORE_ELEMENTS, submissions: [] });
      else { const db = load(); if (!db.storeElements) { db.storeElements = DEFAULT_STORE_ELEMENTS; save(db); } }
      console.log("[db] using db.json (local dev)");
    },
    async adminByUsername(u) { return (load().admins || []).find((a) => String(a.username).toLowerCase() === String(u).toLowerCase()) || null; },
    async userByEmpCode(c) { return (load().users || []).find((x) => String(x.empCode).toLowerCase() === String(c).toLowerCase()) || null; },
    async listUsers() { return (load().users || []).map((u) => ({ empCode: u.empCode, name: u.name, mode: u.mode })); },
    async addUser(u) {
      const db = load(); db.users = db.users || [];
      if (db.users.some((x) => String(x.empCode).toLowerCase() === String(u.empCode).toLowerCase())) { const e = new Error("exists"); e.code = "EXISTS"; throw e; }
      db.users.push({ empCode: u.empCode, password: u.password, name: u.name, mode: u.mode || "Recce" }); save(db);
    },
    async deleteUser(c) { const db = load(); const b = (db.users || []).length; db.users = (db.users || []).filter((x) => String(x.empCode).toLowerCase() !== String(c).toLowerCase()); save(db); return b - db.users.length; },
    async listElementTypes() { return load().elementTypes || []; },
    async listStoreElements(code) { return (load().storeElements || []).filter((e) => String(e.storeCode) === String(code)); },
    async listPendingStores() {
      const db = load(); const done = new Set((db.submissions || []).map((s) => s.storeCode)); const se = db.storeElements || [];
      return (db.stores || []).filter((s) => !done.has(s.storeCode))
        .map((s) => Object.assign({}, s, { elements: se.filter((e) => String(e.storeCode) === String(s.storeCode)) }));
    },
    async listDealers() {
      const db = load(); const done = new Set((db.submissions || []).map((s) => s.storeCode)); const se = db.storeElements || [];
      return (db.stores || []).map((s) => Object.assign({}, s, {
        elementCount: se.filter((e) => String(e.storeCode) === String(s.storeCode)).length, done: done.has(s.storeCode)
      }));
    },
    async importDealers(dealers) {
      const db = load(); db.stores = db.stores || []; db.storeElements = db.storeElements || [];
      let storesAdded = 0, storesUpdated = 0, elements = 0;
      for (const d of dealers) {
        const key = String(d.storeCode).toLowerCase();
        const idx = db.stores.findIndex((s) => String(s.storeCode).toLowerCase() === key);
        const rec = { storeCode: d.storeCode, storeName: d.storeName, address: d.address, phone: d.phone, city: d.city, category: d.category || "", brand: d.brand, retType: d.retType || "" };
        if (idx >= 0) { db.stores[idx] = Object.assign({}, db.stores[idx], rec); storesUpdated++; }
        else { db.stores.push(rec); storesAdded++; }
        db.storeElements = db.storeElements.filter((e) => String(e.storeCode).toLowerCase() !== key);
        (d.elements || []).forEach((e) => {
          db.storeElements.push({ storeCode: d.storeCode, srNo: e.srNo || "", brand: e.brand || d.brand || "", element: e.element, width: e.width || 0, height: e.height || 0, qty: e.qty || 0, sqft: e.sqft || 0, remarks: e.remarks || "" });
          elements++;
        });
      }
      save(db);
      return { dealers: dealers.length, storesAdded, storesUpdated, elements };
    },
    async addSubmission(s) { const db = load(); db.submissions = db.submissions || []; db.submissions.push(s); save(db); },
    async listSubmissions(f) {
      f = f || {}; let list = (load().submissions || []).slice().reverse();
      if (f.q) { const s = f.q.toLowerCase(); list = list.filter((r) => (r.storeName + " " + r.storeCode).toLowerCase().includes(s)); }
      if (f.user) list = list.filter((r) => r.userEmpCode === f.user);
      if (f.city) list = list.filter((r) => r.city === f.city);
      if (f.category) list = list.filter((r) => r.category === f.category);
      if (f.from) list = list.filter((r) => new Date(r.submittedAt) >= new Date(f.from + "T00:00:00"));
      if (f.to) list = list.filter((r) => new Date(r.submittedAt) <= new Date(f.to + "T23:59:59"));
      return list;
    },
    async submissionById(id) { return (load().submissions || []).find((r) => r.id === id) || null; },
    async distinctFilters() {
      const s = load().submissions || [];
      return { cities: uniq(s.map((x) => x.city)), categories: uniq(s.map((x) => x.category)),
        users: uniq(s.map((x) => x.userEmpCode)).map((code) => ({ empCode: code, name: (s.find((x) => x.userEmpCode === code) || {}).userName || "" })) };
    }
  };
}

module.exports = USE_MYSQL ? mysqlBackend() : jsonBackend();
module.exports.USE_MYSQL = USE_MYSQL;
