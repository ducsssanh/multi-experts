# Stage 1: Install dependencies

FROM node:18-alpine AS deps

RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy dependency files
COPY package.json package-lock.json* ./

# Install ALL dependencies (including devDependencies for build)
RUN npm ci && \
    npm cache clean --force

# Stage 2: Build the application

FROM node:18-alpine AS builder

WORKDIR /app

# Copy dependencies from deps stage

COPY --from=deps /app/node_modules ./node_modules

# Copy source code

COPY . .

# Set production environment

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Build 
RUN npm run build

# Stage 3: Runner

FROM node:18-alpine AS runner

WORKDIR /app

# Create non-root user and switch to it
RUN addgroup --system --gid 1001 -S nodejs && \
    adduser --system --uid 1001 nextjs

# Copy only necessary files
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non-root user
USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD [ "node", "server.js" ]