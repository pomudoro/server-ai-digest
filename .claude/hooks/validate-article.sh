#!/bin/bash
# PreToolUse-хук: валидация статьи перед `git commit`.
# Срабатывает на любой Bash, фильтрует только команды `git commit*`.
# Проверяет staged md-файлы в src/content/blog/ на обязательные поля frontmatter.
# Exit 0 = разрешить tool. Exit 2 = заблокировать tool, stderr виден Claude.

INPUT=$(cat)

TOOL_NAME=$(printf '%s' "$INPUT" | jq -r '.tool_name' 2>/dev/null)
if [ "$TOOL_NAME" != "Bash" ]; then
  exit 0
fi

CMD=$(printf '%s' "$INPUT" | jq -r '.tool_input.command' 2>/dev/null)
if ! [[ "$CMD" =~ ^[[:space:]]*git[[:space:]]+commit([[:space:]]|$) ]]; then
  exit 0
fi

ARTICLES=$(git diff --cached --name-only --diff-filter=ACM 2>/dev/null | grep -E '^src/content/blog/.*\.md$' || true)
if [ -z "$ARTICLES" ]; then
  exit 0
fi

ERRORS=""
while IFS= read -r ARTICLE; do
  [ -z "$ARTICLE" ] && continue
  [ -f "$ARTICLE" ] || continue

  if ! grep -q "^title:" "$ARTICLE"; then
    ERRORS="${ERRORS}${ARTICLE}: missing title. "
  fi
  if ! grep -q "^description:" "$ARTICLE"; then
    ERRORS="${ERRORS}${ARTICLE}: missing description. "
  fi
  if ! grep -qE "^(cover|image|heroImage):" "$ARTICLE"; then
    ERRORS="${ERRORS}${ARTICLE}: missing cover image. "
  fi
  if ! grep -qE "(^source:|https?://)" "$ARTICLE"; then
    ERRORS="${ERRORS}${ARTICLE}: missing source link. "
  fi
done <<< "$ARTICLES"

if [ -n "$ERRORS" ]; then
  echo "Article validation failed: ${ERRORS}" >&2
  exit 2
fi

exit 0
