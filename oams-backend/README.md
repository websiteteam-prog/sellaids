# OAMS Demo Backend (dummy database)

A tiny Node server that connects the OAMS Field App to a **dummy database**
(`db.json`) — no MySQL, no cloud, no setup. Perfect for testing and for editing
data in a normal code editor.

## Run it (2 steps)

```bash
cd oams-backend
npm install      # first time only
npm start
```

Then open **http://localhost:4000** in your browser.
The app loads AND is connected to this backend automatically.

**Test login:** `EMP1024` / `1234`  (all logins are in `db.json`)

## Edit the dummy database

Open **`db.json`** in any editor and change:

- `users`     — who can log in (empCode + password + name)
- `tickets`   — the Recce / FAS / GSB / Installation tickets shown in the app
- `materials` — the Material Name dropdown list
- `locations` — the Location dropdown list

Save the file and **restart the server** (`Ctrl+C`, then `npm start`).
When you save a recce from the app, it is written into `submissions` in `db.json`.

## API endpoints

| Method | URL | Purpose |
|--------|-----|---------|
| POST | `/api/login` | validate empCode + password |
| GET  | `/api/master` | materials + locations |
| GET  | `/api/tickets?module=recce` | tickets for a module |
| POST | `/api/recce/:ticketNo/save` | save a completed recce |
| GET  | `/api/reports` | everything saved so far |

## Make the installed APK use this backend

The APK runs offline by default. To point it at a backend:

1. Host this server on a public URL (Railway / Render / your own hosting).
2. Put that URL in **`oams-mobile/www/js/config.js`**:
   ```js
   window.OAMS_CONFIG = { API_BASE: "https://your-host.com/api" };
   ```
3. Push to the branch → GitHub Actions rebuilds a new APK that talks to your DB.

## Moving to a real database later

Swap the `loadDB()` / `saveDB()` calls in `server.js` for real database queries
(e.g. MySQL via Sequelize — the same stack already used in `sellaids/server`).
The app and the API contract stay exactly the same.
