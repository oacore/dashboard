# Stage 1: Build stage
FROM node:16 AS builder

WORKDIR /app

# Install dependencies
COPY package*.json .npmrc ./
RUN npm ci --legacy-peer-deps

# Copy full source (including env.config)
COPY . .

# Build the Next.js app
RUN npm run build

# Stage 2: Runtime stage
FROM node:16-alpine

# Add dumb-init for signal handling
RUN apk add --no-cache dumb-init

WORKDIR /app

# Copy everything from builder
COPY --from=builder /app /app

# Expose app port
EXPOSE 8080

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Default command
CMD ["node_modules/next/dist/bin/next", "start", "-p", "8080"]
