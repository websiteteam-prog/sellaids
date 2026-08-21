# OAMS — Run on App **and** Website

Same project, two faces:

| Part | Folder | What it is |
|------|--------|-----------|
| Field app (Android APK **and** Website) | `oams-rn/` | What field users use to do a recce |
| Backend + Admin panel + Excel import + PPT | `oams-backend/` | The engine + the admin's control room |

All wording in the app and website is in **English**.

---

## 1) Backend — the engine behind both

### Option A — Local quick test (no MySQL, uses `db.json`)
```
cd oams-backend
npm install
npm start
```
- API: `http://localhost:4000/api`
- Admin panel: `http://localhost:4000/admin`  (login **admin / admin**)
- App user login: **EMP1024 / 1234**

### Option B — Real database (MySQL / VPS)
Import `oams-backend/schema.sql`, create `oams-backend/.env` with `DB_HOST`, `DB_USER`,
`DB_PASSWORD`, `DB_NAME`, then `npm start`. Full steps: `oams-backend/LOCAL-SETUP.md`
(XAMPP) and `oams-backend/DEPLOY-VPS.md` (server).

---

## 2) Website (field app in the browser + admin panel)

**Build the field-app website once (and after any edit):**
```
cd oams-rn
npm install
npm run build:web
```
This outputs the website into `oams-backend/webapp/`.

**Now start the backend** (`cd oams-backend && npm start`) and open:
- **Field app website:** `http://localhost:4000/`
- **Admin panel:** `http://localhost:4000/admin`

The website is served from the **same URL** as the API, so it **auto-connects** to the
backend — no configuration needed. On a VPS with your domain, the one backend serves the
website + admin + API together (e.g. `https://your-domain.com/`, `/admin`, `/api`).

> Note: camera & GPS work through the browser on the website (they need HTTPS + the
> user to allow permission). On the phone **app**, they use the native camera/GPS.

---

## 3) Mobile App (APK)

- **Editable source:** `oams-rn/` (edit `src/…`, then rebuild).
- **Connect the APK to your backend:** open `oams-rn/src/config.js` and set `API_BASE`:
  - Real phone on same WiFi: `"http://<your-PC-LAN-IP>:4000/api"`
  - Hosted server: `"https://your-domain.com/api"`
  - Leave `""` to run offline with demo data.
- **Build the APK:** push to GitHub → the Action builds it → download the standalone app from
  Releases → `oams-field-app-rn.apk`.
- **Live-edit on the phone / browser:** see `LIVE-EDIT.md`.

---

## 4) Excel import — how the admin adds dealers + elements

In the **Admin panel → “Dealers / Import”** tab:

1. Click **“Download blank template”**. Columns (client's format):
   `BRAND · SR. NO. · DEALER CODE · DEALER NAME · ADDRESS · CITY · CONTACT NO. · ELEMENT · WIDTH (INCH) · HEIGHT (INCH) · QTY · SQFT · REMARKS`
2. Fill it — **one row per element**. A dealer with many elements = many rows; put the
   dealer details on the first row and you can **leave the dealer cells blank on the next
   rows** (the importer carries them forward). `SQFT` can be left blank — it is auto-calculated
   as **W × H × Qty ÷ 144**.
3. Click **“Upload & Import”**.
   - New dealers are **added**; an existing **Dealer Code** is **updated** and its element
     list is refreshed.

---

## The full flow

```
Admin fills Excel  →  Upload in Admin panel
        ↓
Dealers + planned elements saved
        ↓
Field user opens the dealer (app OR website)
   → elements are already listed (type, W×H, Qty, SQFT)
   → user adds photo(s) + a remark for each element
   → Submit
        ↓
PPT is generated on the backend
        ↓
Admin panel → "Recces": see the completed recce (which user, store, filters)
   → download the PPT.
A dealer that is done drops off the field user's list.
```
