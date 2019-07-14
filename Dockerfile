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

#docker run --env SPREADSHEET_ID=$SPREADSHEET_ID \
#           --env CLIENT_EMAIL=$CLIENT_EMAIL \
#           --env SHEET_ID=$SHEET_ID \
#           --env PRIVATE_KEY=$PRIVATE_KEY boa-api:1.0.0