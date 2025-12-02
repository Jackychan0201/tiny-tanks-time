# Build stage
FROM node:20-slim AS builder
WORKDIR /app
COPY package.json package-lock.json ./
# Install dependencies - suppress warnings to save memory
RUN npm ci --silent --no-optional 2>/dev/null || npm ci --no-optional
COPY . .
# Clear all Nx and build caches to avoid database issues
RUN rm -rf .nx dist node_modules/.cache
# Build with skip cache to ensure clean build
RUN NX_SKIP_NX_CACHE=true NODE_OPTIONS="--max-old-space-size=512" npm run build || true

# Production stage - Nginx reverse proxy + Node backend
FROM node:20-slim AS production
WORKDIR /app

# Install Nginx
RUN apt-get update && apt-get install -y nginx && rm -rf /var/lib/apt/lists/*

# Copy backend dist and dependencies
COPY --from=builder /app/dist/apps/server ./dist/server
COPY --from=builder /app/package.json /app/package-lock.json ./

# Copy frontend dist to nginx root
COPY --from=builder /app/dist/apps/tiny-tanks-time/browser /app/public/frontend

# Copy Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Install production dependencies only
RUN npm ci --omit=dev --prefer-offline --no-audit

# Expose port 8080 (Railway default port)
EXPOSE 8080

# Start Nginx and Node backend
# Nginx listens on 8080, Node backend listens on 3000 (internal only)
CMD ["sh", "-c", "nginx -g 'daemon off;' & PORT=3000 node dist/server/main.js & wait"]
