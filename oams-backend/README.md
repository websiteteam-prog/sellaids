# OAMS Backend + Admin Panel (dummy database)

Node + Express backend with a **db.json dummy database** (no MySQL/XAMPP needed).
Serves the **User API** for the app AND a web **Admin Panel**.

## Run (2 steps)
```bash
cd oams-backend
npm install      # first time
npm start
```
- **Admin Panel:** http://localhost:4000/admin  → login **admin / admin**
- **User app login:** `EMP1024 / 1234` (users are managed from the Admin Panel)

## What the Admin Panel does
- **Recces tab** — every submitted store recce: store, **which user did it (name + ID)**,
  city, category, photo/element counts, date, and a **⬇ PPT download**.
  Filters: search store, user, city, category, from/to date.
- **Users tab** — **add / delete users**, set their password and mode (full user management).

## Flow
1. User logs in on the app (Recce mode) → picks a store → uploads store photos + adds
   elements (type, W×H, photos, remark) → **Submit**.
2. On submit the backend **saves the recce, generates the PPT** (`reports/<id>.pptx`),
   and the store is **removed from the user's list**.
3. Admin sees the recce in the panel and downloads the PPT.

## API
| Method | URL | Who |
|---|---|---|
| POST | `/api/login` | user login |
| GET  | `/api/master` | element types |
| GET  | `/api/stores` | stores whose recce is not done |
| POST | `/api/recce/submit` | submit a recce (saves + builds PPT) |
| POST | `/api/admin/login` | admin login |
| GET  | `/api/admin/recces` | list recces (filters: q,user,city,category,from,to) |
| GET  | `/api/admin/recces/:id/ppt` | download the PPT |
| GET/POST/DELETE | `/api/admin/users` | manage users |

## Edit the dummy database
Open **`db.json`**: `admins`, `users`, `stores`, `elementTypes`. Restart after editing.
Generated PPTs are written to `reports/` (git-ignored).

## Connect the app
In `oams-rn/src/config.js` set `API_BASE`:
- Android emulator: `http://10.0.2.2:4000/api`
- Real phone (same WiFi): `http://<your-PC-IP>:4000/api`

Move to real MySQL later by replacing `loadDB()/saveDB()` with DB queries — the API stays the same.
