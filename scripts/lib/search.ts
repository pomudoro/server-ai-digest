import type { DigestConfig } from './config.ts';

export interface SearchResult {
  title: string;
  url: string;
  content: string;
  publishedDate?: string;
}

const QUERIES = [
  'AI GPU server new launch 2026',
  'NVIDIA Blackwell Grace server',
  'Supermicro Dell HPE AI server',
  'HPC cluster AI training inference hardware',
  'liquid cooling NVLink InfiniBand AI datacenter',
];

/**
 * Ищет новости через Tavily API по предопределённым запросам.
 * Каждый запрос: topic: "news", days: 7, maxResults: 10.
 *
 * TODO (Ступень 5): подключить @tavily/core
 */
export async function searchNews(config: DigestConfig): Promise<SearchResult[]> {
  console.log('[search] Поиск новостей...');
  console.log(`[search] Запросы: ${QUERIES.length}`);

  // TODO: заменить на реальный вызов Tavily
  // const { tavily } = await import('@tavily/core');
  // const tvly = tavily({ apiKey: config.tavilyApiKey });
  // for (const query of QUERIES) {
  //   const result = await tvly.search(query, {
  //     topic: 'news',
  //     days: 7,
  //     maxResults: 10,
  //     includeRawContent: 'markdown',
  //   });
  //   ...
  // }

  console.log('[search] STUB: возвращаю пустой массив. Подключи Tavily на Ступени 5.');
  return [];
}

/**
 * Фильтрует результаты: убирает уже существующие URL и дубликаты между запросами.
 */
export function deduplicateResults(
  results: SearchResult[],
  existingSources: Set<string>,
): SearchResult[] {
  const seen = new Set<string>();
  return results.filter((r) => {
    if (existingSources.has(r.url) || seen.has(r.url)) return false;
    seen.add(r.url);
    return true;
  });
}
