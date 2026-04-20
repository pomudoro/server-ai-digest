---
name: hello
description: Greet the user with current date and recent git history
allowed-tools: Read Grep Glob
---
Поприветствуй пользователя. Покажи:

Текущую дату: !date "+%Y-%m-%d %H:%M"

Последние 3 коммита:
!git log --oneline -3

Оформи как краткую сводку: дата, список коммитов, одно предложение о текущем состоянии проекта.
Если в проекте есть README.md — прочитай его и добавь краткое описание проекта.