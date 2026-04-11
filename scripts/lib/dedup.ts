import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

/**
 * Читает все .md файлы из blogDir и возвращает Set существующих source URL.
 * Используется для дедупликации — не генерировать статьи по уже освещённым новостям.
 */
export async function getExistingSources(blogDir: string): Promise<Set<string>> {
  const sources = new Set<string>();
  const sourceRegex = /^source:\s*['"]?(.+?)['"]?\s*$/m;

  try {
    const files = await readdir(blogDir);

    for (const file of files) {
      if (!file.endsWith('.md') && !file.endsWith('.mdx')) continue;

      const content = await readFile(join(blogDir, file), 'utf-8');
      const match = content.match(sourceRegex);
      if (match) {
        sources.add(match[1]);
      }
    }
  } catch (err) {
    console.warn('[dedup] Не удалось прочитать посты, продолжаю без дедупликации:', err);
  }

  return sources;
}
