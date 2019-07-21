FROM node:11.13-slim
FROM keymetrics/pm2:latest-alpine

WORKDIR /app

COPY . /app

RUN npm install

EXPOSE 80

ENV NODE_ENV production

ENV PORT 80

RUN npm run build

CMD pm2-runtime dist/server.js
