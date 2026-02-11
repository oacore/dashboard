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
    echo "@oacore:registry=https://npm.pkg.github.com" > .npmrc; \
    echo "//npm.pkg.github.com/:_authToken=${NPM_TOKEN}" >> .npmrc; \
    npm ci --include=dev --legacy-peer-deps; \
    rm -f .npmrc

COPY . .

RUN npm run build

EXPOSE 8080

CMD ["node_modules/next/dist/bin/next", "start", "-p", "8080"]