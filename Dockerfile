FROM node:19.0.0-alpine AS builder

WORKDIR /opt/app

ADD package.json ./
ADD package-lock.json ./
# ADD jsconfig.json ./

RUN npm install

COPY src/ ./src
COPY craco.config.js ./craco.config.js
COPY public/ ./public
COPY tsconfig.json ./tsconfig.json
COPY tsconfig.paths.json ./tsconfig.paths.json
COPY tsconfig.paths.json ./tsconfig.paths.json
# COPY .env ./.env

RUN npm run build

FROM nginx:alpine

COPY --from=builder /opt/app/build /opt/app/build

RUN echo $'server {\n\
    listen 80;\n\
    root /opt/app/build/;\n\
    gzip on;\n\
    gzip_types text/plain application/xml application/javascript application/json text/html text/css;\n\
    location ~* ^.+.(js|css|png|jpg|jpeg|gif|ico|svg|ttf)$ {\n\
        # access_log        off;\n\
        expires           max;\n\
    }\n\
    location ^~ /env.js {\n\
        add_header Last-Modified $date_gmt;\n\
        add_header Cache-Control \'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0\';\n\
        if_modified_since off;\n\
        expires off;\n\
        etag off;\n\
    }\n\
    location / {\n\
        add_header Last-Modified $date_gmt;\n\
        add_header Cache-Control \'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0\';\n\
        if_modified_since off;\n\
        expires off;\n\
        etag off;\n\
        try_files $uri $uri/ /index.html?$args;\n\
    }\n\
}' > /etc/nginx/conf.d/default.conf

