# Промт для Strapi AI

Скопируй всё из блока ниже и вставь в Strapi AI. Он на английском — так ассистент
понимает точнее (все имена полей и типы всё равно английские).

```
You are configuring a Strapi 5 backend. Create the content types below EXACTLY as specified. Obey every rule — previous attempts failed because of these exact mistakes.

## HARD RULES (do not violate)
1. Target is Strapi 5.
2. NEVER create a field named `status` — it is a reserved name in Strapi 5. We use `state` (Poll) and `stage` (Application) instead.
3. Enumeration values MUST be lowercase ASCII latin, no spaces, no Cyrillic. (Default values of normal text fields MAY contain Cyrillic — that is fine, the restriction is only for enum values.)
4. Every `oneToMany` relation MUST be bidirectional with its reciprocal `manyToOne` on the other content type. Do NOT create a one-directional `oneToMany`. Do NOT use `oneToOne` where a `manyToOne` is specified.
5. Enable Draft & Publish ONLY on "News". Disable it on every other type.
6. Internationalization (i18n): disabled on all types.
7. Use the exact singularName / pluralName given — they define the REST endpoints.

## CONTENT TYPES

### 1. News — collectionType — Draft & Publish: ON
singularName: news-item, pluralName: news-items
- title — Text (short) — required
- excerpt — Text (long)
- body — Rich text (Blocks)
- tag — Enumeration — required — values: raid, recruit, event, announcement
- date — Text (short) — required
- views — Integer — default 0

### 2. Poll — collectionType — Draft & Publish: OFF
singularName: poll, pluralName: polls
- question — Text (short) — required
- state — Enumeration — required — default: active — values: active, closed
- endsAt — Datetime
- multiple — Boolean — default false
- anonymous — Boolean — default true
- options — Relation to Poll-Option: "Poll has many Poll-Options" (oneToMany). The reciprocal field on Poll-Option is `poll`. This is ONE bidirectional relation.

### 3. Poll-Option — collectionType — Draft & Publish: OFF
singularName: poll-option, pluralName: poll-options
- text — Text (short) — required
- votes — Integer — default 0
- poll — Relation to Poll: "Poll-Option belongs to one Poll" (manyToOne). This is the reciprocal of Poll.options. Do NOT create a second, separate relation — it is the same one as in Poll.

### 4. Vote — collectionType — Draft & Publish: OFF
singularName: vote, pluralName: votes
- voterToken — Text (short) — required
- poll — Relation to Poll: "Vote belongs to one Poll" (manyToOne, one-directional — many votes to one poll). No field needed on the Poll side.
- option — Relation to Poll-Option: "Vote belongs to one Poll-Option" (manyToOne, one-directional).

### 5. Application — collectionType — Draft & Publish: OFF
singularName: application, pluralName: applications
- battletag — Text (short) — required
- wowClass — Text (short)
- spec — Text (short)
- logsUrl — Text (short)
- comment — Text (long)
- stage — Enumeration — required — default: new — values: new, reviewing, accepted, rejected

### 6. Link — collectionType — Draft & Publish: OFF
singularName: link, pluralName: links
- name — Text (short) — required
- url — Text (short) — required
- icon — Text (short)
- desc — Text (short)
- visible — Boolean — default true
- order — Integer — default 0

### 7. Recruit-Role — collectionType — Draft & Publish: OFF
singularName: recruit-role, pluralName: recruit-roles
- key — Text (short) — required — unique
- name — Text (short) — required
- icon — Text (short)
- open — Boolean — default true

### 8. Guild-Setting — singleType — Draft & Publish: OFF
singularName: guild-setting, pluralName: guild-settings
- name — Text (short) — required — default: Отдел кадров
- region — Text (short) — default: EU · Борейская Тундра
- faction — Text (short) — default: Альянс
- slogan — Text (long)
- recruitingOpen — Boolean — default true
- showRaidsmith — Boolean — default false

### 9. Raid-Progress — singleType — Draft & Publish: OFF
singularName: raid-progress, pluralName: raid-progresses
- raidName — Text (short) — default: Manaforge Omega
- updatedLabel — Text (short) — default: обновлено сегодня
- difficulties — JSON
- bosses — JSON
- mplusBestKey — Text (short)
- mplusRating — Text (short)
- mplusKeysThisSeason — Text (short)

## FINAL SELF-CHECK (verify before saving)
- No field anywhere is named `status`.
- All enum values are lowercase latin (raid/recruit/event/announcement, active/closed, new/reviewing/accepted/rejected).
- Poll.options is oneToMany and Poll-Option.poll is its manyToOne reciprocal — exactly ONE bidirectional relation between them.
- Vote.poll and Vote.option are manyToOne (one-directional), not oneToOne.
- Draft & Publish is ON only for News.
```
