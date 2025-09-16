FROM node:18-alpine

ARG BUILD_TARGET=azure
ARG SENTRY_DSN
ARG NODE_ENV=production
ARG NPM_TOKEN
ARG API_KEY
ARG GA_TRACKING_CODE

ENV SENTRY_DSN=$SENTRY_DSN \
    NPM_TOKEN=$NPM_TOKEN \
    GA_TRACKING_CODE=$GA_TRACKING_CODE \
    API_KEY=$API_KEY \
    BUILD_TARGET=$BUILD_TARGET

WORKDIR /app

COPY . .

RUN npm ci --include=dev --legacy-peer-deps

ENV NODE_ENV=$NODE_ENV
ENV NODE_OPTIONS="--openssl-legacy-provider"

RUN npm run build
EXPOSE 8080

CMD ["node_modules/next/dist/bin/next", "start", "-p", "8080"]
