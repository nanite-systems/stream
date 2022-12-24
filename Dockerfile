FROM node:18-alpine as workspace

WORKDIR /workspace

ARG APP_NAME

RUN npm -g install pnpm
RUN apk add --no-cache g++ make py3-pip

COPY package.json pnpm-*.yaml .npmrc ./

RUN pnpm fetch

COPY . .

RUN pnpm i --frozen-lockfile --offline --silent
RUN pnpm nx build $APP_NAME
RUN pnpm $APP_NAME --prod deploy /app

FROM node:18-alpine

WORKDIR /app

COPY --from=workspace /app .

CMD ["node", "dist/main"]

HEALTHCHECK --interval=12s --timeout=12s --start-period=30s \
  CMD ["node", "dist/health"]

