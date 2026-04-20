# Хуки Claude Code на Windows 11

## TL;DR

На Windows хуки Claude Code исполняются в **git-bash / MSYS**, а пути в `tool_input.file_path` приходят с **бэкслешами** (`C:\Users\...`). Классическая связка `jq -r ... | xargs <cmd>` ломается: `xargs` интерпретирует `\` как escape и склеивает путь в мусор вроде `C:UsersakuzmlocalAI...`.

Решение — **конвертировать `\` в `/` ещё в `jq`**, до `xargs`.

## Рабочий PostToolUse-хук (пример: prettier)

```json
"hooks": {
  "PostToolUse": [
    {
      "matcher": "Edit|Write",
      "hooks": [
        {
          "type": "command",
          "command": "jq -r '.tool_input.file_path | gsub(\"\\\\\\\\\"; \"/\")' | xargs npx prettier --write 2>/dev/null; exit 0"
        }
      ]
    }
  ]
}
```

Ключевое:

- `gsub("\\\\"; "/")` в jq — заменяет все `\` на `/`. В JSON экранирование четырёхкратное (`\\\\\\\\` → jq-строка `"\\\\"` → regex `\\` → символ `\`).
- `2>/dev/null; exit 0` — тихий режим, никогда не блокирует инструмент. Для отладки временно убрать.

## Предпосылки

- `jq` в PATH (проверка: `jq --version`). На Windows — через `winget install jqlang.jq`.
- Node.js + npm в PATH (`npx --version`).
- Нужный форматёр доступен (`npx prettier --version`, или указать конкретную версию).

## Отладка хука

Хуки выполняются в **отдельном шелле**, их stdout/stderr по умолчанию не видно. Три способа заглянуть:

1. **Флаг `--debug`** при запуске Claude Code — печатает ввод хука и его вывод.
2. **Команда `/hooks`** в интерактиве — показывает, какие хуки зарегистрированы и для каких матчеров.
3. **Временный лог-файл**: подменить команду на
   ```
   tee -a "$CLAUDE_PROJECT_DIR/.claude/hook.log" | <оригинальная команда> 2>>"$CLAUDE_PROJECT_DIR/.claude/hook.log"; exit 0
   ```
   `tee` записывает stdin (реальный JSON от Claude Code) в файл, `2>>` добавляет stderr. После диагностики вернуть обычную команду и удалить лог.

## Формат stdin хука

Claude Code подаёт на stdin JSON вида:

```json
{
  "session_id": "...",
  "transcript_path": "...",
  "cwd": "C:\\Users\\akuzm\\...",
  "permission_mode": "acceptEdits",
  "hook_event_name": "PostToolUse",
  "tool_name": "Write",
  "tool_input": { "file_path": "C:\\Users\\akuzm\\...\\file.js", "content": "..." },
  "tool_response": { ... },
  "tool_use_id": "toolu_..."
}
```

Все Windows-пути — с двойными `\\` в JSON (т.е. одиночными `\` в значении).

## Коды возврата

| Exit code | Поведение                                                              |
| --------- | ---------------------------------------------------------------------- |
| `0`       | stdout попадает в transcript (виден по `ctrl+o`)                       |
| `2`       | stderr немедленно показывается модели                                  |
| иное      | stderr показывается пользователю, действие инструмента не откатывается |

Для «молчаливых» форматеров всегда завершать `exit 0`, подавляя ошибки (`2>/dev/null`), иначе шум в транскрипте.

## Типичные грабли на Windows

- **`xargs` съедает `\`** — основная проблема, см. выше.
- **Пробелы в пути** (`C:\Users\Имя Фамилия\...`) — тогда без `xargs` надёжнее:
  ```
  f=$(jq -r '.tool_input.file_path'); npx prettier --write "$f"
  ```
- **Node-обёртки вроде `npx.cmd`** не нужны в хуке — git-bash сам находит `npx`.
- **CRLF в bash-скриптах** (если `command` указывает на `.sh`-файл) — сохранять с LF, иначе `\r: command not found`.
- **`$CLAUDE_PROJECT_DIR`** работает только внутри хуков Claude Code, в обычном шелле его нет.

## Проверка вручную

Симулировать ровно то, что делает Claude Code:

```bash
echo '{"tool_input":{"file_path":"C:\\\\Users\\\\you\\\\file.js"}}' \
  | jq -r '.tool_input.file_path | gsub("\\\\"; "/")' \
  | xargs npx prettier --write
```

Если команда падает здесь — упадёт и в хуке.
