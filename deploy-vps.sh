#!/usr/bin/env bash
# =====================================================================
# Hanu Multimedia — ONE-SHOT live setup for an Ubuntu VPS.
# Installs Node + MariaDB + PM2 + Nginx, configures the backend and
# starts it 24x7 behind your domain (HTTP). Then run certbot for HTTPS.
#
#   Run as root:   bash deploy-vps.sh yourdomain.com
# =====================================================================
set -e
DOMAIN="$1"
if [ -z "$DOMAIN" ]; then echo "Usage: bash deploy-vps.sh yourdomain.com"; exit 1; fi
HERE="$(cd "$(dirname "$0")" && pwd)"
APP="$HERE/oams-backend"
if [ ! -f "$APP/server.js" ]; then echo "ERROR: oams-backend/server.js not found next to this script."; exit 1; fi

echo "==> 1/6  System packages"
export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get install -y ca-certificates curl gnupg git nginx openssl

echo "==> 2/6  Node.js 20"
if ! command -v node >/dev/null 2>&1; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi
node -v

echo "==> 3/6  MariaDB (database) + app DB user"
apt-get install -y mariadb-server
systemctl enable --now mariadb
DBPASS="$(openssl rand -hex 16)"
mysql -e "CREATE DATABASE IF NOT EXISTS oams CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;"
mysql -e "CREATE USER IF NOT EXISTS 'oamsuser'@'localhost' IDENTIFIED BY '${DBPASS}';"
mysql -e "ALTER USER 'oamsuser'@'localhost' IDENTIFIED BY '${DBPASS}';"
mysql -e "GRANT ALL PRIVILEGES ON oams.* TO 'oamsuser'@'localhost'; FLUSH PRIVILEGES;"

echo "==> 4/6  Backend install + .env"
cd "$APP"
npm install --omit=dev
cat > .env <<EOF
PORT=4000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=oams
DB_USER=oamsuser
DB_PASSWORD=${DBPASS}
EOF

echo "==> 5/6  PM2 (keep the backend running 24x7)"
npm install -g pm2
pm2 delete hanu >/dev/null 2>&1 || true
pm2 start server.js --name hanu
pm2 save
env PATH=$PATH pm2 startup systemd -u root --hp /root | tail -n 1 | bash || true

echo "==> 6/6  Nginx reverse proxy for ${DOMAIN}"
cat > /etc/nginx/sites-available/hanu <<EOF
server {
    listen 80;
    server_name ${DOMAIN} www.${DOMAIN};
    client_max_body_size 100M;
    location / {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF
ln -sf /etc/nginx/sites-available/hanu /etc/nginx/sites-enabled/hanu
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

echo ""
echo "==================================================================="
echo " DONE (HTTP).  Backend is LIVE."
echo "   Admin panel:  http://${DOMAIN}/admin     (login: admin / admin)"
echo "   App API base: http://${DOMAIN}/api"
echo "   DB user oamsuser  |  password saved in oams-backend/.env"
echo ""
echo " NEXT — turn on HTTPS (free, recommended). After your domain's DNS"
echo " points to this server, run:"
echo "   apt-get install -y certbot python3-certbot-nginx"
echo "   certbot --nginx -d ${DOMAIN} -d www.${DOMAIN}"
echo "==================================================================="
