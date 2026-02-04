# GTM/GA4 Testing Playground - Frontend

React + Vite додаток для тестування Google Tag Manager (GTM) та Google Analytics 4 (GA4).

## Локальна розробка

### Встановлення

```bash
npm install
```

### Запуск

```bash
npm run dev
```

Додаток буде доступний на `http://localhost:5173`

### Збірка для production

```bash
npm run build
```

## Деплой на Render.com

Проект налаштований для деплою на Render.com з використанням Docker.

### Передумови

1. Репозиторій на GitHub/GitLab/Bitbucket
2. Аккаунт на [Render.com](https://render.com)
3. GTM Container ID

### Крок 1: Підключення репозиторію

1. Увійдіть в Render.com Dashboard
2. Натисніть "New +" → "Web Service"
3. Підключіть ваш репозиторій

### Крок 2: Налаштування сервісу

Налаштуйте наступні параметри:

- **Name**: `playground-gtm-ga4-frontend`
- **Language**: `Docker`
- **Branch**: `main`
- **Region**: `Frankfurt (EU Central)` (або ваш регіон)
- **Root Directory**: (залиште порожнім)
- **Dockerfile Path**: `./Dockerfile`

### Крок 3: Environment Variables

**ВАЖЛИВО**: Змінні оточення Vite (`VITE_*`) повинні бути встановлені **ДО** збірки Docker образу, оскільки вони використовуються під час build time.

Додайте наступні змінні оточення в розділі "Environment" на Render.com:

1. Перейдіть до налаштувань вашого сервісу на Render.com
2. Відкрийте розділ "Environment"
3. Додайте наступні змінні:
   - **Key**: `VITE_GTM_CONTAINER_ID`
     **Value**: ваш GTM Container ID (наприклад: `GTM-XXXXXXX`)
   - **Key**: `VITE_API_URL` (опціонально)
     **Value**: URL backend API, якщо використовується

**Примітка**: Після додавання або зміни змінних оточення необхідно перезапустити збірку (redeploy), щоб зміни вступили в силу.

### Крок 4: Деплой

1. Натисніть "Create Web Service"
2. Render автоматично почне збірку Docker образу
3. Після успішної збірки сервіс буде доступний за URL, наданим Render

### Автоматичний деплой з render.yaml

Якщо ви використовуєте `render.yaml`, Render автоматично налаштує сервіс згідно з конфігурацією:

1. Переконайтеся, що `render.yaml` знаходиться в корені репозиторію
2. При створенні нового сервісу Render автоматично виявить файл
3. Налаштування будуть застосовані автоматично

### Перевірка деплою

Після успішного деплою:

1. Відкрийте URL вашого сервісу
2. Перевірте, що додаток завантажується
3. Перевірте консоль браузера на наявність помилок
4. Перевірте, що GTM контейнер завантажується (відкрийте DevTools → Network)

### Локальне тестування Docker образу

Для тестування Docker образу локально:

```bash
# Збірка образу
docker build -t playground-gtm-ga4-frontend .

# Запуск контейнера
docker run -p 8080:80 playground-gtm-ga4-frontend
```

Додаток буде доступний на `http://localhost:8080`

## Структура проекту

```
playground-gtm-ga4-frontend/
├── Dockerfile              # Docker образ для production
├── nginx.conf              # Nginx конфігурація
├── .dockerignore           # Файли для ігнорування в Docker
├── render.yaml             # Render.com конфігурація
├── src/                    # Вихідний код
│   ├── components/         # React компоненти
│   ├── pages/             # Сторінки додатку
│   ├── utils/             # Утиліти (GTM helpers)
│   └── ...
└── package.json
```

## Технології

- **React 19** - UI бібліотека
- **Vite 7** - Build tool
- **React Router** - Маршрутизація
- **Docker** - Контейнеризація
- **Nginx** - Production веб-сервер

## Ліцензія

MIT
