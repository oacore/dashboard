FROM node:24-alpine AS builder

# Build args passed from .env via scripts/docker-build.sh or --build-arg
# VITE_MODE: development (.env.development) or production (.env.production)
ARG VITE_MODE=production
ARG BUILD_TARGET
ARG SENTRY_DSN
ARG NPM_TOKEN
ARG API_KEY
ARG GA_TRACKING_CODE
ARG VITE_APP_NAME
ARG VITE_APP_API_BASE_URL
ARG VITE_SENTRY_DSN
ARG VITE_GA_TRACKING_CODE

# VITE_API_URL and VITE_IDP_URL come from .env.development /.env.production (via VITE_MODE)
ENV BUILD_TARGET=${BUILD_TARGET} \
    SENTRY_DSN=${SENTRY_DSN} \
    NPM_TOKEN=${NPM_TOKEN} \
    API_KEY=${API_KEY} \
    GA_TRACKING_CODE=${GA_TRACKING_CODE} \
    NEXT_TELEMETRY_DISABLED=1 \
    NODE_OPTIONS="--openssl-legacy-provider" \
    VITE_API_KEY=${API_KEY} \
    VITE_APP_NAME=${VITE_APP_NAME} \
    VITE_APP_API_BASE_URL=${VITE_APP_API_BASE_URL} \
    VITE_SENTRY_DSN=${VITE_SENTRY_DSN} \
    VITE_GA_TRACKING_CODE=${VITE_GA_TRACKING_CODE}

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN set -eux; \
    TOKEN="$(printf %s "${NPM_TOKEN}" | tr -d '\r\n')"; \
    test -n "$TOKEN"; \
    printf "@oacore:registry=https://npm.pkg.github.com\n//npm.pkg.github.com/:_authToken=%s\n" "$TOKEN" > .npmrc; \
    corepack enable; \
    pnpm install --frozen-lockfile; \
    rm -f .npmrc

COPY . .

RUN pnpm exec tsc -b && pnpm exec vite build --mode ${VITE_MODE}

FROM nginx:1.27-alpine AS runtime

WORKDIR /usr/share/nginx/html

RUN rm -rf /usr/share/nginx/html/* \
    && rm -f /etc/nginx/conf.d/default.conf

COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
