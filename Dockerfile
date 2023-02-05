FROM node:16-alpine as builder
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
WORKDIR /app
COPY package.json package-lock.json ./
COPY . .
RUN npm ci
RUN npm run build



FROM node:16-alpine
RUN apk update && apk upgrade && \
    apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont


WORKDIR /app
COPY --from=builder /app/dist .
EXPOSE 4000
CMD ["node", "server.bundle.js"]