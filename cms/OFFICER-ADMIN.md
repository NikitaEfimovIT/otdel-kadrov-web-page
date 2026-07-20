# Кабинет офицера — настройка

Кастомная админка гильдии. Отдельный ленивый раздел того же сайта:

```
https://nikitaefimovit.github.io/otdel-kadrov-web-page/#/officer
```

Вход — email/пароль офицера через Strapi (Users & Permissions, JWT). 6 экранов:
Обзор, Новости (список+редактор), Опросы (список+конструктор), Набор (роли+заявки),
Ссылки, Настройки. Пишет в Strapi под токеном офицера.

## 1. Права роли Authenticated (в Strapi)

Settings → Users & Permissions → Roles → **Authenticated** → включить
`find` / `findOne` / `create` / `update` / `delete` для:

- news-item, poll, poll-option, link
- application (минимум `find` + `update` — менять статус), recruit-role (`find` + `update`)
- guild-setting (`find` + `update`), raid, boss (`find`)

Проще: офицеры доверенные — включи весь CRUD для этих типов у Authenticated.
Save.

## 2. Создать офицера-пользователя

Content Manager → **User** (коллекция от Users & Permissions) → Create:
- username (показывается в сайдбаре), email, password
- **Confirmed: ON**, Blocked: OFF
- Role: **Authenticated**

Save. Этими email+паролем офицер логинится на `/#/officer`.
(Метод входа `/api/auth/local` в Strapi включён по умолчанию.)

## 3. Новости: Draft & Publish заменён на поле `published`

Чтобы публикацией управляла своя админка (а не D&P-экшены Strapi), у `news-item`
теперь `draftAndPublish: false` и булево поле `published`. Публичный сайт показывает
только `published = true`; в админке тумблер «Опубликовать» им и управляет.

> Если у тебя уже были опубликованные новости — после этой правки у них `published`
> станет `false` (дефолт нового поля). Просто переоткрой их в админке и включи тумблер.

## 4. Деплой

**Фронт (с Мака):**
```bash
cd /Users/ddomingo/otdel-kadrov-webpage
git add web cms
git commit -m "Officer admin (Кабинет офицера) + news published flag"
git push
```

**Strapi (на VM)** — забрать обновлённую схему news-item и пересобрать:
```bash
cd ~/otdel-kadrov-web-page && git pull
cp -r ~/otdel-kadrov-web-page/cms/cms-app/src/api/news-item ~/cms-app/src/api/
cd ~/cms-app && docker compose up -d --build
```

## 5. CORS

Запросы идут с origin `https://nikitaefimovit.github.io` с заголовком
`Authorization`. Strapi по умолчанию это разрешает; если резать — пропиши origin
в `config/middlewares.ts` (`strapi::cors` → `origin: ["https://nikitaefimovit.github.io"]`).

## Что осталось за кадром (упрощения v1)

- Перетаскивание ссылок мышью не сделано — порядок задаётся полем `order`.
- Полный текст новости (`body`, rich-text) в редакторе не правится — редактируется
  «превью» (`excerpt`), которое и показывается на карточке. При желании добавим
  редактор body позже.
- Прогресс рейда правится не здесь, а в разделе Strapi (Рейд/Босс) или через API.
