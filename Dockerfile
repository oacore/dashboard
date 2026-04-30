FROM node:24-alpine AS builder

ARG NODE_ENV=production
ARG BUILD_TARGET=azure
ARG NPM_TOKEN
ARG SENTRY_DSN=""
ARG SENTRY_AUTH_TOKEN=""
ARG GA_TRACKING_CODE=""

# VITE_API_URL, VITE_IDP_URL come from committed .env.development / .env.production
# SENTRY_AUTH_TOKEN: build-only; enables Vite sourcemaps + Sentry upload (see vite.config.ts)
ENV NODE_ENV=${NODE_ENV} \
    BUILD_TARGET=${BUILD_TARGET} \
    NPM_TOKEN=${NPM_TOKEN} \
    SENTRY_AUTH_TOKEN=${SENTRY_AUTH_TOKEN} \
    VITE_SENTRY_DSN=${SENTRY_DSN} \
    VITE_GA_TRACKING_CODE=${GA_TRACKING_CODE}

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

RUN if [ "$NODE_ENV" = "production" ]; then pnpm run build; else pnpm run build:dev; fi

FROM nginx:1.27-alpine AS runtime

WORKDIR /usr/share/nginx/html

RUN rm -rf /usr/share/nginx/html/* \
    && rm -f /etc/nginx/conf.d/default.conf

COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
