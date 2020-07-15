FROM node:12-alpine

COPY ./src /app

RUN chown node -R /app

WORKDIR /app

RUN npm ci --only=production

EXPOSE 3001

CMD [ "npm", "start" ]