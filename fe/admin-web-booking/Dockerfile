FROM node:18-alpine

WORKDIR /web-admin

COPY package.json ./
COPY yarn.lock ./
COPY src ./src
COPY public ./public

RUN apk add --no-cache tzdata
RUN yarn install --production

EXPOSE 3000