# API Ендпоїнти

Технічний опис всіх ендпоїнтів бекенду для реалізації.

## Базовий URL
```
http://localhost:8000
```

---

## Health Check

### GET /api/health
Перевірка доступності сервера.

**Відповідь:**
```json
{
  "status": "ok"
}
```

**Статуси:**
- `200 OK` - сервер доступний
- `500 Internal Server Error` - помилка сервера

**Примітка:** Опціональний ендпоїнт. Якщо не реалізовано, фронтенд використовує `/api/products` для перевірки.

---

## GTM Server-Side

### POST /gtm/collect
Відправка події до GTM Server-Side.

**Тіло запиту:**
```json
{
  "event": "page_view",
  "page_location": "https://example.com/page",
  "page_title": "Page Title"
}
```

**Відповідь:**
```json
{
  "success": true
}
```

**Статуси:**
- `200 OK` - успішно
- `400 Bad Request` - невалідні дані
- `500 Internal Server Error` - помилка сервера

---

## Події (Events)

### GET /api/events
Отримує лог подій.

**Query параметри:**
- `limit` (опціонально) - максимальна кількість подій (за замовчуванням: 100)

**Відповідь:**
```json
{
  "events": [
    {
      "event": "page_view",
      "timestamp": "2024-01-15T10:30:00Z",
      "data": {}
    }
  ]
}
```

**Статуси:**
- `200 OK` - успішно
- `500 Internal Server Error` - помилка сервера

---

### DELETE /api/events
Очищає лог подій.

**Відповідь:**
```json
{
  "success": true,
  "message": "Лог очищено"
}
```

**Статуси:**
- `200 OK` - успішно
- `500 Internal Server Error` - помилка сервера

---

### POST /api/simulate
Симулює server-side подію.

**Тіло запиту:**
```json
{
  "event_name": "custom_event",
  "data": {
    "key": "value"
  }
}
```

**Відповідь:**
```json
{
  "success": true,
  "message": "Подія симульована"
}
```

**Статуси:**
- `200 OK` - успішно
- `400 Bad Request` - невалідні дані
- `500 Internal Server Error` - помилка сервера

---

## Контактна форма

### POST /api/contact
Відправка контактної форми.

**Тіло запиту:**
```json
{
  "name": "Іван Іванов",
  "email": "ivan@mail.com",
  "message": "Текст повідомлення"
}
```

**Відповідь:**
```json
{
  "success": true,
  "message": "Повідомлення відправлено"
}
```

**Статуси:**
- `200 OK` - успішно
- `400 Bad Request` - невалідні дані
- `500 Internal Server Error` - помилка сервера

---

## Продукти

### GET /api/products
Отримує список продуктів.

**Query параметри:**
- `category` (опціонально) - фільтр за категорією
- `limit` (опціонально) - максимальна кількість продуктів
- `offset` (опціонально) - зміщення для пагінації (за замовчуванням: 0)

**Відповідь:**
```json
{
  "products": [
    {
      "id": "prod1",
      "name": "Тестовий продукт 1",
      "price": 99.99,
      "category": "Електроніка",
      "description": "Опис продукту",
      "image_url": "https://example.com/image.jpg"
    }
  ],
  "total": 10,
  "limit": 20,
  "offset": 0
}
```

**Або простий масив:**
```json
[
  {
    "id": "prod1",
    "name": "Тестовий продукт 1",
    "price": 99.99,
    "category": "Електроніка"
  }
]
```

**Статуси:**
- `200 OK` - успішно
- `500 Internal Server Error` - помилка сервера

---

### GET /api/products/:id
Отримує деталі конкретного продукту.

**Параметри шляху:**
- `id` - ID продукту

**Відповідь:**
```json
{
  "id": "prod1",
  "name": "Тестовий продукт 1",
  "price": 99.99,
  "category": "Електроніка",
  "description": "Детальний опис продукту",
  "image_url": "https://example.com/image.jpg",
  "in_stock": true,
  "stock_quantity": 100
}
```

**Статуси:**
- `200 OK` - успішно
- `404 Not Found` - продукт не знайдено
- `500 Internal Server Error` - помилка сервера

---

## Кошик

### GET /api/cart
Отримує поточний кошик користувача.

**Відповідь:**
```json
{
  "items": [
    {
      "item_id": "prod1",
      "item_name": "Тестовий продукт 1",
      "price": 99.99,
      "item_category": "Електроніка",
      "quantity": 1
    }
  ],
  "total": 99.99,
  "currency": "UAH"
}
```

**Або простий масив:**
```json
[
  {
    "item_id": "prod1",
    "item_name": "Тестовий продукт 1",
    "price": 99.99,
    "item_category": "Електроніка",
    "quantity": 1
  }
]
```

**Статуси:**
- `200 OK` - успішно
- `500 Internal Server Error` - помилка сервера

**Примітка:** Кошик зберігається в сесії користувача (cookie/session ID).

---

### POST /api/cart/add
Додає товар до кошика.

**Тіло запиту:**
```json
{
  "product_id": "prod1",
  "quantity": 1
}
```

**Відповідь:**
```json
{
  "success": true,
  "message": "Товар додано до кошика",
  "cart": {
    "items": [
      {
        "item_id": "prod1",
        "item_name": "Тестовий продукт 1",
        "price": 99.99,
        "item_category": "Електроніка",
        "quantity": 1
      }
    ],
    "total": 99.99
  }
}
```

**Або:**
```json
{
  "items": [
    {
      "item_id": "prod1",
      "item_name": "Тестовий продукт 1",
      "price": 99.99,
      "item_category": "Електроніка",
      "quantity": 1
    }
  ]
}
```

**Статуси:**
- `200 OK` - успішно
- `400 Bad Request` - невалідні дані
- `404 Not Found` - продукт не знайдено
- `500 Internal Server Error` - помилка сервера

---

### DELETE /api/cart/remove/:itemId
Видаляє товар з кошика.

**Параметри шляху:**
- `itemId` - ID товару в кошику (зазвичай це product_id)

**Відповідь:**
```json
{
  "success": true,
  "message": "Товар видалено з кошика",
  "cart": {
    "items": [],
    "total": 0
  }
}
```

**Або:**
```json
{
  "items": []
}
```

**Статуси:**
- `200 OK` - успішно
- `404 Not Found` - товар не знайдено в кошику
- `500 Internal Server Error` - помилка сервера

---

### PUT /api/cart/update/:itemId
Оновлює кількість товару в кошику.

**Параметри шляху:**
- `itemId` - ID товару в кошику

**Тіло запиту:**
```json
{
  "quantity": 3
}
```

**Відповідь:**
```json
{
  "success": true,
  "message": "Кількість оновлено",
  "cart": {
    "items": [
      {
        "item_id": "prod1",
        "item_name": "Тестовий продукт 1",
        "price": 99.99,
        "item_category": "Електроніка",
        "quantity": 3
      }
    ],
    "total": 299.97
  }
}
```

**Статуси:**
- `200 OK` - успішно
- `400 Bad Request` - невалідні дані (наприклад, quantity <= 0)
- `404 Not Found` - товар не знайдено в кошику
- `500 Internal Server Error` - помилка сервера

---

### DELETE /api/cart
Очищає весь кошик.

**Відповідь:**
```json
{
  "success": true,
  "message": "Кошик очищено",
  "cart": {
    "items": [],
    "total": 0
  }
}
```

**Статуси:**
- `200 OK` - успішно
- `500 Internal Server Error` - помилка сервера

---

### POST /api/cart/checkout
Починає процес оформлення замовлення (begin_checkout подія).

**Відповідь:**
```json
{
  "success": true,
  "message": "Оформлення розпочато",
  "checkout_id": "checkout_123456"
}
```

**Статуси:**
- `200 OK` - успішно
- `400 Bad Request` - кошик порожній
- `500 Internal Server Error` - помилка сервера

---

## Замовлення

### POST /api/orders
Створює нове замовлення (purchase подія).

**Тіло запиту:**
```json
{
  "items": [
    {
      "product_id": "prod1",
      "quantity": 1,
      "price": 99.99
    }
  ],
  "currency": "UAH",
  "total_value": 99.99
}
```

**Відповідь:**
```json
{
  "success": true,
  "message": "Замовлення створено",
  "order": {
    "transaction_id": "TXN-1234567890",
    "items": [
      {
        "product_id": "prod1",
        "quantity": 1,
        "price": 99.99
      }
    ],
    "total_value": 99.99,
    "currency": "UAH",
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

**Або:**
```json
{
  "transaction_id": "TXN-1234567890",
  "order": {
    "transaction_id": "TXN-1234567890",
    "items": [
      {
        "product_id": "prod1",
        "quantity": 1,
        "price": 99.99
      }
    ],
    "total_value": 99.99,
    "currency": "UAH"
  }
}
```

**Статуси:**
- `201 Created` - замовлення створено
- `400 Bad Request` - невалідні дані або кошик порожній
- `500 Internal Server Error` - помилка сервера

**Примітка:** Після створення замовлення кошик повинен бути автоматично очищений.

---

### GET /api/orders
Отримує історію замовлень користувача.

**Query параметри:**
- `limit` (опціонально) - максимальна кількість замовлень (за замовчуванням: 10)
- `offset` (опціонально) - зміщення для пагінації (за замовчуванням: 0)

**Відповідь:**
```json
{
  "orders": [
    {
      "transaction_id": "TXN-1234567890",
      "items": [
        {
          "product_id": "prod1",
          "quantity": 1,
          "price": 99.99
        }
      ],
      "total_value": 99.99,
      "currency": "UAH",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 5,
  "limit": 10,
  "offset": 0
}
```

**Статуси:**
- `200 OK` - успішно
- `500 Internal Server Error` - помилка сервера

---

## Загальні вимоги

### Формат помилок
Всі ендпоїнти повинні повертати помилки в наступному форматі:

```json
{
  "error": true,
  "message": "Опис помилки",
  "code": "ERROR_CODE"
}
```

### Заголовки
Всі POST/PUT запити повинні містити:
- `Content-Type: application/json`

### Управління сесіями
Для збереження кошика між запитами використовувати:
- Cookie з session ID
- JWT токени
- Інші механізми аутентифікації/сесій

### Валідація
Бекенд повинен валідувати:
- Наявність обов'язкових полів
- Типи даних
- Діапазони значень (quantity > 0, price > 0)
- Існування продуктів перед додаванням до кошика

### Примітки для реалізації
1. **Кошик:** Зберігати в пам'яті (тестування), БД або Redis (продакшен)
2. **ID транзакцій:** Генерувати унікальні ID (UUID або timestamp-based)
3. **Ціни:** Зберігати ціну на момент покупки в замовленні
4. **Валюта:** За замовчуванням UAH, можна додати підтримку інших валют
