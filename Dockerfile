FROM node:16-alpine
WORKDIR /app
COPY package.json .
RUN npm install --omit=dev
COPY . .
EXPOSE 4000
CMD ["npm", "start"]