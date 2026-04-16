# MCP: подключение и переменные окружения

## Файл конфигурации

`.mcp.json` в корне проекта — автоматически подхватывается Claude Code при запуске в этой папке.

Синтаксис для секретов: `${VAR_NAME}` (со знаком доллара и в кавычках). Значение подставляется **из shell-окружения**, а не из `.env` проекта.

Пример (`.mcp.json`):

```json
{
  "mcpServers": {
    "tavily-mcp": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "tavily-mcp@latest"],
      "env": {
        "TAVILY_API_KEY": "${TAVILY_API_KEY}"
      }
    }
  }
}
```

Проверка подключения: `/mcp` в Claude Code — статус `connected`.

## Варианты сохранения env-переменной (Windows)

| Способ | Область действия | Команда |
|---|---|---|
| `setx` (persistent, user-level) | все новые процессы после перезапуска терминала | `setx TAVILY_API_KEY "tvly-..."` |
| PowerShell (на сессию) | только текущее окно PowerShell | `$env:TAVILY_API_KEY = "tvly-..."` |
| Git Bash / WSL (на сессию) | только текущее окно | `export TAVILY_API_KEY=tvly-...` |
| cmd.exe (на сессию) | только текущее окно | `set TAVILY_API_KEY=tvly-...` |
| Control Panel → System → Env Vars | persistent, через GUI | вручную |

Для постоянного использования в Claude Code рекомендуется `setx` либо GUI.

### Проверка значения

- PowerShell: `echo $env:TAVILY_API_KEY` (не `$TAVILY_API_KEY` — это другое пространство имён!)
- Git Bash: `echo $TAVILY_API_KEY`
- cmd.exe: `echo %TAVILY_API_KEY%`

### Важные нюансы

- `setx` применяется только к **новым** процессам. Нужно полностью закрыть и открыть терминал (а также Claude Code / VS Code), а не просто новую вкладку.
- `.env` в репозитории **не подставляется** в `${VAR}` внутри `.mcp.json` — MCP читает shell-окружение.
- `setx` имеет лимит значения 1024 символа.

## Замена значения TAVILY_API_KEY

1. Получить новый ключ на [app.tavily.com](https://app.tavily.com/) → API Keys (префикс `tvly-`).
2. Перезаписать переменную (старое значение будет затёрто):
   ```
   setx TAVILY_API_KEY "tvly-НОВЫЙ_КЛЮЧ"
   ```
3. Полностью закрыть все терминалы и Claude Code / VS Code.
4. Открыть заново, проверить:
   ```powershell
   echo $env:TAVILY_API_KEY
   ```
5. Протестировать MCP: запустить любой Tavily-запрос в Claude Code.

### Удалить переменную

```
setx TAVILY_API_KEY ""
```
или через `reg delete "HKCU\Environment" /v TAVILY_API_KEY /f`.

## Troubleshooting

| Симптом | Причина | Решение |
|---|---|---|
| `Invalid API key` | неправильный / устаревший ключ, либо MCP-процесс запустился со старым env | перезапустить Claude Code целиком |
| `echo $env:VAR` пусто | `setx` не применился к текущему процессу | открыть новый терминал от родителя, запущенного **после** `setx` |
| `echo $VAR` пусто в PowerShell | неверный синтаксис | использовать `$env:VAR` |
| MCP сервер не появляется в `/mcp` | ошибка в `.mcp.json` (невалидный JSON, плейсхолдер без `${}`) | проверить JSON и синтаксис подстановки |
