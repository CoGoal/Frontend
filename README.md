# CoGoal Frontend

React + Vite. Фронт работает с реализованными методами CoGoal через gateway: регистрация, вход по email или username, профиль, смена имени, аватара, логина, пароля и email, выход с одного или всех устройств. Цели, пакты и платежи пока не реализованы в backend.

## Вместе с backend

Общий Compose с фронтом находится в [ветке features/CG-3/Auth репозитория Backend](https://github.com/CoGoal/Backend/tree/features/CG-3/Auth). До объединения изменений используйте эту ветку backend и ветку `features/CG-4/FrontDeployConfig` frontend.

Рекомендуемая структура:

```text
CoGoal/                  # репозиторий Backend
  docker-compose.yml
  .env                   # настройки backend, в Git не входит
  Frontend/              # отдельный репозиторий Frontend
    Dockerfile
```

Из папки Backend, после настройки его `.env`:

```powershell
docker compose up -d --build --wait
```

Открыть [CoGoal](http://localhost:5173), [Swagger](http://localhost:8080/swagger-ui.html), [Mailpit](http://localhost:8025).

В общем Compose адрес gateway задан внутри Docker-сети. Браузер отправляет запросы на тот же адрес, с которого загружена страница; Nginx проксирует `/api/v1/**` в gateway. `FRONTEND_CONTEXT` позволяет указать другую папку клона, `FRONTEND_PORT` — другой порт. При смене порта обновите `FRONTEND_URL` в backend: ссылки из писем должны вести на фронт.

## Контейнер фронта отдельно

При уже запущенном gateway на порту 8080, из этой папки:

```powershell
docker compose up -d --build --wait
```

По умолчанию Nginx обращается к `http://host.docker.internal:8080`. Можно скопировать `.env.example` в `.env` и изменить `BACKEND_URL` (без завершающего слэша) и `FRONTEND_PORT`. Бэк не запускается этим Compose. Одновременно с общим Compose выберите другой порт для отдельного фронта.

## Разработка

Используйте Node.js 22.12+ или 24; требования [Vite](https://vite.dev/guide/).

```powershell
npm ci
npm run dev
```

Vite запускается на порту 5173 и проксирует API в `http://localhost:8080`. Для другого gateway перед запуском задайте `BACKEND_URL` в окружении. Пароли БД и секрет JWT фронту не нужны.

Проверки:

```powershell
npm run lint
npm test
npm run build
```

Dockerfile выполняет эти же проверки при сборке и использует `package-lock.json` через `npm ci`.

## Работа с API

- Вход отправляет `{ login, password }`. В login можно указать email или username.
- Токены сохраняются в браузере; при 401 выполняется одна ротация refresh для параллельных запросов и повтор запроса. При завершении сессии кэш пользователя очищается.
- Auth возвращает данные аккаунта. Полный профиль с именем, аватаром и монетами загружается отдельным GET в main. При `PROFILE_PENDING` после регистрации запрос повторяется каждые две секунды.
- Имя и аватар меняются через `PATCH /api/v1/users/me`; пустая ссылка удаляет аватар. Логин меняется через `PATCH /api/v1/auth/me/username`.
- Выход отзывает refresh на сервере, затем очищает браузерную сессию. Уже выданный access остаётся действующим до истечения срока, согласно backend.
- Сброс пароля открывается по `/reset-password?token=...`, подтверждение email — по `/email-confirm?token=...`. После изменения пароля или подтверждения email нужно войти снова.
- Пароли проверяются по лимиту BCrypt: минимум 8 символов, максимум 72 байта UTF-8.

Почта в локальном окружении приходит в Mailpit. База данных и Kafka доступны только backend; фронт к ним не подключается.
