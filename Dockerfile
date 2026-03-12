FROM node:24-alpine AS builder

ARG NODE_ENV=production
ARG BUILD_TARGET=azure
ARG SENTRY_DSN
ARG NPM_TOKEN
ARG API_KEY
ARG GA_TRACKING_CODE
ARG VITE_APP_NAME="CORE Dashboard"
ARG VITE_APP_API_BASE_URL="https://api.core.ac.uk"
ARG VITE_API_URL="https://api.core.ac.uk"
ARG VITE_IDP_URL="https://api.core.ac.uk"

ENV NODE_ENV=${NODE_ENV} \
    BUILD_TARGET=${BUILD_TARGET} \
    SENTRY_DSN=${SENTRY_DSN} \
    NPM_TOKEN=${NPM_TOKEN} \
    API_KEY=${API_KEY} \
    GA_TRACKING_CODE=${GA_TRACKING_CODE} \
    NEXT_TELEMETRY_DISABLED=1 \
    NODE_OPTIONS="--openssl-legacy-provider" \
    VITE_API_KEY=${API_KEY} \
    VITE_APP_NAME=${VITE_APP_NAME} \
    VITE_APP_API_BASE_URL=${VITE_APP_API_BASE_URL} \
    VITE_API_URL=${VITE_API_URL} \
    VITE_IDP_URL=${VITE_IDP_URL}

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN set -eux; \
    echo "@oacore:registry=https://npm.pkg.github.com" > .npmrc; \
    echo "//npm.pkg.github.com/:_authToken=${NPM_TOKEN}" >> .npmrc; \
    corepack enable; \
    pnpm install --frozen-lockfile; \
    rm -f .npmrc

COPY . .

RUN pnpm run build

FROM nginx:1.27-alpine AS runtime

WORKDIR /usr/share/nginx/html

RUN rm -rf /usr/share/nginx/html/* \
    && rm -f /etc/nginx/conf.d/default.conf

COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
