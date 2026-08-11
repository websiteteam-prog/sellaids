import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "oams_state_v1";

async function readAll() {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) { return {}; }
}
async function writeAll(obj) {
  try { await AsyncStorage.setItem(KEY, JSON.stringify(obj)); } catch (e) {}
}

export async function getToken() { return AsyncStorage.getItem("oams_token"); }
export async function setToken(t) { return AsyncStorage.setItem("oams_token", t || ""); }

export async function getDone() { return (await readAll()).done || {}; }
export async function markDone(ticketNo) {
  const all = await readAll();
  all.done = all.done || {};
  all.done[ticketNo] = true;
  await writeAll(all);
}

export async function getSavedWork() { return (await readAll()).work || {}; }
export async function saveWork(ticketNo, work) {
  const all = await readAll();
  all.work = all.work || {};
  all.work[ticketNo] = work;
  await writeAll(all);
}

export async function getRemember() { return (await readAll()).remember || ""; }
export async function setRemember(code) {
  const all = await readAll();
  all.remember = code;
  await writeAll(all);
}
