FROM node:18.19.0-bullseye

RUN apt update -y

RUN apt install -y nginx

RUN apt install -y --no-install-recommends tini

#RUN  /usr/bin/caddy run --environ --config /etc/caddy/Caddyfile

# 获取最新版本号
WORKDIR /
# 最新版地址：
RUN git clone https://github.com/velor2012/dnscontrol-webui.git
WORKDIR /dnscontrol-webui
# RUN cd dnscontrol-webui && npm install -g pnpm
# RUN cd dnscontrol-webui && pnpm install && pnpm build
RUN cd apps/server && cp .env.example .env
RUN cd apps/front && cp .env.example .env
RUN npm install -g pnpm
RUN pnpm install
RUN pnpm build

COPY ./installDnscontrol.sh ./installDnscontrol.sh
RUN bash ./installDnscontrol.sh
#RUN mv /etc/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf.bk
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY ./start.sh ./start.sh
ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["bash", "start.sh"]