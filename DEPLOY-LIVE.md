# Hanu Multimedia — Going LIVE on a VPS (step by step)

You need: your **VPS IP**, its **root/SSH login**, and your **domain**.
Total time ~30 min. Almost everything is done by one script.

The website will be your **Admin panel** (`https://yourdomain.com/admin`);
field users do the recce in the **mobile app**, which talks to the same server.

---

## Step 1 — Point your domain at the VPS (do this first)
In your **domain provider's DNS** settings, add two **A records** to your VPS IP:

| Type | Name | Value |
|------|------|-------|
| A | `@`   | `YOUR_VPS_IP` |
| A | `www` | `YOUR_VPS_IP` |

(DNS can take 5–60 min to spread. You can continue meanwhile.)

## Step 2 — Log in to the VPS
On Windows PowerShell (or PuTTY):
```
ssh root@YOUR_VPS_IP
```
Enter the root password when asked.

## Step 3 — Put the project on the server
Easiest: upload the **project ZIP** with **FileZilla** (SFTP) to `/root/`, then:
```
apt-get install -y unzip
cd /root && unzip Hanu-Multimedia-FINAL.zip -d hanu
```
(You should now have `/root/hanu/oams-backend` and `/root/hanu/deploy-vps.sh`.)

## Step 4 — Run the one-shot setup
```
cd /root/hanu
bash deploy-vps.sh yourdomain.com
```
This installs Node + MySQL + PM2 + Nginx, creates the database, sets `.env`,
and starts the backend 24×7. When it finishes it prints your admin URL.

Check: open **http://yourdomain.com/admin** → admin panel (login `admin` / `admin`).

## Step 5 — Turn on HTTPS (free)
Once the domain opens the site, run:
```
apt-get install -y certbot python3-certbot-nginx
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```
Pick “redirect”. Now **https://yourdomain.com/admin** works with the lock 🔒.

## Step 6 — Connect the mobile app to the live server
In `oams-rn/src/config.js` set:
```js
let base = "https://yourdomain.com/api";
```
Rebuild the APK (push to GitHub → the Action builds it → download from the
Release). Now the app’s submissions go straight to your live DB and show up
in the admin panel.

---

## Everyday things
- **Change admin password / add field users:** Admin panel → Users.
- **Import dealers:** Admin panel → Dealers / Import (your Excel).
- **See recces + download PPT/Excel/ZIP:** Admin panel → Recces (with filters).
- **Restart backend after a code change:** `pm2 restart hanu`
- **See backend logs:** `pm2 logs hanu`
- **Update code later:** upload new files (or `git pull`) → `cd oams-backend && npm install` → `pm2 restart hanu`.

## If something doesn’t work
- Site not opening → DNS not ready yet, or firewall. Allow ports 80/443:
  `ufw allow 80 && ufw allow 443` (if `ufw` is on).
- Backend status: `pm2 status` ; restart: `pm2 restart hanu`.
- The `.env` password is in `oams-backend/.env` (auto-generated) — keep it safe.
