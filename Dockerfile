FROM node:16-alpine as builder
WORKDIR /app
COPY package.json .
RUN npm ci
RUN npm run build



FROM node:16-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
EXPOSE 4000
CMD ["node", "server.bundle.js"]