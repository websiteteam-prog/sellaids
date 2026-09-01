# Local setup — MySQL on your own machine (XAMPP)

Run the database + backend on your PC/local server, and connect the APK to it
over your WiFi.  `📱 APK → (WiFi) → Node backend (your PC) → MySQL (your PC)`

---

## 1) Install a local MySQL (easiest: XAMPP)
- Download **XAMPP** → install → open **XAMPP Control Panel**.
- Click **Start** on **MySQL** (and Apache, so you get phpMyAdmin).
- (XAMPP’s MySQL default user is `root` with **empty** password.)

## 2) Create the database (import `schema.sql`)
Open **phpMyAdmin**: http://localhost/phpmyadmin
- Left side → **New** → this creates a DB, OR just use Import which creates it.
- Top menu → **Import** → choose **`schema.sql`** → **Go**.
- You’ll now see the **`oams`** database with tables: `admins, users, stores,
  element_types, submissions` (with demo data). ✅

> CLI alternative: `mysql -u root < schema.sql`

## 3) Point the backend at your local MySQL
In the `oams-backend` folder:
```bash
cp .env.sample .env
```
Edit **`.env`**:
```
PORT=4000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=oams
DB_USER=root
DB_PASSWORD=            # leave empty for XAMPP default
```

## 4) Run the backend
```bash
cd oams-backend
npm install
npm start
```
You should see: `Hanu Multimedia backend running on port 4000  (mysql)` ✅
- Admin panel: **http://localhost:4000/admin**  (login `admin / admin`)
- Data lives in your **local MySQL** (see it live in phpMyAdmin).

## 5) Connect the APK (over WiFi)
The phone can’t use `localhost` — it needs your PC’s **LAN IP**.
- Find it: Windows → `ipconfig` → **IPv4 Address** (e.g. `192.168.1.5`).
- In `oams-rn/src/config.js`:
  ```js
  export const API_BASE = "http://192.168.1.5:4000/api";   // your PC IP
  ```
  (Android **emulator** instead: `http://10.0.2.2:4000/api`.)
- Rebuild the APK (push to GitHub → Actions → Release), install it.

**Must-haves for the phone to reach your PC:**
- Phone + PC on the **same WiFi** (phone mobile-data OFF).
- Windows Firewall: allow **Node.js** / port **4000** when it asks (or add a rule).
- The installed APK already allows http (cleartext) for LAN.

## 6) Verify the whole loop
1. App → login `EMP1024 / 1234` → pick a store → add photos + elements → **Submit**.
2. Open **phpMyAdmin → oams → submissions** — your recce row is there. 🎉
3. Open **http://localhost:4000/admin** → the recce shows (with the user) + **PPT download**.

---

## Notes
- The backend also **auto-creates** the tables if the DB is empty — so importing
  `schema.sql` is optional, but it’s the clean way to “set up the database”.
- Want NO MySQL for a quick test? Just don’t create `.env` (or leave `DB_HOST`
  empty) → the backend uses the bundled `db.json` file instead.
- Change the default `admin/admin` and demo users before real use.
