#FROM markuman/xmysql:0.4.2

FROM node:12-alpine

LABEL team="platform" category="services.data"

WORKDIR ./app

RUN npm install -g xmysql

EXPOSE 80