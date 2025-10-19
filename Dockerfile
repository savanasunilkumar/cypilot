# Multi-stage build for backend
FROM node:18-alpine AS backend-builder

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend/package.json ./apps/backend/
COPY packages/shared/package.json ./packages/shared/
COPY packages/mcp-client/package.json ./packages/mcp-client/
COPY packages/tsconfig/package.json ./packages/tsconfig/

# Install pnpm and dependencies
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build shared packages first
RUN pnpm --filter @cypilot/shared build
RUN pnpm --filter @cypilot/mcp-client build

# Build backend
RUN pnpm --filter @cypilot/backend build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy built application
COPY --from=backend-builder /app/apps/backend/dist ./dist
COPY --from=backend-builder /app/apps/backend/package.json ./package.json
COPY --from=backend-builder /app/node_modules ./node_modules

# Expose port
EXPOSE 3001

# Start the application
CMD ["node", "dist/index.js"]
