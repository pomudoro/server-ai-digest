# /CLAUDE.md

## Project

Дайджест новостей про серверное оборудование для AI (bare metal AI infrastructure): GPU-серверы, AI-рабочие станции, HPC-платформы для обучения и инференса. Supermicro, Dell, HPE, NVIDIA и другие производители. Astro 6 static blog, TypeScript, деплой на Vercel. Контент на русском языке.

## Тематика

- AI-серверы и платформы: GPU-серверы, AI workstations, HPC-кластеры, rack, tower
- GPU и ускорители: NVIDIA (Blackwell, Hopper, Grace), AMD Instinct, Intel Gaudi
- Компоненты AI-платформ: HBM-память, NVLink, NVSwitch, InfiniBand, ConnectX, PCIe 5.0/6.0, жидкостное охлаждение
- Процессоры: NVIDIA Grace (ARM), AMD EPYC, Intel Xeon — в контексте AI-нагрузок
- Производители: Supermicro, Dell, HPE, Lenovo, NVIDIA, ASUS Server, Inspur
- Сценарии: обучение LLM, файнтюнинг, инференс, Multi-Instance GPU, AI on-premise
- Рынок: новые AI-платформы, сертификации NVIDIA, поставки, AI-дата-центры

## Стиль статей

- Язык: русский. Английские термины оставлять как есть (bare metal, inference, fine-tuning, HBM, NVLink, hot-swap, BMC)
- Объём: 300–500 слов
- Тон: информативный, без маркетинга. Факты, характеристики и бенчмарки важнее эмоций
- Аудитория: ML-инженеры, DevOps/MLOps, сисадмины AI-кластеров, IT-закупщики, CTO стартапов, исследователи, предприниматели, собственники малого бизнеса
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

## Git Conventions

– Commits: Conventional Commits format.
– Types: feat, fix, docs, refactor, test, chore.
– Format: type(scope): description.
– Max subject line: 72 characters.
– Branch naming: type/short-description.
– PRs: always target "develop" (или "main", в зависимости от проекта).
