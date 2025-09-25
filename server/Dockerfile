
FROM node:20-alpine

WORKDIR /app

# Оптимальный кеш: сначала зависимости
COPY package*.json ./
RUN npm ci --only=production

# Копируем исходники
COPY . .

# Аргументы среды
ENV NODE_ENV=production
# при необходимости: ENV PORT=8080

# (опционально) прогрев сборки, если есть build-скрипт
# RUN npm run build

EXPOSE 8080
CMD ["node", "index.js"]
