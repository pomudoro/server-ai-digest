#!/bin/bash
# Блокировка commit/push на ветке main.
# Хук PreToolUse: проверяет, что текущая ветка не main для git commit/push.
# Exit 0 = разрешить. Exit 2 = заблокировать.

INPUT=$(cat)
CMD=$(echo "$INPUT" | jq -r '.tool_input.command // ""' 2>/dev/null)
CWD=$(echo "$INPUT" | jq -r '.cwd // ""' 2>/dev/null)

if [ -z "$CMD" ] || [ "$CMD" = "null" ]; then
  exit 0
fi

BRANCH=$(git -C "$CWD" symbolic-ref --short HEAD 2>/dev/null || echo "")

if [ "$BRANCH" = "main" ] && echo "$CMD" | grep -qE '^[[:space:]]*git[[:space:]]+(commit|push)\b'; then
  echo "Blocked: на main коммитить/пушить нельзя — создай ветку (digest/* или feat/*) и открой PR" >&2
  exit 2
fi

exit 0
