/* Data layer. Uses the backend when API_BASE is set, else the offline demo data. */
import { API_BASE } from "./config";
import { DATA } from "./data";
import { getToken, setToken } from "./storage";

const BASE = (API_BASE || "").replace(/\/+$/, "");
export function backendOn() { return !!BASE; }

async function authHeaders() {
  const t = await getToken();
  return t ? { Authorization: "Bearer " + t } : {};
}

export async function login(empCode, password, mode) {
  if (!BASE) return { ok: true, name: empCode };
  try {
    const r = await fetch(BASE + "/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ empCode, password, mode })
    });
    if (!r.ok) return { ok: false };
    const d = await r.json();
    if (d.token) await setToken(d.token);
    return { ok: true, name: d.name || empCode };
  } catch (e) {
    return { ok: false, network: true };
  }
}

export async function getMaster() {
  const fallback = { elementTypes: DATA.elementTypes, surfaces: DATA.surfaces };
  if (!BASE) return fallback;
  try {
    const r = await fetch(BASE + "/master", { headers: await authHeaders() });
    if (r.ok) return await r.json();
  } catch (e) {}
  return fallback;
}

export async function getStores() {
  if (!BASE) return DATA.stores;
  try {
    const r = await fetch(BASE + "/stores", { headers: await authHeaders() });
    if (r.ok) return await r.json();
  } catch (e) {}
  return DATA.stores;
}

// save a completed recce (store + work)
export async function submitRecce(store, work) {
  if (!BASE) return { ok: true, offline: true };
  try {
    const r = await fetch(BASE + "/recce/save", {
      method: "POST",
      headers: Object.assign({ "Content-Type": "application/json" }, await authHeaders()),
      body: JSON.stringify({
        storeCode: store.storeCode,
        storeName: store.storeName,
        storePhotoCount: (work.storeImages || []).length,
        storeRemark: work.storeRemark,
        finalRemark: work.finalRemark,
        elements: (work.elements || []).map((e) => ({
          type: e.type, surface: e.surface, width: e.width, height: e.height, total: e.total,
          withoutMarkCount: (e.imagesWithoutMark || []).length,
          withMarkCount: (e.imagesWithMark || []).length,
          remark: e.remark
        }))
      })
    });
    return { ok: r.ok };
  } catch (e) {
    return { ok: false, offline: true };
  }
}

// build a .pptx via the backend; returns { fileName, base64 } or throws
export async function buildReport(store, work) {
  if (!BASE) { const err = new Error("no-backend"); err.code = "no-backend"; throw err; }
  const r = await fetch(BASE + "/report", {
    method: "POST",
    headers: Object.assign({ "Content-Type": "application/json" }, await authHeaders()),
    body: JSON.stringify({ store, work })
  });
  if (!r.ok) throw new Error("report-failed");
  return await r.json();
}
