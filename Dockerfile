# Build stage
# IMPORTANT: Build context must be the parent directory containing BOTH dashboard and @dashboard
# Run from parent of dashboard: docker build -f dashboard/Dockerfile -t dashboard .
#
# Expected structure:
#   ./
#   ├── dashboard/
#   └── @dashboard/
#       └── core-ui/
#
FROM node:20-alpine AS builder

ARG NODE_ENV=production
# API URL - defaults to dev API for staging; override for prod
ARG VITE_APP_API_BASE_URL=https://api-dev.core.ac.uk
ARG VITE_APP_NAME=CORE Dashboard
ARG VITE_API_URL=https://api.core.ac.uk
ARG VITE_IDP_URL=https://api.core.ac.uk
# API key for /v3/ endpoints - passed from CI secrets.API_KEY
ARG API_KEY

ENV NODE_ENV=$NODE_ENV
ENV VITE_APP_API_BASE_URL=$VITE_APP_API_BASE_URL
ENV VITE_APP_NAME=$VITE_APP_NAME
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_IDP_URL=$VITE_IDP_URL
ENV VITE_API_KEY=$API_KEY

WORKDIR /app

# 1. Copy @core/core-ui dependency (must exist at ../@dashboard/core-ui for dashboard build)
COPY @dashboard/core-ui ./@dashboard/core-ui

# 2. Build core-ui first (dashboard depends on it via path alias)
WORKDIR /app/@dashboard/core-ui
RUN corepack enable pnpm && pnpm install --frozen-lockfile && pnpm run build

# 3. Copy dashboard and build
WORKDIR /app
COPY dashboard/package.json dashboard/pnpm-lock.yaml ./dashboard/
WORKDIR /app/dashboard
RUN corepack enable pnpm && pnpm install --frozen-lockfile

COPY dashboard/ ./

RUN npm run build

# Serve stage
FROM nginx:alpine

COPY --from=builder /app/dashboard/dist /usr/share/nginx/html

# SPA fallback: serve index.html for client-side routing
RUN echo 'server { \
    listen 8080; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
