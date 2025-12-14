# Multi-stage Dockerfile for production-ready Node.js + TypeScript
# Supports both development (hot-reload) and production modes

ARG MODE=production

# 1) Builder: install all deps (incl. dev) and compile TS -> JS
FROM node:22-alpine AS builder
WORKDIR /usr/src/app

# Copy lockfiles first for better layer caching
COPY package*.json ./
RUN npm install

# Copy only sources needed for build
COPY tsconfig.json ./
COPY src ./src

# Compile TypeScript to ./build (only for production)
RUN if [ "$MODE" = "production" ]; then npm run build; else mkdir -p build; fi

# 2) Runtime: install deps and run
FROM node:22-alpine AS runner
ARG MODE=production
ENV MODE=${MODE}
WORKDIR /usr/src/app

# Install dependencies based on mode
COPY package*.json ./
RUN if [ "$MODE" = "production" ]; then \
      npm ci --omit=dev --ignore-scripts; \
    else \
      npm install; \
    fi

# Copy compiled app from builder (production) or source (development)
COPY --from=builder /usr/src/app/build ./build
COPY --from=builder /usr/src/app/src ./src
COPY --from=builder /usr/src/app/tsconfig.json ./tsconfig.json

# Expose the port the app listens on
EXPOSE 3002

# Start application based on mode
CMD sh -c "if [ \"$MODE\" = \"production\" ]; then node build/src/main.js; else npm run start:dev; fi"
