FROM node:20 AS build-env
COPY . /build
WORKDIR /build

RUN npm ci
RUN npm run build

FROM gcr.io/distroless/nodejs20-debian12
COPY --from=build-env /build/.output /app

ENV NODE_ENV=production
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

WORKDIR /app
CMD ["./server/index.mjs"]
