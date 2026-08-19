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
  "Sunboard", "Art Board", "Flex", "Acrylic Signage", "LED",
  "Vinyl", "ACP Panel", "Glow Sign Board", "One Way Vision", "Fabric Backlit"
];
const DEFAULT_STORES = [
  { storeCode: "STR-0451", storeName: "Reliance Trends - Andheri West", city: "Mumbai", category: "MBO", coordinatorName: "Rahul Mehta", coordinatorNumber: "+91 98200 11223" },
  { storeCode: "STR-0478", storeName: "Croma - Powai", city: "Mumbai", category: "OT", coordinatorName: "Sneha Kulkarni", coordinatorNumber: "+91 99870 44556" },
  { storeCode: "STR-0502", storeName: "Vijay Sales - Thane", city: "Thane", category: "ISB", coordinatorName: "Amit Sharma", coordinatorNumber: "+91 98330 77889" },
  { storeCode: "STR-0311", storeName: "Big Bazaar - Malad", city: "Mumbai", category: "OT", coordinatorName: "Rahul Mehta", coordinatorNumber: "+91 98200 11223" },
  { storeCode: "STR-0388", storeName: "DMart - Kandivali", city: "Mumbai", category: "MBO", coordinatorName: "Sneha Kulkarni", coordinatorNumber: "+91 99870 44556" },
  { storeCode: "STR-0450", storeName: "Shoppers Stop - Ghatkopar", city: "Mumbai", category: "ISB", coordinatorName: "Amit Sharma", coordinatorNumber: "+91 98330 77889" },
  { storeCode: "STR-0561", storeName: "Croma - Vashi", city: "Navi Mumbai", category: "OT", coordinatorName: "Rahul Mehta", coordinatorNumber: "+91 98200 11223" },
  { storeCode: "STR-0604", storeName: "Reliance Digital - Borivali", city: "Mumbai", category: "MBO", coordinatorName: "Sneha Kulkarni", coordinatorNumber: "+91 99870 44556" }
];

function safeJson(s) { try { return typeof s === "string" ? JSON.parse(s) : (s || []); } catch (e) { return []; } }
function uniq(a) { return Array.from(new Set(a.filter(Boolean))); }

/* ============================ MySQL ============================ */
function mysqlBackend() {
  const mysql = require("mysql2/promise");
  let pool;
  async function q(sql, p) { const [r] = await pool.execute(sql, p || []); return r; }

  const storeRow = (r) => ({ storeCode: r.store_code, storeName: r.store_name, city: r.city, category: r.category, coordinatorName: r.coordinator_name, coordinatorNumber: r.coordinator_number });
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
      await q(`CREATE TABLE IF NOT EXISTS stores (store_code VARCHAR(64) PRIMARY KEY, store_name VARCHAR(255), city VARCHAR(128), category VARCHAR(64), coordinator_name VARCHAR(128), coordinator_number VARCHAR(64))`);
      await q(`CREATE TABLE IF NOT EXISTS element_types (name VARCHAR(128) PRIMARY KEY)`);
      await q(`CREATE TABLE IF NOT EXISTS submissions (
        id VARCHAR(64) PRIMARY KEY, store_code VARCHAR(64), store_name VARCHAR(255), city VARCHAR(128), category VARCHAR(64),
        user_emp_code VARCHAR(64), user_name VARCHAR(128), store_photo_count INT, store_remark TEXT, final_remark TEXT,
        elements_count INT, elements_json LONGTEXT, ppt_file VARCHAR(255), submitted_at DATETIME)`);
      if ((await q(`SELECT COUNT(*) c FROM admins`))[0].c === 0)
        for (const a of DEFAULT_ADMINS) await q(`INSERT INTO admins (username,password,name) VALUES (?,?,?)`, [a.username, a.password, a.name]);
      if ((await q(`SELECT COUNT(*) c FROM element_types`))[0].c === 0)
        for (const n of DEFAULT_ELEMENT_TYPES) await q(`INSERT INTO element_types (name) VALUES (?)`, [n]);
      if ((await q(`SELECT COUNT(*) c FROM stores`))[0].c === 0)
        for (const s of DEFAULT_STORES) await q(`INSERT INTO stores (store_code,store_name,city,category,coordinator_name,coordinator_number) VALUES (?,?,?,?,?,?)`,
          [s.storeCode, s.storeName, s.city, s.category, s.coordinatorName, s.coordinatorNumber]);
      if ((await q(`SELECT COUNT(*) c FROM users`))[0].c === 0)
        for (const u of DEFAULT_USERS) await q(`INSERT INTO users (emp_code,password,name,mode) VALUES (?,?,?,?)`, [u.empCode, u.password, u.name, u.mode]);
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
    async listPendingStores() { return (await q(`SELECT * FROM stores WHERE store_code NOT IN (SELECT DISTINCT store_code FROM submissions) ORDER BY store_name`)).map(storeRow); },
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
      if (!fs.existsSync(FILE)) save({ admins: DEFAULT_ADMINS, users: DEFAULT_USERS, elementTypes: DEFAULT_ELEMENT_TYPES, stores: DEFAULT_STORES, submissions: [] });
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
    async listPendingStores() { const db = load(); const done = new Set((db.submissions || []).map((s) => s.storeCode)); return (db.stores || []).filter((s) => !done.has(s.storeCode)); },
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
