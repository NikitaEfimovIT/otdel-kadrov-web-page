# Бэкенд «Отдел кадров» на Strapi 5 — установка

Strapi — headless-CMS: даёт БД, REST/GraphQL API и (в v1) панель управления
контентом. Фронтенд (`/web`) тянет из него данные. Хостим на **Timeweb Cloud**
(managed PostgreSQL + App Platform) — доступно из РФ без VPN, 152-ФЗ.

## 1. Создать проект Strapi

```bash
npx create-strapi-app@latest cms-app --quickstart
# при проде выбрать PostgreSQL вместо SQLite
```

Локально можно на SQLite; для прода — PostgreSQL (Timeweb Managed).

## 2. Завести content-types

В папке `schemas/` лежат готовые описания полей. Два пути:

- **Быстро (руками):** в админке Strapi (Content-Type Builder) создать типы с полями
  ровно как в JSON-файлах (`news`, `poll`, `poll-option`, `vote`, `application`,
  `recruit-role`, `link`, `guild-setting`, `raid-progress`).
- **Кодом:** для каждого типа создать
  `src/api/<singularName>/content-types/<singularName>/schema.json` и вставить
  содержимое соответствующего файла из `schemas/`, затем сгенерировать
  controller/service/route (`strapi generate`). Strapi подхватит при рестарте.

Соответствие эндпоинтов (pluralName) тому, что ждёт фронт (`web/src/lib/api.ts`):
`/api/news`, `/api/polls?populate=options`, `/api/links`, `/api/applications`.

### ⚠️ Подводные камни Strapi 5

- **`status` — зарезервированное имя.** Не создавай поле `status`. Используем
  `state` (у `poll`: active/closed) и `stage` (у `application`: new/reviewing/accepted/rejected).
- **Двунаправленная связь — согласованная пара.** Poll ↔ Poll Option:
  `poll.options` = `oneToMany` (mappedBy `poll`), `poll-option.poll` = `manyToOne`
  (inversedBy `options`). НЕ `oneToOne` — иначе схема не сохранится. В UI выбирай
  вариант «Poll **has many** Poll Options».
- **Голоса.** `vote.poll` и `vote.option` — `manyToOne` (oneWay), чтобы на один
  опрос/вариант приходилось много голосов (не `oneToOne`).
- Надёжнее создавать типы в Content-Type Builder по одному и сохранять, а не все
  разом — ошибка в одном ломает весь батч.

## 3. Права доступа (Settings → Users & Permissions → Roles)

**Public:**
- `find`/`findOne`: news, polls, poll-options, links, recruit-roles, guild-setting, raid-progress
- `create`: application, vote
- всё остальное — выключено.

**Authenticated / Officer:** полный CRUD (или пользуйся встроенной админкой Strapi).

> Мы договорились делать **свою** админку «Кабинет офицера» — она будет ходить
> в этот же API под токеном офицера. До неё контентом можно управлять через
> стандартную панель Strapi.

## 4. Вебхук в Discord на новые заявки

Lifecycle-хук `afterCreate` для `application`
(`src/api/application/content-types/application/lifecycles.js`):

```js
module.exports = {
  async afterCreate(event) {
    const { battletag, wowClass } = event.result;
    await fetch(process.env.DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: `📨 Новая заявка: **${battletag}** — ${wowClass ?? "класс не указан"}` }),
    });
  },
};
```

`DISCORD_WEBHOOK_URL` — в переменных окружения (Discord → настройки канала → интеграции → вебхуки).

## 5. CORS

В `config/middlewares.ts` разрешить origin фронта (GitHub Pages / свой домен),
иначе браузер заблокирует запросы.

## 6. Деплой на Timeweb Cloud

1. Managed PostgreSQL — создать кластер, забрать креды.
2. App Platform — подключить репозиторий, переменные окружения:
   `DATABASE_*`, `APP_KEYS`, `JWT_SECRET`, `ADMIN_JWT_SECRET`, `API_TOKEN_SALT`,
   `DISCORD_WEBHOOK_URL`.
3. После деплоя прописать адрес API во фронте: `web/.env` → `VITE_API_URL=https://<адрес>`.

## Голосование (целостность)

- **v1:** фронт генерирует `voterToken` (localStorage), шлёт с голосом; на бэке —
  проверка уникальности `(poll, voterToken)` + rate-limit по IP. Инкремент
  `poll-option.votes` в кастомном контроллере.
- **v2:** голос только для залогиненных (Discord/пароль гильдии), `voterToken` = id пользователя.
