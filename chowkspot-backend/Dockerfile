# ==========================================
# STAGE 1: Base & Dependencies
# ==========================================
FROM node:26-alpine AS base

WORKDIR /app

# Install build dependencies required for C++ native modules (argon2)
RUN apk add --no-cache python3 make g++ gcc

# Copy package manifests first for aggressive Docker layer caching
COPY package.json package-lock.json* ./

# Install ALL dependencies (including devDependencies required for compilation)
RUN npm ci

# ==========================================
# STAGE 2: TypeScript Build
# ==========================================
FROM base AS builder

WORKDIR /app

# Copy TypeScript configuration and code base
COPY tsconfig.json drizzle.config.ts ./
COPY src ./src

# Compile TypeScript code to ./dist
RUN npm run build

# Prune devDependencies to keep the production bundle small
RUN npm prune --omit=dev

# ==========================================
# STAGE 3: Production Runtime
# ==========================================
FROM node:26-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Run as non-root user for security
USER node

# Copy compiled JavaScript output and pruned node_modules from builder stage
COPY --chown=node:node --from=builder /app/package.json ./
COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/dist ./dist

# Expose default HTTP server port
EXPOSE 5000

# Container entry point
CMD ["node", "dist/server.js"]
