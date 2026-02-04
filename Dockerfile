# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Отримуємо змінні оточення як build arguments
ARG VITE_GTM_CONTAINER_ID
ARG VITE_API_URL

# Встановлюємо змінні оточення для Vite
ENV VITE_GTM_CONTAINER_ID=$VITE_GTM_CONTAINER_ID
ENV VITE_API_URL=$VITE_API_URL

# Копіюємо файли залежностей
COPY package*.json ./

# Встановлюємо залежності
RUN npm ci --only=production=false

# Копіюємо вихідний код
COPY . .

# Збираємо production версію
RUN npm run build

# Stage 2: Production
FROM nginx:alpine

# Копіюємо зібраний додаток
COPY --from=builder /app/dist /usr/share/nginx/html

# Копіюємо конфігурацію Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Відкриваємо порт 80
EXPOSE 80

# Запускаємо Nginx
CMD ["nginx", "-g", "daemon off;"]
