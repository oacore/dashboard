FROM node:18-alpine

ARG BUILD_TARGET=azure
ARG NODE_ENV=production
ARG SENTRY_DSN
ARG INSTALL_DEV=false
ARG NPM_TOKEN
ARG API_KEY
ARG GA_TRACKING_CODE

ENV NODE_ENV=$NODE_ENV \
    SENTRY_DSN=$SENTRY_DSN \
    NPM_TOKEN=$NPM_TOKEN \
    GA_TRACKING_CODE=$GA_TRACKING_CODE \
    API_KEY=$API_KEY \
    BUILD_TARGET=$BUILD_TARGET \
    NEXT_TELEMETRY_DISABLED=1

WORKDIR /app
COPY . .

RUN echo "NODE_ENV=$NODE_ENV INSTALL_DEV=$INSTALL_DEV"

RUN npm ci --include=dev --legacy-peer-deps

ENV NODE_OPTIONS="--openssl-legacy-provider"

RUN set -eux; \
    echo "NODE_ENV=$NODE_ENV INSTALL_DEV=$INSTALL_DEV"; \
    npm run build

EXPOSE 8080
CMD ["node_modules/next/dist/bin/next", "start", "-p", "8080"]
