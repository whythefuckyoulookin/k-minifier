# kMinifier

> NestJS сервер для минификации CSS файлов с поддержкой бэкапов

**Автор:** whythefuckyoulookin

## Установка

```bash
npm install
```

## Запуск

```bash
# Разработка
npm run start:dev

# Продакшн
npm run start:prod
```

## Структура проекта

### 📁 Главные файлы

#### `main.ts`
Точка входа приложения. Создает NestJS приложение, настраивает middleware, Swagger документацию и обрабатывает graceful shutdown.

#### `app.module.ts`
Корневой модуль приложения, объединяющий все функциональные модули. Регистрирует глобальные модули (ConfigModule, LoggerModule), модуль CSS и глобальный интерцептор логирования.

---

### ⚙️ Конфигурация (`config/`)

#### `app.config.ts`
Конфигурация основных параметров приложения (порт, настройки Swagger).

#### `css.config.ts`
Конфигурация параметров минификации CSS с использованием LightningCSS.

#### `files.config.ts`
Конфигурация работы с файлами (путь загрузки, алгоритм хеширования SHA256).

#### `logger.config.ts`
Конфигурация логирования с использованием Winston.

---

### 🎨 CSS модуль (`css/`)

#### `css.controller.ts`
HTTP контроллер с эндпоинтами для минификации CSS и работы с бэкапами:
- `POST /api/css/minify` - минификация CSS файла
- `GET /api/css/backup/list` - список бэкапов клиента
- `GET /api/css/backup?t=timestamp` - получение конкретного бэкапа

#### `css.service.ts`
Сервис для минификации CSS файлов и управления бэкапами. Использует LightningCSS для минификации и кеширование по хешу файла.

#### `css.module.ts`
Модуль CSS, регистрирует контроллер и сервис.

#### Декораторы (`decorators/`)

**`client-headers.decorator.ts`**
Декоратор для извлечения и валидации заголовков клиента (`x-client-platform`, `x-client-login`) из HTTP запроса.

**`css-swagger.decorator.ts`**
Декораторы Swagger для документирования API эндпоинтов CSS модуля.

#### DTO (`dto/`)

**`css-file.dto.ts`**
DTO для описания загружаемого CSS файла в Swagger документации.

#### Pipes (`pipes/`)

**`parse-css-file.pipe.ts`**
Pipe для валидации загружаемых CSS файлов. Проверяет тип файла (text/css) и максимальный размер (10 МБ).

---

### 📂 Файловый модуль (`files/`)

#### `files.service.ts`
Сервис для работы с файловой системой. Предоставляет методы для:
- Сохранения файлов
- Чтения файлов и директорий
- Хеширования файлов (SHA256)

#### `files.module.ts`
Модуль файлов, предоставляет сервис для работы с файловой системой.

---

### 📝 Логирование (`logger/`)

#### `logger.service.ts`
Сервис логирования с использованием Winston и ротацией логов по дням. Предоставляет методы для логирования различных уровней (error, warn, debug, verbose, log).

#### `logger.module.ts`
Модуль логгера для всего приложения.

#### Интерцепторы (`interceptors/`)

**`logger.interceptor.ts`**
Интерцептор для автоматического логирования всех HTTP запросов. Логирует метод, URL, статус код, время выполнения и IP адрес.

---

### 🛠️ Утилиты (`utils/`)

#### `setup-swagger.ts`
Утилита для настройки и инициализации Swagger документации.

---

### 📊 Константы (`consts/`)

#### `file.ts`
Константы для работы с файлами:
- `MAX_CSS_FILE_SIZE` - максимальный размер загружаемого CSS файла (10 МБ)

---

## API Endpoints

### Минификация CSS

```http
POST /api/css/minify
Content-Type: multipart/form-data
Headers:
  x-client-platform: название_платформы
  x-client-login: логин_пользователя

Body:
  file: css-файл
```

### Список бэкапов

```http
GET /api/css/backup/list
Headers:
  x-client-platform: название_платформы
  x-client-login: логин_пользователя
```

### Получение бэкапа

```http
GET /api/css/backup?t=timestamp
Headers:
  x-client-platform: название_платформы
  x-client-login: логин_пользователя
```

---

## Swagger документация

Доступна по адресу: `http://localhost:3000/swagger`

---

## Особенности

- ✅ Минификация CSS с помощью LightningCSS
- ✅ Автоматическое создание бэкапов загруженных файлов
- ✅ Кеширование минифицированных файлов по хешу
- ✅ Валидация входящих файлов
- ✅ Логирование всех запросов с ротацией логов
- ✅ Graceful shutdown
- ✅ Helmet security middleware
- ✅ Swagger API документация

---

## Переменные окружения

```env
PORT=3000  # Порт сервера (по умолчанию 3000)
```