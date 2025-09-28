# server/Dockerfile
FROM node:20-alpine

WORKDIR /app

# Установим только то, что нужно для запуска
COPY package*.json ./
RUN npm ci --omit=dev

# Копируем исходники (у тебя index.js, routes/, models/)
COPY . .

# В проде Express слушает этот порт
ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080
CMD ["npm", "start"]
