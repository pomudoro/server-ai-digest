---
name: digest
description: Coordinate Agent Team (news-scout, writer, cover-artist, page-builder) to ship a digest issue
disable-model-invocation: false
---

Создай Agent Team (не просто subagents, а именно Agent Teams) для сборки нового выпуска дайджеста.

Команда из четырёх teammate:

1. **news-scout** — ищет новости через Tavily, отбирает по редполитике.
2. **writer** — пишет статьи по отобранным новостям.
3. **cover-artist** — генерит обложки по сигналу от writer.
4. **page-builder** — собирает выпуск, коммитит, пушит.

Зависимости:

- writer ждёт, пока news-scout закроет свою задачу.
- cover-artist работает параллельно с writer по сообщениям.
- page-builder ждёт сигнала от cover-artist.

Используй существующих агентов из `.claude/agents/`. Ты как лид — координируешь, не пишешь код сам.

Объём выпуска: 2–3 статьи (фиксируется в news-scout).
