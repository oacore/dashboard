FROM node:18-alpine

ARG NODE_ENV=production
ARG BUILD_TARGET=azure
ARG SENTRY_DSN
ARG NPM_TOKEN
ARG API_KEY
ARG GA_TRACKING_CODE

ENV NODE_ENV=$NODE_ENV 
ENV BUILD_TARGET=$BUILD_TARGET 
ENV SENTRY_DSN=$SENTRY_DSN 
ENV NPM_TOKEN=$NPM_TOKEN 
ENV API_KEY=$API_KEY 
ENV GA_TRACKING_CODE=$GA_TRACKING_CODE 
ENV NEXT_TELEMETRY_DISABLED=1 
ENV NODE_OPTIONS="--openssl-legacy-provider"

WORKDIR /app


COPY package.json package-lock.json* ./

RUN set -eux; \
    if [ -n "$NPM_TOKEN" ]; then \
      echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > .npmrc; \
    fi; \
    npm --version; node --version; \
    \
    if [ -f package-lock.json ]; then \
      npm ci --include=dev --legacy-peer-deps; \
    else \
      echo "WARNING: package-lock.json not found - using npm install"; \
      npm install --include=dev --legacy-peer-deps; \
    fi; \
    rm -f .npmrc

COPY . .

RUN echo "BUILD NODE_ENV=$NODE_ENV" && npm run build

EXPOSE 8080
CMD ["node_modules/next/dist/bin/next", "start", "-p", "8080"]
