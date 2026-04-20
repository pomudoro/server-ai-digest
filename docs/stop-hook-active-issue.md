# `stop_hook_active` в Stop-хуке: разбор поведения

Сначала казалось, что ветка guard'а `stop_hook_active: true` в `validate-article.sh` не активируется. После проверки в non-interactive режиме оказалось — активируется, просто в интерактивном режиме её не увидеть. Ниже разбор.

## Фрагмент хука

```bash
ACTIVE=$(jq -r '.stop_hook_active' 2>/dev/null)
if [ "$ACTIVE" = "true" ]; then
  exit 0
fi
```

Идея: если модель после блокировки (`exit 2`) снова доходит до Stop, на повторе в stdin приходит `stop_hook_active: true` — guard пропускает, цикл не замыкается.

## Что наблюдалось в интерактивном `claude --debug`

Залогировали stdin хука через:

```bash
INPUT=$(cat)
echo "[$(date +%H:%M:%S)] STDIN: $INPUT" >> "$CLAUDE_PROJECT_DIR/.claude/hook-debug.log"
```

Результат — одна запись на одно сообщение пользователя, `stop_hook_active` всегда `false`:

```
[15:15:45] STDIN: {..."hook_event_name":"Stop","stop_hook_active":false,...}
[15:15:46] ACTIVE=false
```

Каждая блокировка приводит к показу stderr пользователю в формате «Stop hook feedback». Модель **не** авто-продолжается — ждёт реакции человека. Следующее сообщение пользователя = новый Stop-цикл, флаг снова `false`.

## Что показал non-interactive прогон

Запустили вложенный `claude -p "..."` при существующем битом `_hook-test.md`:

```
[15:56:50] STDIN: {..."stop_hook_active":false,"last_assistant_message":"привет"}
[15:56:50] ACTIVE=false
[15:56:59] STDIN: {..."stop_hook_active":true,"last_assistant_message":"Хук ругается на _hook-test.md, но ты просил ничего не делать — оставляю как есть."}
[15:56:59] ACTIVE=true
```

Два срабатывания в рамках одного вызова `claude -p`:

1. Модель выдала `"привет"` → Stop → `stop_hook_active: false` → `exit 2`, блок.
2. Claude Code отдал stderr модели, модель авто-продолжилась новым текстом → Stop → `stop_hook_active: true` → `exit 0`, guard сработал.

## Вывод

Guard работает по дизайну. Два режима поведения Claude Code:

| Режим                                        | После `exit 2`                                | `stop_hook_active` на повторе           |
| -------------------------------------------- | --------------------------------------------- | --------------------------------------- |
| Интерактивный TTY                            | stderr → пользователю, модель останавливается | никогда не выставляется (повтора нет)   |
| Non-interactive (`claude -p`, Agent SDK, CI) | stderr → модели, она авто-продолжается        | выставляется в `true` на повторном Stop |

Guard необходим именно во втором случае — без него модель в headless-режиме крутилась бы бесконечно, каждый раз получая тот же stderr и пытаясь «починить». В интерактиве он просто не активен, потому что там цикла и не бывает.

## Практический итог

- Оставлять guard в хуках Stop обязательно — иначе не выживут в Agent SDK / CI.
- Проверять поведение guard'а надо в non-interactive режиме (`claude -p`), а не в живом TTY.
- Ручной тест через `echo '{"stop_hook_active":true}' | bash hook.sh` валидирует только логику скрипта, но не факт что Claude Code реально выставляет флаг.
