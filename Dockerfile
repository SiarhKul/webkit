# Multi-stage Dockerfile for production-ready Node.js + TypeScript

# 1) Builder: install all deps (incl. dev) and compile TS -> JS
FROM node:22-alpine AS builder
WORKDIR /usr/src/app

# Copy lockfiles first for better layer caching
COPY package*.json ./
RUN npm ci

# Copy only sources needed for build
COPY tsconfig.json ./
COPY src ./src

# Compile TypeScript to ./build
RUN npm run build

# 2) Runtime: install only production deps and run compiled JS
FROM node:22-alpine AS runner
ENV NODE_ENV=production
WORKDIR /usr/src/app

# Install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts

# Copy compiled app from builder
COPY --from=builder /usr/src/app/build ./build

# Expose the port the app listens on (see src/app.ts -> port = 3002)
EXPOSE 8080

# Start compiled application
CMD ["node", "build/main.js"]
