# Hanu Multimedia — Deploy on cPanel (no SSH needed)

Your backend is **Node.js**. cPanel can run it using **"Setup Node.js App"**
(also called *Node.js Selector* / *Application Manager*). If your cPanel does
NOT have that icon, your plan is PHP-only and can't run this app — use the
**VPS route** in `DEPLOY-LIVE.md` instead.

The website will be your **Admin panel** (`https://yourdomain.com/admin`);
field users do the recce in the **mobile app**, which talks to the same server.

---

## Step 1 — Upload the project
1. cPanel → **File Manager**.
2. Go to your **home directory** (NOT `public_html`). Create a folder `hanu`.
3. Upload `Hanu-Multimedia-FINAL.zip` into `hanu`, then **Extract** it.
   You should now have: `hanu/oams-backend/server.js` etc.

## Step 2 — Create the MySQL database
1. cPanel → **MySQL® Databases**.
2. **Create New Database** → name it `oams`
   (real name becomes something like `cpuser_oams` — note it down).
3. **Add New User** → e.g. `oamsuser` + a strong password
   (real name becomes `cpuser_oamsuser` — note it + the password).
4. **Add User To Database** → select the user + DB → tick **ALL PRIVILEGES**.

## Step 3 — Create the Node.js app
1. cPanel → **Setup Node.js App** → **Create Application**.
2. **Node.js version:** 20 (or 18 if 20 isn't there).
3. **Application mode:** Production.
4. **Application root:** `hanu/oams-backend`  (the folder with `server.js`).
5. **Application URL:** your domain `yourdomain.com` (the root).
6. **Application startup file:** `server.js`.
7. Click **Create**.

## Step 4 — Set environment variables (database connection)
On the app's page, under **Environment variables**, add these (do NOT set PORT —
cPanel sets it automatically):

| Name        | Value                    |
|-------------|--------------------------|
| DB_HOST     | `localhost`              |
| DB_PORT     | `3306`                   |
| DB_NAME     | `cpuser_oams`  (your real DB name)   |
| DB_USER     | `cpuser_oamsuser` (your real user)   |
| DB_PASSWORD | (the password you set)   |

Click **Save**.

## Step 5 — Install packages & start
1. On the same page click **Run NPM Install** (installs express, mysql2,
   pptxgenjs, xlsx, archiver …). Wait until it finishes.
2. Click **Restart** (or Start).

Open **https://yourdomain.com/** → it redirects to the admin panel.
Login: `admin` / `admin`. The database tables are created automatically on
first start.

## Step 6 — HTTPS (SSL)
Most cPanel hosts give free SSL (**AutoSSL / Let's Encrypt**):
cPanel → **SSL/TLS Status** → tick your domain → **Run AutoSSL**.
When the lock 🔒 shows on `https://yourdomain.com`, the mobile app can connect
(the app is built for HTTPS).

## Step 7 — Connect the mobile app
The APK is already built for `https://yourdomain.com/api`. Just make sure
Step 6 (SSL) is done, install the APK, and submissions will flow into the
admin panel.

---

## Everyday things
- **Import dealers:** Admin panel → Dealers / Import (your Excel).
- **See recces + PPT/Excel/ZIP:** Admin panel → Recces (with filters).
- **After you change code / env vars:** Setup Node.js App → **Restart**.
- **Add field users / change admin password:** Admin panel → Users.

## If something doesn't work
- **App won't start** → Setup Node.js App shows a log link; open it. Usually a
  wrong DB_NAME/DB_USER/DB_PASSWORD. Fix the env var → Restart.
- **502 / app crashed on DB** → re-check Step 2 privileges (ALL PRIVILEGES) and
  that DB_NAME/DB_USER are the *real* prefixed names (`cpuser_...`).
- **Photo submit fails (error 413)** → your host limits upload size. Ask host to
  raise it, or add to `hanu/oams-backend/.htaccess`: `LimitRequestBody 0`.
- **No "Setup Node.js App" icon** → your hosting is PHP-only; use the VPS route
  in `DEPLOY-LIVE.md`.
