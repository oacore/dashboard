FROM node:24-alpine AS builder

# Production build args. Pass via: docker build --build-arg API_KEY=xxx ...
# Or source .env and pass: --build-arg API_KEY=$API_KEY --build-arg NPM_TOKEN=$NPM_TOKEN ...
ARG NODE_ENV=production
ARG BUILD_TARGET=azure
ARG SENTRY_DSN
ARG NPM_TOKEN
ARG API_KEY
ARG GA_TRACKING_CODE
ARG VITE_APP_NAME=CORE Dashboard
ARG VITE_APP_API_BASE_URL=https://api.core.ac.uk
ARG VITE_API_URL=https://api.core.ac.uk
ARG VITE_IDP_URL=https://api.core.ac.uk

ENV NODE_ENV=$NODE_ENV
ENV BUILD_TARGET=$BUILD_TARGET
ENV SENTRY_DSN=$SENTRY_DSN
ENV NPM_TOKEN=$NPM_TOKEN
ENV API_KEY=$API_KEY
ENV GA_TRACKING_CODE=$GA_TRACKING_CODE
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS="--openssl-legacy-provider"

# Map API_KEY to VITE_API_KEY (app uses import.meta.env.VITE_API_KEY)
ENV VITE_API_KEY=$API_KEY
ENV VITE_APP_NAME=$VITE_APP_NAME
ENV VITE_APP_API_BASE_URL=$VITE_APP_API_BASE_URL
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_IDP_URL=$VITE_IDP_URL

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN set -eux; \
    echo "@oacore:registry=https://npm.pkg.github.com" > .npmrc; \
    echo "//npm.pkg.github.com/:_authToken=${NPM_TOKEN}" >> .npmrc; \
    corepack enable pnpm; \
    pnpm install --frozen-lockfile; \
    rm -f .npmrc

COPY . .

RUN pnpm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

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
