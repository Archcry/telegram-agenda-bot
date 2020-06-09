# Builder image
FROM node:14-alpine AS builder
WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./

RUN npm ci

COPY tsconfig.json ./
COPY src src

RUN npm run build

# Clean the build (remove all ts files)
FROM node:14-alpine AS cleaner
WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/. ./

RUN find . -name "*.ts" -type f -delete

# Actual image
FROM node:14-alpine
WORKDIR /usr/src/app

ENV NODE_ENV=production

RUN chown node:node .
USER node

COPY package.json ./
COPY package-lock.json ./

RUN npm ci --only=production

COPY --from=cleaner /usr/src/app/src ./src

ENTRYPOINT [ "node", "./src/index.js" ]
