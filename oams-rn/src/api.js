/* Data layer. Uses the backend when API_BASE is set, else the offline demo data. */
import { API_BASE } from "./config";
import { DATA } from "./data";
import { getToken, setToken, getDone, markDone, getSavedWork, saveWork } from "./storage";

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
  const fallback = { materials: DATA.materials, locations: DATA.locations };
  if (!BASE) return fallback;
  try {
    const r = await fetch(BASE + "/master", { headers: await authHeaders() });
    if (r.ok) return await r.json();
  } catch (e) {}
  return fallback;
}

export async function getTickets(module) {
  const done = await getDone();
  const localFiltered = (DATA.tickets[module] || []).filter((t) => !done[t.ticketNo]);
  if (!BASE) return localFiltered;
  try {
    const r = await fetch(BASE + "/tickets?module=" + encodeURIComponent(module), { headers: await authHeaders() });
    if (r.ok) {
      const list = await r.json();
      return list.filter((t) => !done[t.ticketNo]);
    }
  } catch (e) {}
  return localFiltered;
}

export async function submitRecce(module, ticketNo, work) {
  await saveWork(ticketNo, work);
  await markDone(ticketNo);
  if (!BASE) return { ok: true, offline: true };
  try {
    const r = await fetch(BASE + "/recce/" + encodeURIComponent(ticketNo) + "/save", {
      method: "POST",
      headers: Object.assign({ "Content-Type": "application/json" }, await authHeaders()),
      body: JSON.stringify({
        module,
        photoAddress: work.photoAddress, coords: work.coords,
        remarks: work.storeRemarks, hasPhoto: !!work.photo, items: work.items
      })
    });
    return { ok: r.ok };
  } catch (e) {
    return { ok: false, offline: true };
  }
}

// build a .pptx via the backend; returns { fileName, base64 } or throws
export async function buildReport(module, entries) {
  if (!BASE) {
    const err = new Error("no-backend");
    err.code = "no-backend";
    throw err;
  }
  const r = await fetch(BASE + "/report", {
    method: "POST",
    headers: Object.assign({ "Content-Type": "application/json" }, await authHeaders()),
    body: JSON.stringify({ module, entries })
  });
  if (!r.ok) throw new Error("report-failed");
  return await r.json();
}

export { getSavedWork };
