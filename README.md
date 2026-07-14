# Отдел кадров — сайт гильдии

Репозиторий сайта гильдии WoW «Отдел кадров» (EU · Борейская Тундра · Альянс) —
визитка + внутренний хаб (новости, опросы, прогресс рейда, набор).

## Структура

| Папка / файл | Что это | Статус |
|---|---|---|
| `web/` | Публичный сайт — React SPA (Vite + TypeScript) | ✅ собирается |
| `cms/` | Схемы content-types Strapi + `cms/SETUP.md` (бэкенд) | ✅ готово к развёртыванию |
| `design-spec-otdel-kadrov.md` | Дизайн-спека (бренд, токены) | ✅ |
| `plan-realizatsii-otdel-kadrov.md` | План реализации (стек, хостинг, риски, фазы) | ✅ |

## Запуск сайта локально

```bash
cd web
npm install
npm run dev            # http://localhost:5173
```

Без бэкенда сайт работает на мок-данных (`web/src/lib/mock.ts`) — открывается сразу.

Сборка прод-версии: `npm run build` (проверено — `dist/` собирается без ошибок типов).

## Подключение к Strapi

1. Подними Strapi по `cms/SETUP.md` (хостинг — Timeweb Cloud).
2. `cp web/.env.example web/.env` и впиши `VITE_API_URL=https://<адрес-api>`.
3. Перезапусти `npm run dev`. Данные пойдут из API — компоненты менять не нужно
   (весь доступ к данным изолирован в `web/src/lib/api.ts`).

## Деплой на GitHub Pages

Workflow `.github/workflows/deploy.yml` собирает `web/` и публикует на Pages при
пуше в `main`. Включить: **Settings → Pages → Source: GitHub Actions**.

Свой домен (рекомендуется `.ru` для стабильного доступа из РФ): создай
`web/public/CNAME` со своим доменом и настрой DNS на RU-доступном провайдере
(reg.ru / Yandex), **не на Cloudflare**.

## Доступ из РФ без VPN (важно)

- Статику GitHub Pages из РФ обычно видно. **API и БД — только на российском
  managed** (Timeweb/Yandex): Supabase, Neon, Vercel и Cloudflare сейчас
  режут/душат. Подробности и пруфы — в `plan-realizatsii-otdel-kadrov.md`.
- Вход офицеров — по email/паролю (не через Discord: его в РФ тоже душат).
- Шрифты сейчас с Google Fonts; для устойчивости можно перевести на самохост.

## Что дальше

- [ ] Кастомная админка «Кабинет офицера» (по макету `Otdel-Kadrov-Admin`).
- [ ] Развернуть Strapi на Timeweb + Discord-вебхук на заявки + голосование v1.
- [ ] Полная мобильная адаптация (сейчас — базовые коллапсы сеток).
- [ ] Заполнить реальные ссылки (raider.io, WCL, Discord) и данные прогресса.
# otdel-kadrov-web-page
