FROM node:16-alpine as builder
WORKDIR /app
COPY package.json package-lock.json ./
COPY . .
RUN npm ci
RUN npm run build



FROM node:16-slim
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
RUN apt-get update && apt-get install gnupg wget -y && \
    wget --quiet --output-document=- https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor > /etc/apt/trusted.gpg.d/google-archive.gpg && \
    sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' && \
    apt-get update && \
    apt-get install google-chrome-stable -y --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=builder /app/dist .
# COPY --from=builder /usr /usr
EXPOSE 4000
CMD ["node", "server.bundle.js"]