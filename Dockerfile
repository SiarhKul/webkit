# syntax=docker/dockerfile:1

# Base deps (кэшируем npm ci)
FROM node:22-alpine AS deps
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

# Build (TS -> JS)
FROM node:22-alpine AS build
WORKDIR /usr/src/app

COPY package*.json ./
COPY --from=deps /usr/src/app/node_modules ./node_modules

COPY tsconfig.json ./
COPY src ./src

RUN npm run build

# Production runtime
FROM node:22-alpine AS prod
WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force

COPY --from=build /usr/src/app/build ./build

EXPOSE 3002

CMD ["node", "build/src/main.js"]

# Development runtime (hot reload)
FROM node:22-alpine AS dev
WORKDIR /usr/src/app

ENV NODE_ENV=development

COPY package*.json ./
RUN npm install

COPY tsconfig.json ./
COPY src ./src

EXPOSE 3002

CMD ["npm", "run", "start:dev"]
