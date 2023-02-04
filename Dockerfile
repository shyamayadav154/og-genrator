FROM node:18-alpine as builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
RUN npm run build



FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist .
EXPOSE 4000
CMD ["node", "server.bundle.js"]