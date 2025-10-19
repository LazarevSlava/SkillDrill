# API Documentation (Template)

Здесь будет описание API проекта. Это шаблон, который можно расширять.

---

## 1. Базовая информация

- **Base URL (prod):** https://api.example.com
- **Base URL (staging):** https://staging.api.example.com
- **Версия API:** v1
- **Формат:** JSON

---

## 2. Аутентификация

- **Тип:** Bearer JWT
- **Заголовок:**
  ```
  Authorization: Bearer <token>
  ```

---

## 3. Общий формат ошибок

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Описание ошибки"
  }
}
```

---

## 4. Пример эндпоинта (шаблон)

### POST /api/v1/example

**Request**

```json
{
  "field": "value"
}
```

**Response 200**

```json
{
  "id": "123",
  "field": "value"
}
```

Ошибки:

- 400 `VALIDATION_ERROR`
- 401 `UNAUTHORIZED`

---

## 5. Пагинация (шаблон)

**Query параметры:**

- `page`
- `limit`

**Response**

```json
{
  "data": [
    /* массив объектов */
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}
```

---

## 6. Разделы для будущих эндпоинтов

- [ ] Пользователи
- [ ] Аутентификация
- [ ] Задачи/курсы
- [ ] Мониторинг

---

## 7. Changelog

- 2025-09-09: создан шаблон API.md
