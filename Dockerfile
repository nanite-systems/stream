# syntax=docker/dockerfile:1

# Workspace
FROM node:20-alpine as workspace

WORKDIR /workspace

RUN apk add --no-cache g++ make py3-pip
RUN npm -g install pnpm@^8.0.0

COPY package.json pnpm-*.yaml .npmrc ./

RUN pnpm fetch

COPY . .

RUN pnpm -r i --frozen-lockfile --offline --silent

# Builds app
FROM workspace as build-default

ARG APP_NAME

RUN pnpm nx build $APP_NAME
RUN pnpm -F $APP_NAME --prod deploy /app

# Release app(default template)
FROM node:20-alpine as release-default

WORKDIR /app

COPY --from=build-default /app .

ENV APP_PORT 3000
EXPOSE $APP_PORT

ENTRYPOINT ["node", "dist/main"]

HEALTHCHECK --interval=12s --timeout=12s --start-period=30s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:$APP_PORT/health || exit 1
