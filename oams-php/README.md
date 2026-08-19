# OAMS PHP + MySQL Backend (for cPanel)

The OAMS backend rewritten in **PHP + MySQL** so it runs on any shared cPanel
hosting. Same API as before, so the app works unchanged — just point it here.
Includes the **Admin Panel** and server-side **PPT** generation (PhpPresentation).

The mobile app never talks to MySQL directly:
`📱 App → (https) → this PHP backend → MySQL`.

---

## Step-by-step cPanel deployment

### 1) Create the MySQL database (cPanel → "MySQL® Databases")
1. **Create New Database** → e.g. `oams` → full name becomes `cpuser_oams`.
2. **Add New User** → e.g. `oamsadmin` + a strong password → `cpuser_oamsadmin`.
3. **Add User To Database** → select the user + database → tick **ALL PRIVILEGES**.
4. Note down: **DB name**, **DB user**, **password** (host is usually `localhost`).

### 2) Edit `config.php`
Set:
```php
'driver'   => 'mysql',
'host'     => 'localhost',
'name'     => 'cpuser_oams',
'user'     => 'cpuser_oamsadmin',
'password' => 'your_db_password',
```

### 3) Upload the files (File Manager or FTP)
Upload the **whole `oams-php` folder** into `public_html`, e.g. to
`public_html/oams-api/`. Make sure you include **`vendor/`**, **`.htaccess`**,
all `.php` files, and the `admin/` folder. (`reports/` and `data/` are created
automatically — the folder just needs write permission, which public_html has.)

> PHP version: in cPanel → **"Select PHP Version" / MultiPHP Manager** pick **8.0+**,
> and make sure extensions **gd**, **zip**, **pdo_mysql**, **mbstring** are enabled.

### 4) Test it
- Open `https://yourdomain.com/oams-api/` → should show `{"ok":true,...}`.
  (Tables + demo data are created automatically on the first request.)
- Open `https://yourdomain.com/oams-api/admin/` → **Admin Panel**, login **admin / admin**.

### 5) Connect the app
Your API base URL is: **`https://yourdomain.com/oams-api`**
Put it in `oams-rn/src/config.js`:
```js
export const API_BASE = "https://yourdomain.com/oams-api";
```
Then rebuild the APK (or send me this URL and I'll rebuild it for you). The new
APK will talk to your **live MySQL** through this backend.

---

## Default logins (change these!)
- **Admin panel:** `admin / admin`  (row in the `admins` table)
- **App users:** `EMP1024 / 1234`, `EMP2048 / 1234` (manage from the Admin Panel → Users)

## API (same as the Node backend)
`POST /login`, `GET /master`, `GET /stores`, `POST /recce/submit`,
`POST /admin/login`, `GET /admin/recces` (filters q,user,city,category,from,to),
`GET /admin/recces/{id}/ppt`, `GET/POST/DELETE /admin/users`, `GET /admin/filters`.

## Local testing (optional, no MySQL needed)
```bash
cd oams-php
OAMS_DRIVER=sqlite php -S 127.0.0.1:8099 index.php
# http://127.0.0.1:8099/            -> API health
# http://127.0.0.1:8099/admin/      -> admin panel (admin/admin)
```

## Files
- `index.php` — API router      · `db.php` — PDO + schema + seed
- `report.php` — PPT builder     · `config.php` — DB credentials
- `admin/index.html` — Admin Panel · `vendor/` — PhpPresentation (do not delete)
- Generated reports are stored in `reports/` (auto-created).
