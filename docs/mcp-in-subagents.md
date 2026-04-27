# Agent Team — рабочая конфигурация

Документ описывает корректную конфигурацию пайплайна Agent Team (`news-scout` → `writer` → `cover-artist` → `page-builder`) для дайджеста. Только итоговое решение, без истории.

## 1. MCP в подагентах

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

`.claude/agents/news-scout.md`:

```yaml
tools: Read, Grep, Glob
mcpServers:
  - tavily-mcp
```

`.claude/agents/cover-artist.md`:

```yaml
tools: Read, Write, Edit, Bash
mcpServers:
  - replicate
```

### Альтернатива (когда нужно ограничить набор)

Если хочется отдать подагенту не весь сервер, а подмножество инструментов — указывать **полные имена** в `tools:` плюс обязательно `ToolSearch`. Без `ToolSearch` deferred-схему не подгрузить.

```yaml
tools: Read, Grep, Glob, ToolSearch,
  mcp__tavily-mcp__tavily_search,
  mcp__tavily-mcp__tavily_extract
```

Многословно и хрупко — использовать только при реальной нужде в ограничении.

## 2. `gh pr create` в fork, не в upstream

В репо два remote: `origin` → `pomudoro/server-ai-digest` (наш fork), `upstream` → `miolamio/ai-digest`. По умолчанию `gh pr create` без `--repo` открывает PR в upstream.

`.claude/agents/page-builder.md` использует:

```bash
gh pr create --repo pomudoro/server-ai-digest --base main --head digest/YYYY-MM-DD \
  --title "feat(digest): дайджест YYYY-MM-DD" \
  --body "<маркированный список статей со ссылками на первоисточники>"
```

Контроль: URL созданного PR должен начинаться с `https://github.com/pomudoro/server-ai-digest/pull/`.

## 3. Валидация статьи перед `git commit`

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

- `scripts/lib/search.ts` остался stub'ом — `searchNews()` возвращает пустой массив. Неинтерактивный `npm run digest` через `@tavily/core` не работает; пайплайн через Agent Team работает в обход скрипта.
- В `.mcp.json` сервер называется `tavily-mcp` (имя пакета). Везде синхронизировано по факту.
