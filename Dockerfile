FROM node:24-alpine AS builder

ARG NODE_ENV=production
ARG VITE_APP_API_BASE_URL=https://api-dev.core.ac.uk
ARG VITE_APP_NAME=CORE Dashboard
ARG VITE_API_URL=https://api.core.ac.uk
ARG VITE_IDP_URL=https://api.core.ac.uk
ARG API_KEY

ENV NODE_ENV=$NODE_ENV
ENV VITE_APP_API_BASE_URL=$VITE_APP_API_BASE_URL
ENV VITE_APP_NAME=$VITE_APP_NAME
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_IDP_URL=$VITE_IDP_URL
ENV VITE_API_KEY=$API_KEY

WORKDIR /app

COPY package.json pnpm-lock.yaml .npmrc ./

RUN corepack enable pnpm && pnpm install --frozen-lockfile

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
