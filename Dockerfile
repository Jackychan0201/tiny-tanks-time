# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# Clear all Nx and build caches to avoid database issues
RUN rm -rf .nx dist node_modules/.cache
# Build with skip cache to ensure clean build
RUN NX_SKIP_NX_CACHE=true npm run build

# Production stage - Nginx reverse proxy + Node backend
FROM node:20-alpine AS production
WORKDIR /app

# Install Nginx
RUN apk add --no-cache nginx

# Copy backend dist and dependencies
COPY --from=builder /app/dist/apps/server ./dist/server
COPY --from=builder /app/package.json /app/package-lock.json ./

# Copy frontend dist
COPY --from=builder /app/dist/apps/tiny-tanks-time/browser ./public/frontend

# Copy Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Install production dependencies only
RUN npm ci --omit=dev

# Expose port 8080 (Railway default port)
EXPOSE 8080

# Start Nginx and Node backend
CMD ["sh", "-c", "nginx -g 'daemon off;' & node dist/server/main.js & wait"]
