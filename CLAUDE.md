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
- Тон: разговорный, первое лицо множественного числа.
- Без маркетинга. Факты, характеристики и бенчмарки важнее эмоций
- Без эмодзи.
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

## Digest Pipeline

Автоматический пайплайн генерации статей: `npm run digest`.

Точка входа: `scripts/digest.ts`. Модули: `scripts/lib/`.

### Стадии

1. **Config** — загрузка .env (TAVILY_API_KEY, ANTHROPIC_API_KEY, REPLICATE_API_TOKEN)
2. **Dedup** — чтение source URL из существующих постов
3. **Search** — поиск новостей через Tavily (topic: news, days: 7)
4. **Select** — Claude отбирает 3-5 тем из результатов
5. **Write** — Claude пишет статьи (claude-sonnet-4-5, structured output)
6. **Cover** — Replicate FLUX-schnell генерирует обложки (16:9, WebP)
7. **Publish** — git branch, commit, push, PR через gh CLI

### Критерии отбора новостей

Приоритет:
- Запуск новых серверных продуктов и платформ
- Значимые бенчмарки и тесты производительности
- Крупные анонсы вендоров (Supermicro, Dell, HPE, NVIDIA, Lenovo)
- Новые GPU/ускорители, сертификации NVIDIA
- Жидкостное охлаждение, NVLink, InfiniBand — значимые обновления

Исключить:
- Мелкие обновления прошивок и драйверов
- Спекуляции и утечки без подтверждения
- Маркетинговые пресс-релизы без технических деталей
- Чисто финансовые новости (акции, выручка)
- Новости старше 7 дней

### Редполитика дайджеста

- Каждая статья — обзор одной конкретной новости
- Обязательна ссылка на первоисточник (поле `source`)
- Дедупликация по URL источника — не писать о том, что уже есть в блоге
- Slug: латиница, lowercase, только `[a-z0-9-]`, до 60 символов
- Обложки сохраняются в `src/assets/digest/{YYYY-MM-DD}/{slug}.webp`

## Git Conventions

– Commits: Conventional Commits format.
– Types: feat, fix, docs, refactor, test, chore.
– Format: type(scope): description.
– Max subject line: 72 characters.
– Branch naming: type/short-description.
– PRs: always target "develop" (или "main", в зависимости от проекта).
