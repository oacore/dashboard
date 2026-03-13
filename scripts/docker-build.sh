#!/usr/bin/env sh
# Build Docker image using vars from .env
# Usage: ./scripts/docker-build.sh [docker build args...]

set -e

if [ -f .env ]; then
  set -a
  . ./.env
  set +a
fi

# Map .env keys to build args (VITE_API_KEY used when API_KEY not set)
API_KEY="${API_KEY:-$VITE_API_KEY}"

exec docker build \
  --build-arg NODE_ENV="${NODE_ENV:-production}" \
  --build-arg BUILD_TARGET="${BUILD_TARGET:-azure}" \
  --build-arg SENTRY_DSN="$SENTRY_DSN" \
  --build-arg NPM_TOKEN="$NPM_TOKEN" \
  --build-arg API_KEY="$API_KEY" \
  --build-arg GA_TRACKING_CODE="$GA_TRACKING_CODE" \
  --build-arg VITE_API_URL="$VITE_API_URL" \
  --build-arg VITE_IDP_URL="$VITE_IDP_URL" \
  "$@"
