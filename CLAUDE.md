# /CLAUDE.md

## Project

Дайджест новостей про bare metal AI-инфраструктуру (GPU-серверы, HPC, AI-воркстейшены). Контент на русском. Astro static blog → Vercel.

## Commands

Скрипты — в `package.json`. Линтера и тестов нет (не предлагай добавить без запроса).

## Workflow

- После изменений кода или контента — `npm run build`, убедиться что сборка не падает.

## Digest Pipeline

Автоматический пайплайн: `npm run digest`. Точка входа `scripts/digest.ts`, модули `scripts/lib/`. Стадии и ENV-ключи — в коде.

## Article Style

Before writing or editing articles in `src/content/`, read `.claude/rules/article-style.md`.

## Git

Before committing code, read `.claude/rules/git-workflow.md`.

## Compact Instructions

При сжатии контекста сохрани:

- Редполитику (стиль, объём, формат, запрещённые приёмы).
- Полный список статей, написанных в этой сессии (заголовок + файл).
- Текущую статью в работе (если есть).
- Ключевые решения и исправленные ошибки сессии.
