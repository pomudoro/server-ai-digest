# /CLAUDE.md

## Project

Дайджест новостей про серверное оборудование (bare metal): физические серверы Supermicro, Dell, HP и других производителей. Astro 6 static blog, TypeScript, деплой на Vercel. Контент на русском языке.

## Тематика

- Серверные платформы: rack, blade, tower, GPU-серверы
- Компоненты: процессоры (Xeon, EPYC), память, NVMe, сетевые карты, BMC/IPMI
- Производители: Supermicro, Dell, HPE, Lenovo, Inspur, ASUS Server
- Рынок: новые линейки, сертификации, поставки, дата-центры

## Стиль статей

- Язык: русский. Английские термины оставлять как есть (bare metal, rack unit, hot-swap, BMC)
- Объём: 300–500 слов
- Тон: информативный, без маркетинга. Факты и характеристики важнее эмоций
- Аудитория: инженеры, сисадмины, IT-закупщики, devops, предприниматели, собственники малого бизнеса
- Ссылка на первоисточник обязательна (поле `source` во frontmatter)

## Commands

- `npm run dev` — dev-сервер :4321
- `npm run build` — production-сборка
- `npm run preview` — предпросмотр сборки
- Линтера и тестов нет. Node >= 22.12.0.

## Workflow

- `npm run build` после изменений — проверить что сборка не падает
- Frontmatter обязательные поля: `title`, `description`, `pubDate`
- Поле `tags` — массив строк (например: `['supermicro', 'gpu-servers', 'epyc']`)
- Константы сайта (`SITE_TITLE`, `SITE_DESCRIPTION`) — в `src/consts.ts`, не хардкодить
