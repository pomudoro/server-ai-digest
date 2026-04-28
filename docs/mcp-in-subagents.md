# Agent Team — рабочая конфигурация

Документ описывает корректную конфигурацию пайплайна (`news-scout` → `writer` → `cover-artist` → `page-builder`) для дайджеста.

## Ключевое различие: прямой Agent dispatch vs Agent Teams

В Claude Code есть два разных способа запустить подагента, и они **по-разному работают с MCP**:

| Механизм                                                             | Как запускается                             | MCP в подагенте                                                                                |
| -------------------------------------------------------------------- | ------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| **Прямой `Agent({...})`** (foreground или `run_in_background: true`) | Tool call `Agent` без `team_name`           | ✅ Работает: подагент наследует MCP от родителя или подключает по `mcpServers:` из frontmatter |
| **Agent Teams** (`TeamCreate` + `Agent({..., team_name, name})`)     | Teammate в команде с собственным контекстом | ⚠ Работает только при правильной форме frontmatter — см. секцию 2 ниже                         |

Эмпирически проверено в двух окружениях: Windows 11 + Git Bash (CC v2.1.121), WSL Ubuntu + tmux (CC v2.1.121).

## 1. MCP в подагентах через прямой Agent dispatch

### Рецепт

Frontmatter `.claude/agents/<name>.md`:

```yaml
tools: <базовые инструменты, БЕЗ MCP-имён и БЕЗ wildcard>
mcpServers:
  - <имя сервера ровно как ключ в .mcp.json>
```

Эффект:

- `tools:` фильтрует только базовые инструменты родителя (`Bash`, `Write`, `WebFetch`, `ToolSearch` и т.п.). Если поле опущено — наследуется всё.
- `mcpServers:` whitelist'ит MCP-серверы и инжектит **все** их инструменты в callable list **сразу** (не deferred). `tools:` MCP-инструменты не режет.

### Грабли

1. **Wildcard `mcp__<server>__*` в `tools:` ломает весь whitelist.** Парсер падает молча — подагент получает дефолтный минимум `Read/Grep/Glob`, всё остальное (включая корректно указанные имена и `ToolSearch`) обнуляется. Никогда не использовать wildcard для MCP в `tools:`.
2. **Имя сервера в `mcpServers:` должно совпадать с ключом `.mcp.json` буквально.** В нашем `.mcp.json` ключи — `tavily-mcp` и `replicate`. Несовпадение = сервер молча не подключается.

### Применённые конфиги

Production-агенты пайплайна используют расширенный явный формат — он работает **и в direct dispatch, и в team mode**. См. секцию 2 ниже про team mode.

`.claude/agents/news-scout.md`:

```yaml
tools: Read, Grep, Glob,
  ToolSearch,
  SendMessage,
  TaskCreate, TaskGet, TaskList, TaskUpdate,
  mcp__tavily-mcp__tavily_search, mcp__tavily-mcp__tavily_extract
mcpServers:
  - tavily-mcp
```

`.claude/agents/cover-artist.md`:

```yaml
tools: Read, Write, Edit, Bash,
  ToolSearch,
  SendMessage,
  TaskCreate, TaskGet, TaskList, TaskUpdate,
  mcp__replicate__create_models_predictions, mcp__replicate__get_predictions, mcp__replicate__download_files
mcpServers:
  - replicate
```

`.claude/agents/writer.md` и `.claude/agents/page-builder.md` MCP не используют, но получают `ToolSearch + SendMessage + Task*` для работы в team mode.

`mcpServers:` оставлен для совместимости с direct dispatch (там он работает и инжектит инструменты сразу, без `ToolSearch`). В team mode он игнорируется — но не мешает.

## 2. MCP в Agent Teams — точная картина

### Что говорит официальная дока

[code.claude.com/docs/en/agent-teams](https://code.claude.com/docs/en/agent-teams) прямым текстом:

> The `skills` and `mcpServers` frontmatter fields in a subagent definition are **not applied** when that definition runs as a teammate. Teammates load skills and MCP servers from your project and user settings, the same as a regular session.

И отдельно про tools:

> The teammate honors that definition's `tools` allowlist and `model`, and the definition's body is appended to the teammate's system prompt as additional instructions rather than replacing it. Team coordination tools such as `SendMessage` and the task management tools are **always available** to a teammate even when `tools` restricts other tools.

Первое утверждение эмпирически подтверждается, второе (про "always available") — **не подтверждается**. Подробности ниже.

### Эмпирическая матрица — 7 тестов под WSL Ubuntu + tmux, CC v2.1.121

| #   | `tools:` allowlist                                                    | `mcpServers:`            | MCP в teammate      | SendMessage | Task\* |
| --- | --------------------------------------------------------------------- | ------------------------ | ------------------- | ----------- | ------ |
| 1   | direct dispatch (без team)                                            | `tavily-mcp`/`replicate` | ✅                  | n/a         | n/a    |
| 2   | Teams in-process: `Read, Grep, Glob`                                  | `tavily-mcp`             | ❌                  | ✅          | ✅     |
| 3   | Teams + tmux: + явные MCP-имена                                       | —                        | ✅ через ToolSearch | ❌          | ❌     |
| 4   | Teams + tmux: + wildcard `mcp__server__*`                             | —                        | ❌                  | ❌          | ❌     |
| 5   | Teams + tmux: явные MCP + SendMessage + Task\* + ToolSearch           | —                        | ✅                  | ✅          | ✅     |
| 6   | Teams + tmux: SendMessage + Task\* (без MCP-имён)                     | `tavily-mcp`             | ❌                  | ✅          | ✅     |
| 7   | **Teams + tmux: ничего вообще** (только `name`/`description`/`model`) | —                        | **✅**              | **✅**      | **✅** |

### Закреплённые правила

1. **`mcpServers:` во frontmatter в team mode мёртв** (тесты #2, #6 vs #7). Дока это явно говорит, и эмпирика совпадает.
2. **`tools:` в team mode = эксклюзивный whitelist**: всё, что не перечислено явно (включая `SendMessage`, `TaskCreate/Get/List/Update`, `ToolSearch`) — недоступно (тесты #3, #6). Это **противоречит официальной доке** про "always available", но эмпирика однозначна (CC v2.1.121, оба окружения).
3. **Wildcard `mcp__server__*` в `tools:` молча схлопывает whitelist в 0** (тесты #4 + грабли из старых записей по Windows). Использовать только полные имена.
4. **MCP-инструменты deferred** — без `ToolSearch` их схема не подгружается, вызов вернёт `No such tool available`.
5. **MCP-серверы из `.mcp.json` подключаются к teammate-сессии** автоматически (видно по `claude mcp list` внутри teammate'а, статус `✓ Connected`). Вопрос только в том, выставлены ли их инструменты в callable list агента.

### Два рабочих рецепта для team mode

**Рецепт A — «голый» frontmatter (тест #7)**: оставить только `name`, `description`, `model`. Teammate унаследует ВСЁ — полный дефолтный набор tools + MCP из `.mcp.json` через ToolSearch. Самый простой и универсальный вариант.

```yaml
---
name: my-agent
description: ...
model: sonnet
---
```

Минус: нет явного whitelist'а — агент видит весь набор инструментов, что может мешать (например, scout не должен писать в файлы).

**Рецепт B — расширенный явный (тест #5)**: задать `tools:`, но обязательно включить туда `SendMessage`, все 4 `Task*`, `ToolSearch` и **полные имена** каждого MCP-инструмента, который нужен. `mcpServers:` можно совсем убрать — он бесполезен.

```yaml
---
name: my-agent
description: ...
model: sonnet
tools: Read, Bash, ToolSearch,
  SendMessage,
  TaskCreate, TaskGet, TaskList, TaskUpdate,
  mcp__tavily-mcp__tavily_search, mcp__tavily-mcp__tavily_extract
---
```

Используй B, если нужен whitelist; A — если нужен максимально простой конфиг.

### Подтверждение под Windows 11 + Git Bash, CC v2.1.121 (2026-04-28)

Гипотеза «team mode с MCP работает только в tmux» **не подтвердилась**. Оба рецепта прогнаны на Windows 11 + Git Bash в той же версии CC, что и WSL/tmux-сессия — поведение идентичное.

Сценарий теста: команда из 4 teammate'ов (`news-scout`, `writer`, `cover-artist`, `page-builder`), цепочка SendMessage по кругу, реальный вызов Tavily у скаута и реальная генерация Replicate `flux-schnell` у художника.

| Прогон         | `tools:`                       | `mcpServers:` | Tavily MCP | Replicate MCP (реальная генерация) | SendMessage chain ×4 |
| -------------- | ------------------------------ | ------------- | ---------- | ---------------------------------- | -------------------- |
| Win — Рецепт B | явный whitelist (см. секцию 1) | присутствует  | ✅ 5 res   | ✅ 38 414 байт webp                | ✅                   |
| Win — Рецепт A | отсутствует                    | отсутствует   | ✅ 5 res   | ✅ 44 700 байт webp                | ✅                   |

Выводы для Windows:

- Все правила из секции 2 валидны как на tmux/WSL, так и в Git Bash под Windows 11. Окружение терминала к расхождению поведения не приводит.
- Deferred-схема MCP-инструментов в обоих рецептах одинакова: без `ToolSearch select:<name>` вызов возвращает `No such tool available`, после `ToolSearch` — работает.
- Shutdown protocol (`shutdown_request` → `shutdown_response`) корректно завершает teammate'ов в Windows; у `page-builder` иногда требуется повторный запрос, но это не специфично для платформы.

### Что НЕ работает

- `tools: ..., mcp__server__*` — wildcard.
- `tools: Read, Grep, Glob` + `mcpServers: <server>` (наш старый рецепт для direct dispatch) — `mcpServers:` игнорируется в team mode, MCP не подключается.
- `tools: Read, Grep, Glob` без MCP-имён и без SendMessage — teammate замкнут на эти 3 инструмента, не может ни общаться с командой, ни вызывать MCP.

## 3. `gh pr create` в fork, не в upstream

В репо два remote: `origin` → `pomudoro/server-ai-digest` (наш fork), `upstream` → `miolamio/ai-digest`. По умолчанию `gh pr create` без `--repo` открывает PR в upstream.

`.claude/agents/page-builder.md` использует:

```bash
gh pr create --repo pomudoro/server-ai-digest --base main --head digest/YYYY-MM-DD \
  --title "feat(digest): дайджест YYYY-MM-DD" \
  --body "<маркированный список статей со ссылками на первоисточники>"
```

Контроль: URL созданного PR должен начинаться с `https://github.com/pomudoro/server-ai-digest/pull/`.

## 4. Валидация статьи перед `git commit`

`.claude/hooks/validate-article.sh` подключён как `PreToolUse` с matcher `Bash`. Скрипт фильтрует stdin: запускается только для команд `git commit*`, в остальных случаях молча `exit 0`. Проверяет staged md-файлы из `src/content/blog/` на обязательные поля frontmatter (`title`, `description`, `cover|image|heroImage`, `source`/URL). При нарушении возвращает `exit 2` — Claude видит причину в stderr, коммит блокируется.

Конфиг в `.claude/settings.json`:

```json
"PreToolUse": [
  {
    "matcher": "Bash",
    "hooks": [
      { "type": "command", "command": "bash \"$CLAUDE_PROJECT_DIR/.claude/hooks/block-dangerous.sh\"" },
      { "type": "command", "command": "bash \"$CLAUDE_PROJECT_DIR/.claude/hooks/validate-article.sh\"" }
    ]
  }
]
```

В Claude Code нет события `pre-commit` буквально (список событий: `PreToolUse`, `PostToolUse`, `Stop`, `SubagentStop`, `SessionStart`, `UserPromptSubmit`). «Pre-commit» реализован через `PreToolUse` + matcher `Bash` + фильтр в скрипте на префикс `git commit`. Stop-хук убран — он шумел в Agent Team-сессиях, срабатывая на каждом turn'e team-lead'а.

## Что НЕ исправлено

- `scripts/lib/search.ts` остался stub'ом — `searchNews()` возвращает пустой массив. Неинтерактивный `npm run digest` через `@tavily/core` не работает.
- В `.mcp.json` сервер называется `tavily-mcp` (имя пакета). Везде синхронизировано по факту.

## Сообщение для Telegram (преподавателю)

**В ДЗ_7 возник затык с вызовом MCP в subagents**

Пробовал в Claude Code 2.1.121 как на Windows 11 так и в WSL Ubuntu + tmux. В обоих вариантах одинаковое поведение.

1. MCP-инструменты нормально вызываются внутри обычных subagent через прямой `Agent({...})` dispatch (foreground и background режим), при условии что во frontmatter subagent указано:

```yaml
tools: <базовые инструменты, БЕЗ MCP-имён и БЕЗ wildcard>
mcpServers:
  - <имя MCP сервера ровно как ключ в .mcp.json>
```

например
```yaml
name: cover-artist
description: Генерирует обложки для статей дайджеста через Replicate. Получает задачи через сообщения от writer. Кладёт изображения в src/assets/digest/ и обновляет heroImage в frontmatter.
tools: Read, Write, Edit, Bash,
model: sonnet
mcpServers:
  - replicate
```

**2. Agent Teams (`TeamCreate` + `Agent({..., team_name, name})`).**
С Agent Teams конфиг из пункта 1 у меня не заработал. Поле `mcpServers:` во frontmatter **игнорируется** (в доке это тоже написано). Чтобы teammate в команде имел доступ к MCP, **а также к остальным инструментам — включая, как ни странно, `SendMessage` и `TaskCreate/Get/List/Update`**, у меня получилось этого добиться только двумя способами:

- либо прописать всё это явно в `tools:` (полные имена MCP-инструментов — например, `mcp__tavily-mcp__tavily_search`, `mcp__replicate__create_models_predictions` — плюс `ToolSearch`, `SendMessage`, все четыре `Task*`),
- либо вообще удалить `tools:` из frontmatter — тогда teammate унаследует полный набор + MCP из `.mcp.json` через `ToolSearch`.

Wildcard `mcp__server__*` в `tools:` у меня не работает. 

В официальной доке сказано «`SendMessage` and the task management tools are always available» — на практике в team mode они режутся точно так же, как и любой другой инструмент, не указанный в `tools:`.

Если же tools прописаны (и не содержат имен mcp и toolsearch, SendMessage), то teammate пытается вызвать mcp (tavily или replicate), у него не получается и team-lead делает это за него. Тоже самое с отправкой сообщений между teammates - попытка падает и teamlead отправляет сообщеие teammate вместо другого teammate. Даже в таком режиме задача выполнена, но не так как ожидается. 

