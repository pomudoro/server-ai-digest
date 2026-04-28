# Claude Code Review через GitHub Actions: рабочий сетап

Документ описывает финальную конфигурацию автоматического ревью PR с помощью плагина `code-review` из marketplace `claude-code-plugins` и action `anthropics/claude-code-action@v1`. Зафиксирована та комбинация настроек, которая фактически постит ревью в тред PR — все промежуточные грабли описаны ниже.

## Архитектура

```
PR opened/synchronize
  └─► .github/workflows/claude-code-review.yml
        └─► anthropics/claude-code-action@v1
              ├─ авторизация: CLAUDE_CODE_OAUTH_TOKEN (подписка) либо ANTHROPIC_API_KEY
              ├─ marketplace: anthropics/claude-code (репо)
              ├─ plugin: code-review@claude-code-plugins
              └─ prompt: /code-review:code-review <repo>/pull/<num> --comment
                    └─► Claude читает diff + .claude/rules/* + CLAUDE.md
                    └─► постит inline-комментарии или summary
```

## Установка

Однократно из интерактивной сессии Claude Code (REPL):

```
/install-github-app
```

Команда:

1. Открывает OAuth-флоу установки GitHub App `apps/claude` — выбираешь репозиторий вручную (требуются права admin).
2. Кладёт в repository secrets либо `ANTHROPIC_API_KEY` (если выбрал Claude API), либо `CLAUDE_CODE_OAUTH_TOKEN` (если выбрал OAuth подписки Pro/Max).
3. Создаёт PR с `.github/workflows/claude.yml` и `.github/workflows/claude-code-review.yml`. Содержимое — заготовки от Anthropic, требуют доработки (см. ниже).

## Финальный `claude-code-review.yml`

```yaml
name: Claude Code Review

on:
  pull_request:
    types: [opened, synchronize, ready_for_review, reopened]

jobs:
  claude-review:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write
      issues: write
      id-token: write

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 1

      - name: Run Claude Code Review
        id: claude-review
        uses: anthropics/claude-code-action@v1
        with:
          claude_code_oauth_token: ${{ secrets.CLAUDE_CODE_OAUTH_TOKEN }}
          show_full_output: true
          plugin_marketplaces: "https://github.com/anthropics/claude-code.git"
          plugins: "code-review@claude-code-plugins"
          prompt: "/code-review:code-review ${{ github.repository }}/pull/${{ github.event.pull_request.number }} --comment"
          claude_args: |
            --append-system-prompt "Focus on critical issues only."
            --allowedTools "Bash(gh:*)"
```

Отличия от заготовки `/install-github-app`:

| Поле               | Заготовка   | Должно быть                                                  | Зачем                                                                                                                                      |
| ------------------ | ----------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `pull-requests`    | `read`      | `write`                                                      | Без write action не может постить ревью-комментарии. Job завершается зелёным, но в треде пусто.                                            |
| `issues`           | `read`      | `write`                                                      | Аналогично — нужен для summary-комментариев.                                                                                               |
| `prompt` (хвост)   | без флага   | `--comment`                                                  | Плагин `code-review` без `--comment` пишет результат только в логи (см. источник плагина).                                                 |
| `show_full_output` | отсутствует | `true`                                                       | Опционально. Включает в логи run полный JSON ответа Claude — полезно для отладки.                                                          |
| `claude_args`      | отсутствует | `--append-system-prompt ...` + `--allowedTools "Bash(gh:*)"` | Фильтр критичности и разрешение `gh` CLI для постинга inline-комментариев. Подробности — в разделе «Тонкая настройка через `claude_args`». |

## Авторизация: OAuth подписки vs API key

При `/install-github-app` действует выбор:

- **OAuth подписки (Pro/Max).** Secret называется `CLAUDE_CODE_OAUTH_TOKEN`. Расходует квоту твоего Claude-плана. Удобно для соло-разработки.
- **Claude API.** Secret называется `ANTHROPIC_API_KEY`. Расходует токены по API-тарифу.

В workflow поле `claude_code_oauth_token` или `anthropic_api_key` соответственно. Использовать одновременно нельзя.

## Грабли, на которые потрачено время

1. **PR с правкой workflow всегда падает с 401 `Workflow validation failed`.** `anthropics/claude-code-action` сравнивает workflow на head-ветке и на default-бранче побайтово; если различаются — отказывается выдавать OIDC-токен. Это by-design защита от подмены workflow в PR. Решение: мёрджить такой PR не дожидаясь зелёного, на следующем PR (без правки workflow) action заработает. Если же нужно протестить новую конфигурацию workflow на уже открытом PR — мёрдж main в head-ветку выровняет workflow и следующий push на head запустит ревью на новом конфиге.

2. **PR с merge-конфликтами не запускает `pull_request`-workflow.** GitHub не строит виртуальный merge-коммит, чекаут пустой, action молча не стартует. Нужно сначала разрешить конфликт.

3. **`code-review` плагин не постит ничего без `--comment`.** Источник: `plugins/code-review/commands/code-review.md` в репозитории `anthropics/claude-code`:

   > "If `--comment` argument was NOT provided, stop here. Do not post any GitHub comments."
   > "If `--comment` argument IS provided and NO issues were found, post a summary comment using `gh pr comment` and stop."

   Эта проблема выглядит как ложное "ревью прошло, но ничего не написал" — самая запутывающая из всех.

4. **`show_full_output: true` критично для отладки.** Без него лог run скрывает рассуждения Claude (`full output hidden for security`). При непустом `permission_denials` или при пустом ответе плагина без него непонятно что произошло.

5. **`permission_denials_count > 0` в результате — ожидаемо, но иногда блокирует постинг.** По умолчанию `Bash` отключён; плагин пытается запускать `python3`, `node`, `wc`, `gh api` и натыкается на `permission_denials`. В большинстве случаев плагин находит обходной путь (например, через `gh pr comment`, который входит в дефолтный allowlist). Но **когда issue привязан к строке кода и плагин хочет inline-комментарий**, всё ломается:
   - MCP-tool `mcp__github_inline_comment__create_inline_comment` в action'е `@v1` **не подключён** (логи: «inline comment tool is not available»).
   - Fallback на `gh api repos/.../pulls/{n}/reviews` через `Bash` — отклоняется `permission_denials`.
   - В итоге: ревью отрабатывает `success`, в треде ничего не появляется.

   Решение — добавить `--allowedTools "Bash(gh:*)"` в `claude_args`. Подробнее в следующем разделе.

## Тонкая настройка через `claude_args`

Поле `claude_args` в action'е принимает CLI-флаги Claude Code. Через него удобно тюнить плагин без правки самого плагина.

### `--append-system-prompt` — фильтр по критичности

```yaml
claude_args: |
  --append-system-prompt "Focus on critical issues only."
```

Дополняет системный промпт плагина дополнительной директивой. Не путать с `--system-prompt` — тот **заменяет** системный промпт целиком и сломал бы плагин.

Эффект на тестовом PR с двумя проблемами (command injection + стилистический нит про кавычки): Claude явно классифицировал нит как «low-severity nit» и отбросил его, оставил только critical issue. В summary написал «1 issue found» (а не «2»).

Класть подобную инструкцию прямо в `prompt:` нельзя — там уже занят slash-командой плагина (`/code-review:code-review ... --comment`), парсер не примет дополнительный текст. `--append-system-prompt` — единственный валидный путь добавить директиву поверх плагина.

### `--allowedTools "Bash(gh:*)"` — разрешение на `gh` CLI

```yaml
claude_args: |
  --allowedTools "Bash(gh:*)"
```

Без этого плагин не может запостить inline-комментарии (см. граблю #5). Синтаксис — `Bash(<cmd>:*)`, через запятую без пробелов можно несколько: `Bash(gh:*),Bash(npm:*)`. Можно и точечнее: `Bash(gh api:*),Bash(gh pr view:*)` — но `gh:*` практичнее, потому что `gh` это GitHub CLI с фиксированным набором подкоманд (не путь к произвольному выполнению), и не придётся подкручивать список при каждом обновлении плагина.

Action всё равно ходит под `GITHUB_TOKEN` workflow'а с правами из блока `permissions:` — `gh` физически не может сделать больше того, что разрешено самому workflow'у.

### Что не нужно ставить

- `--max-turns N` без явной нужды. На реальных дайджестных PR плагин жжёт 16-22 хода (`num_turns` в логах). Лимит ниже **20** скорее всего сломает ревью на полпути. Если ставить — `--max-turns 30` с запасом.
- `--model <name>` без причины. Дефолт action — `claude-sonnet-4-6` с автоматической делегацией мелких подзадач на `claude-haiku-4-5`. Это разумная экономия, не имеет смысла её ломать.

## Что плагин фактически делает

Плагин `code-review`:

- читает diff PR через GitHub API;
- читает `CLAUDE.md`, `.claude/rules/*` и любые правила, на которые они ссылаются;
- ищет баги, нарушения договорённостей, проблемы безопасности;
- если есть issue с привязкой к строке — постит inline-комментарий через `mcp__github_inline_comment__create_inline_comment` (в нашем сетапе MCP-tool недоступен, плагин падает обратно на `gh api repos/.../pulls/{n}/reviews` — для этого и нужен `--allowedTools "Bash(gh:*)"`);
- если issue без привязки к строке (commit message, имя ветки) — постит summary через `gh pr comment`;
- если ничего не нашёл — постит summary `No issues found. Checked for bugs and CLAUDE.md compliance.`

Не делает: типчек, тестирование, исполнение кода, архитектурные суждения, бизнес-логику. Это "первый ревьюер", не финальный гейт.

## Примеры найденных нарушений

### PR #4 — мета-уровень (commit message, branch name)

На PR с `format change` + `docs(mcp): ...` Claude нашёл:

- Коммит `2f613eb` (`format change`) не соответствует Conventional Commits — нет типа и `:`. Подсказал переименовать в `docs(mcp): format section as plain prose`.
- Ветка `digest/2026-04-28` использует тип `digest`, которого нет в allowed-list `.claude/rules/git-workflow.md` (`feat, fix, docs, refactor, test, chore`). Отметил, что если `digest/YYYY-MM-DD` — устоявшаяся конвенция автопайплайна, стоит явно добавить `digest` в правила.

Запостил через `gh pr comment` (общий summary к PR), потому что issues без привязки к строкам кода.

### PR #11 — security (фильтрация критичности + inline-постинг)

Тестовый PR с одним файлом `scripts/lib/test-helper.ts`, в котором два умышленных дефекта:

- Стилистический нит: `const base = 'https://example.com/search?q=' ;` — одинарные кавычки + лишний пробел перед `;`.
- Critical: `runDangerousQuery(input)` с `execSync(\`echo ${input}\`)` — command injection.

С настройкой `--append-system-prompt "Focus on critical issues only."` + `--allowedTools "Bash(gh:*)"`:

- Стилистический нит **отфильтрован** — Claude в логах явно классифицировал его как «low-severity nit» и выкинул, в комментарии его нет.
- Command injection помечен как critical, идентифицирован как **CWE-78**, привязан к строкам 11-12 файла.
- Комментарий запостился inline через `gh api repos/.../pulls/11/reviews` — на конкретные строки кода, с **Suggested change** блоком (готовая правка через `execFileSync` с argv-массивом, кнопка «Commit suggestion» прямо в UI).

В summary написано буквально «1 issue found» — не «2». Фильтр работает.

## Что осталось как опции

- **Branch protection**: можно сделать `claude-review` required check, чтобы PR без зелёного ревью физически нельзя было мёрджить.
- **Path filtering**: `pull_request.paths` в workflow ограничит ревью только нужными директориями.
- **Author filtering**: блок `if: github.event.pull_request.author_association == 'FIRST_TIME_CONTRIBUTOR'` заставит ревьюить только новых контрибьюторов (полезно для open source).
- **Tag-mode (`@claude` в комментариях)**: уже стоит через `claude.yml`, отдельный workflow на `issue_comment`.
- **Локальная альтернатива**: команда `/review` в интерактивном Claude Code делает то же, но против рабочего дерева, без CI-минут. Полезно для соло-разработки до этапа PR.

## Источники

- [Claude Code GitHub Actions docs](https://docs.claude.com/en/docs/claude-code/github-actions)
- [anthropics/claude-code-action на GitHub](https://github.com/anthropics/claude-code-action)
- `plugins/code-review/commands/code-review.md` в репо [anthropics/claude-code](https://github.com/anthropics/claude-code)
