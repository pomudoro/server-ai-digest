# Vitest и скрипт `"test": "vitest run"`

## TL;DR

**Vitest** — фреймворк для unit-тестов на JS/TS, построенный поверх Vite. Быстрый старт, нативная поддержка TypeScript и ESM, API совместим с Jest.

Скрипт `"test": "vitest run"` в `package.json` нужен, чтобы `npm test` запускал тесты **один раз и выходил** — без watch-режима, который зависает в CI, хуках и Claude Code.

## Что такое Vitest

Берёт файлы `*.test.ts` / `*.spec.ts`, исполняет их, показывает какие проверки прошли.

```ts
import { expect, test } from "vitest";
import { sum } from "./math";

test("2 + 2 = 4", () => {
  expect(sum(2, 2)).toBe(4);
});
```

**Почему именно Vitest:**

- Нативный TypeScript и ESM — без Babel / `ts-jest`.
- Быстрый — переиспользует трансформер и кеш Vite.
- API как у Jest (`describe`, `test`, `expect`, моки) — миграция почти бесплатная.
- Coverage, snapshot, моки — из коробки, без допзависимостей.

## Установка

```bash
npm install -D vitest
```

В `package.json`:

```json
{
  "scripts": {
    "test": "vitest run"
  }
}
```

Проверка:

```bash
npx vitest run
```

Если тестов ещё нет — увидишь `No test files found`. Это нормально.

## Почему именно `vitest run`, а не просто `vitest`

По умолчанию `vitest` (без аргументов) стартует в **watch-режиме**: следит за файлами и перезапускает тесты при изменениях. Для ручной разработки удобно, но:

- **CI** зависнет — процесс не завершается, pipeline отваливается по таймауту.
- **Pre-commit хуки** (Husky, lint-staged) зависнут так же.
- **Claude Code** вызовет `npm test` и будет ждать завершения вечно.

Флаг `run` говорит Vitest: «прогнать все тесты один раз и выйти с кодом 0 или 1».

Для локальной разработки в watch-режиме добавляют отдельный скрипт:

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

## Зачем именно скрипт `test` в `package.json`

1. **Стандартный контракт npm** — `npm test` знает любой разработчик, ему не важно, какой раннер внутри.
2. **Автоматизация** — хуки Claude Code, GitHub Actions, pre-commit вызывают `npm test`, а не `npx vitest run`.
3. **Унификация** — замена Vitest на Jest правит одну строку, а не CI-конфиги и инструкции.

## В этом проекте

В `cc-basics-blog-vdov` тестов нет — в `CLAUDE.md` явно: _«Линтера и тестов нет (не предлагай добавить без запроса)»_. Этот документ — справочник на случай, если Vitest понадобится в будущем или упоминается в статьях блога.
