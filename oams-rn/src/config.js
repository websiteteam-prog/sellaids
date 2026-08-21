/* =========================================================================
 * CONFIG — connect the app to your backend.
 *
 *   API_BASE = ""   -> app runs fully OFFLINE using bundled demo data (data.js)
 *
 *   MOBILE APK — set API_BASE to your backend, e.g.:
 *     • Android emulator:  "http://10.0.2.2:4000/api"   (10.0.2.2 = your PC)
 *     • Real phone on same WiFi:  "http://<your-PC-LAN-IP>:4000/api"
 *     • Hosted server:  "https://your-server.com/api"
 *
 *   WEBSITE — when the web build is served BY the backend (same URL),
 *   it auto-uses that origin + "/api", so you don't need to set anything.
 *
 * PPT report + Excel import need a backend (API_BASE set); offline shows demo data.
 * ========================================================================= */

// Set this for the mobile APK to talk to your backend. Leave "" for offline.
let base = "";

// On the WEBSITE: if not set above, use the same origin the site is served from
// (so the field-app website served by the backend connects automatically).
if (!base && typeof window !== "undefined" && window.location && window.location.origin
    && /^https?:/.test(window.location.origin)) {
  base = window.location.origin + "/api";
}

export const API_BASE = base;
