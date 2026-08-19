# Go Live on your VPS — Node + MySQL (step by step)

Goal:  `📱 APK → https://api.yourdomain.com → Node backend → MySQL` — all on your VPS.

Assumes **Ubuntu 22.04** VPS with SSH access. Commands are copy-paste ready.
(If you have no domain yet, you can still test over `http://<VPS-IP>:4000` — but for
a real APK you want https, which needs a domain. See Step 7.)

---

## 1) SSH into the VPS
```bash
ssh root@YOUR_VPS_IP
```

## 2) Install Node.js 20, MySQL, PM2, Nginx
```bash
# Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# MySQL + Nginx + git
apt-get install -y mysql-server nginx git
npm install -g pm2
```

## 3) Create the MySQL database + user
```bash
mysql
```
Then inside the MySQL prompt (change the password):
```sql
CREATE DATABASE oams CHARACTER SET utf8mb4;
CREATE USER 'oamsuser'@'localhost' IDENTIFIED BY 'StrongPass#123';
GRANT ALL PRIVILEGES ON oams.* TO 'oamsuser'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

## 4) Get the backend onto the VPS
```bash
mkdir -p /var/www && cd /var/www
# option A: upload the oams-backend folder via SFTP/scp, OR
# option B: clone the repo and copy the folder:
# git clone <your-repo-url> oams && cp -r oams/oams-backend ./oams-backend
cd oams-backend
npm install --omit=dev
```

## 5) Configure the database connection (.env)
```bash
cp .env.sample .env
nano .env
```
Set:
```
PORT=4000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=oams
DB_USER=oamsuser
DB_PASSWORD=StrongPass#123
```
(As soon as `DB_HOST` is set, the backend uses **MySQL** and auto-creates the
tables + demo data on first start.)

## 6) Start it with PM2 (keeps running + restarts on reboot)
```bash
pm2 start server.js --name oams
pm2 save
pm2 startup    # run the command it prints
```
Test locally on the VPS:
```bash
curl http://localhost:4000/api/stores      # should return JSON
```

## 7) Point a domain + HTTPS (recommended)
Point a DNS **A record** e.g. `api.yourdomain.com` → your VPS IP. Then:
```bash
# Nginx reverse proxy
cat >/etc/nginx/sites-available/oams <<'NGINX'
server {
    server_name api.yourdomain.com;
    client_max_body_size 100M;   # photos are big
    location / {
        proxy_pass http://127.0.0.1:4000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
NGINX
ln -s /etc/nginx/sites-available/oams /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

# free HTTPS via Let's Encrypt
apt-get install -y certbot python3-certbot-nginx
certbot --nginx -d api.yourdomain.com
```

Now your live API base is: **`https://api.yourdomain.com/api`**
Admin panel: **`https://api.yourdomain.com/admin`** (login `admin / admin`).

## 8) Connect the APP to it
In `oams-rn/src/config.js`:
```js
export const API_BASE = "https://api.yourdomain.com/api";
```
Then rebuild the APK:
- **Easiest:** commit + push to GitHub → the Action builds a new APK →
  download from the `oams-rn-latest` Release.
- Or build locally (see `oams-rn/README.md`).

Install that APK → login `EMP1024 / 1234` → do a recce → it saves to your **live
MySQL**, and shows up in the **admin panel** with a downloadable PPT. 🎉

---

## Handy PM2 commands
```bash
pm2 logs oams        # view logs
pm2 restart oams     # after code/.env changes
pm2 list             # status
```

## Security checklist (before real use)
- Change the **admin** password (in the `admins` table) and the demo users.
- Keep `.env` private (never commit it).
- MySQL user has access to only the `oams` database (as set above).
- Make sure the firewall allows 80/443 (and not 4000 publicly if using Nginx):
  `ufw allow 'Nginx Full'`.

## No domain yet? (quick test)
Open port 4000 and use the IP directly (http only — fine for testing, not for a
Play-Store APK): set `API_BASE = "http://YOUR_VPS_IP:4000/api"` and
`ufw allow 4000`. The installed APK already allows http (cleartext) for this.
