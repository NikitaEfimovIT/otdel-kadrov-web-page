# Деплой Strapi на Yandex Cloud по гранту

Пошагово поднимаем бэкенд гильдии на бесплатном гранте Yandex Cloud
(≈4000 ₽ / 60 дней новым аккаунтам). Из РФ открывается без VPN.

## Архитектура (для пилота)

Одна виртуалка, на ней в Docker: **Strapi + PostgreSQL + Caddy** (авто-HTTPS).
Так грант тратится минимально (один сервис), а перейти на Managed PostgreSQL
позже — это правка пары строк в `.env` (см. §10).

```
Игрок / офицер ──HTTPS──► api.ВАШ-ДОМЕН.ru (Caddy) ──► Strapi :1337 ──► Postgres
                                на одной VM в Yandex Cloud (РФ)
Сайт (GitHub Pages) ──запросы──► тот же api.ВАШ-ДОМЕН.ru
```

Готовые файлы — в `cms/deploy/` (`Dockerfile`, `docker-compose.yml`, `Caddyfile`, `.env.example`).

---

## 1. Активировать грант

1. Регистрируешься на [cloud.yandex.ru](https://cloud.yandex.ru), привязываешь
   платёжный аккаунт → активируется пробный период (грант ~4000 ₽ / 60 дней).
2. Проверь баланс гранта в разделе «Биллинг».

## 2. Создать виртуалку (Compute Cloud)

Compute Cloud → «Создать ВМ»:
- Образ: **Ubuntu 22.04 LTS**.
- Платформа: **burstable**, 2 vCPU (гарантированная доля **20%**), **RAM 2 ГБ** — самое дешёвое, гранта хватит надолго.
- Диск: **20 ГБ SSD**.
- Публичный IP: **временный** (позже можно закрепить).
- SSH: вставь свой публичный ключ (`~/.ssh/id_ed25519.pub`), логин `ubuntu`.
- В группе безопасности открой входящие **22, 80, 443**.

Запиши публичный IP.

> Если сборка Strapi упадёт по памяти на 2 ГБ — добавь swap (см. §6) либо собери
> образ локально и запушь в Yandex Container Registry.

## 3. Поставить Docker

```bash
ssh ubuntu@ПУБЛИЧНЫЙ_IP
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER && newgrp docker
docker --version && docker compose version
```

## 4. Подготовить проект Strapi

На своей машине (или сразу на VM) создай проект и добавь типы:

```bash
npx create-strapi-app@latest cms-app --skip-cloud
# ВЫБЕРИ PostgreSQL — иначе не поставится драйвер pg и контейнер с DATABASE_CLIENT=postgres не стартует
```

- Заведи content-types по `cms/strapi-ai-prompt.md` (через Strapi AI) или руками
  по `cms/schemas/*.json`. Права, вебхук в Discord, CORS — по `cms/SETUP.md`.
- Скопируй в корень `cms-app` файлы из `cms/deploy/`: `Dockerfile`,
  `docker-compose.yml`, `Caddyfile`, `.env.example`.
- Залей проект на VM (git clone своего репо, либо `scp -r cms-app ubuntu@IP:~/`).

## 5. Домен и DNS

- Заведи домен (лучше `.ru`) у РУ-регистратора (reg.ru и т.п.).
- Добавь **A-запись**: `api.ВАШ-ДОМЕН.ru → ПУБЛИЧНЫЙ_IP`.
- DNS держи у RU-доступного провайдера, **не Cloudflare** (его в РФ душат).
- В `Caddyfile` замени `api.ВАШ-ДОМЕН.ru` и `email` на свои.

## 6. Настроить окружение и запустить

```bash
cd ~/cms-app                      # ВАЖНО: compose запускается из корня Strapi-проекта, не из cms/deploy
cp .env.example .env              # файлы деплоя уже перенесены сюда на шаге 4
nano .env                         # заполнить секреты и пароль БД
```

Сгенерировать секреты (запусти команду 6 раз, вставь значения в `.env`):
```bash
node -e "console.log(require('crypto').randomBytes(16).toString('base64'))"
```

**Обязательно добавь swap** — на 2 ГБ RAM сборка админки Strapi падает с OOM:
```bash
sudo fallocate -l 4G /swapfile && sudo chmod 600 /swapfile
sudo mkswap /swapfile && sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab   # чтобы swap пережил перезагрузку
free -h                                                       # проверить, что swap появился
```
Альтернатива без swap: временно увеличь VM до 4 ГБ RAM на время сборки (Compute Cloud → ВМ → Остановить → Редактировать → RAM 4 ГБ → Запустить), потом можно вернуть 2 ГБ.

Запуск:
```bash
docker compose up -d --build
docker compose logs -f strapi     # дождись "Strapi is up"
```

Caddy сам получит HTTPS-сертификат для `api.ВАШ-ДОМЕН.ru` (нужны живые DNS и открытые 80/443).

## 7. Первичная настройка Strapi

1. Открой `https://api.ВАШ-ДОМЕН.ru/admin` → создай первого админа (это офицерский вход по email/паролю).
2. Settings → Users & Permissions → **Public**: включи `find`/`findOne` для
   news, polls, poll-options, links, recruit-roles, guild-setting, raid-progress;
   `create` для application и vote. Остальное — выключено. (Подробно — `cms/SETUP.md`.)
3. Заполни Guild Setting, Raid Progress, добавь пару новостей/ссылок.
4. Настрой CORS: в `config/middlewares.ts` разреши origin твоего сайта на Pages.
5. Вебхук в Discord на заявки — по `cms/SETUP.md`.

## 8. Подключить сайт

В `web/.env`:
```
VITE_API_URL=https://api.ВАШ-ДОМЕН.ru
```
Пересобрать и задеплоить Pages (пуш в `main` — workflow сделает сам). Сайт начнёт
тянуть данные из Strapi. Проверь, что всё грузится **из РФ без VPN**.

## 9. Беречь грант

- Расход смотри в «Биллинг → Прогноз».
- Виртуалку можно **останавливать**, когда не нужна (за остановленную ВМ платится
  только диск): `Compute Cloud → ВМ → Остановить`. Но тогда API недоступен —
  для боевого сайта держи запущенной.
- За ~неделю до конца гранта реши: перейти на платный YC, либо переехать на
  дешёвый RU-VPS / Timeweb (перенос — тот же `docker compose up`, плюс дамп БД
  `pg_dump`).

## 10. Апгрейд на Managed PostgreSQL (опционально)

Когда захочешь managed-базу вместо контейнера:
1. Managed Service for PostgreSQL → создать кластер (тот же network, что у ВМ), забрать host/логин/пароль.
2. Скачать CA-сертификат YC на ВМ, положить как `yc-root.crt` в корень проекта.
3. В `.env` переключить блок на Managed (host `*.mdb.yandexcloud.net`, порт 6432,
   `DATABASE_SSL=true`, `NODE_EXTRA_CA_CERTS=/opt/app/yc-root.crt`), убрать сервис
   `db` из `docker-compose.yml`.
4. Перенести данные: `pg_dump` из контейнера → `pg_restore` в кластер.
5. `docker compose up -d --build`.

## Альтернатива: Serverless Containers (тянет грант дольше)

Вместо всегда-включённой ВМ — образ Strapi в Serverless Containers (масштаб в ноль,
первый 1 млн вызовов/мес бесплатно) + Managed PostgreSQL + Object Storage под
загрузки. Дешевле по гранту, но есть **cold start** (первый запрос после простоя —
несколько секунд) и загрузки нужно хранить в Object Storage, а не на диске. Для
редкого офицерского админа терпимо; для публичного API — заметнее. Если захочешь
этот путь — распишу отдельно.

---

**Безопасность:** `.env` и секреты не коммить в git (добавь `.env` в `.gitignore`
проекта). Пароль БД — длинный случайный. Держи систему в обновлениях (`apt upgrade`).
