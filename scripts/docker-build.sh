#!/usr/bin/env sh
# Build Docker image using vars from .env (no hardcoded defaults)
# Usage: cp .example.env .env && fill in values && ./scripts/docker-build.sh

set -e

if [ ! -f .env ]; then
  echo "Error: .env not found. Copy .example.env to .env and fill in values."
  exit 1
fi

set -a
. ./.env
set +a

# API_KEY is mapped to VITE_API_KEY in Dockerfile; .env can use either
API_KEY="${API_KEY:-$VITE_API_KEY}"
# SENTRY_DSN / GA_TRACKING_CODE can be used as fallbacks for VITE_* vars
VITE_SENTRY_DSN="${VITE_SENTRY_DSN:-$SENTRY_DSN}"
VITE_GA_TRACKING_CODE="${VITE_GA_TRACKING_CODE:-$GA_TRACKING_CODE}"

exec docker build \
  --build-arg NODE_ENV="${NODE_ENV}" \
  --build-arg BUILD_TARGET="${BUILD_TARGET}" \
  --build-arg SENTRY_DSN="${SENTRY_DSN}" \
  --build-arg NPM_TOKEN="${NPM_TOKEN}" \
  --build-arg API_KEY="${API_KEY}" \
  --build-arg GA_TRACKING_CODE="${GA_TRACKING_CODE}" \
  --build-arg VITE_APP_NAME="${VITE_APP_NAME}" \
  --build-arg VITE_APP_API_BASE_URL="${VITE_APP_API_BASE_URL}" \
  --build-arg VITE_API_URL="${VITE_API_URL}" \
  --build-arg VITE_IDP_URL="${VITE_IDP_URL}" \
  --build-arg VITE_SENTRY_DSN="${VITE_SENTRY_DSN}" \
  --build-arg VITE_GA_TRACKING_CODE="${VITE_GA_TRACKING_CODE}" \
  "$@"
