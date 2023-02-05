FROM node:16-alpine as builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build
RUN npm prune --production

# FROM node:16-alpine
# RUN apk add puppeteer
# WORKDIR /app
# COPY --from=builder /app/dist .
EXPOSE 4000
CMD ["node", "server.bundle.js"]