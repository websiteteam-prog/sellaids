/* Data layer. Uses the backend when API_BASE is set, else offline demo data. */
import { API_BASE } from "./config";
import { DATA } from "./data";
import { getToken, setToken, getDone, markDone } from "./storage";

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
  const fallback = { elementTypes: DATA.elementTypes };
  if (!BASE) return fallback;
  try {
    const r = await fetch(BASE + "/master", { headers: await authHeaders() });
    if (r.ok) return await r.json();
  } catch (e) {}
  return fallback;
}

// stores whose recce is NOT yet done
export async function getStores() {
  if (!BASE) {
    const done = await getDone();
    return DATA.stores.filter((s) => !done[s.storeCode]);
  }
  try {
    const r = await fetch(BASE + "/stores", { headers: await authHeaders() });
    if (r.ok) return await r.json();  // backend already excludes done stores
  } catch (e) {}
  const done = await getDone();
  return DATA.stores.filter((s) => !done[s.storeCode]);
}

// submit a completed recce (store + user + full work incl photos).
// Online: backend saves it, generates the PPT and marks the store done.
export async function submitRecce(store, work, user) {
  if (!BASE) {
    await markDone(store.storeCode);
    return { ok: true, offline: true };
  }
  try {
    const r = await fetch(BASE + "/recce/submit", {
      method: "POST",
      headers: Object.assign({ "Content-Type": "application/json" }, await authHeaders()),
      body: JSON.stringify({
        store,
        user: { empCode: user.empCode, name: user.name },
        work
      })
    });
    if (r.ok) { await markDone(store.storeCode); return { ok: true }; }
    return { ok: false };
  } catch (e) {
    await markDone(store.storeCode);
    return { ok: false, offline: true };
  }
}
