# /bin/bash
# /usr/bin/caddy run --environ --config /etc/caddy/Caddyfile > /tmp/caddy.log 2>&1 &
# /usr/bin/caddy run --environ --config /etc/caddy/Caddyfile
nginx -c /etc/nginx/nginx.conf

if [ -d "/etc/envs" ]; then
    cp /etc/envs/server.env /dnscontrol-webui/apps/server/.env
fi

cd /dnscontrol-webui/apps/server && node ./dist/main.js