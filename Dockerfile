# ─── Stage 1: Build ───────────────────────────────────────────────────────────
FROM node:24-alpine AS builder

# Prisma schema engine requires OpenSSL
RUN apk add --no-cache openssl

WORKDIR /app

# Install ALL dependencies (devDeps needed for tsc)
COPY package.json package-lock.json* ./
RUN npm ci --ignore-scripts

# Copy source
COPY tsconfig.json ./
COPY src ./src
COPY prisma ./prisma

# Generate Prisma client (Linux binary)
RUN npx prisma generate

# Compile TypeScript → ./dist
RUN npm run build

# Verify build output exists
RUN ls -la dist/

# ─── Stage 2: Run ─────────────────────────────────────────────────────────────
FROM node:24-alpine AS runner

# Prisma client requires OpenSSL at runtime
RUN apk add --no-cache openssl

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install production dependencies only
RUN npm ci --omit=dev --ignore-scripts

# Copy compiled output AFTER npm ci (so npm doesn't overwrite dist/)
COPY --from=builder /app/dist ./dist

# Copy prisma schema (needed for prisma db push at runtime)
COPY --from=builder /app/prisma ./prisma

# Copy the generated Prisma client binaries from builder
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client

# Copy entrypoint
COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

ENV NODE_ENV=production
EXPOSE 3000

ENTRYPOINT ["./entrypoint.sh"]
