import type { DigestConfig } from './config.ts';
import type { SearchResult } from './search.ts';

export interface SelectedTopic {
  title: string;
  sourceUrl: string;
  sourceContent: string;
  slug: string;
  tags: string[];
  reasoning: string;
}

/**
 * Отбирает 3-5 самых интересных тем из результатов поиска через Claude.
 * Claude выступает как редактор — оценивает новостную ценность, разнообразие,
 * релевантность тематике блога.
 *
 * TODO (Ступень 5): подключить @anthropic-ai/sdk с structured output
 *
 * Системный промпт для Claude:
 * - Роль: редактор русскоязычного технического блога об AI-серверном оборудовании
 * - Приоритет: запуск новых продуктов, бенчмарки, крупные анонсы вендоров
 * - Избегать: мелкие обновления прошивок, спекуляции, маркетинг, финансовые новости
 */
export async function selectTopics(
  results: SearchResult[],
  _config: DigestConfig,
): Promise<SelectedTopic[]> {
  console.log(`[select] Отбор тем из ${results.length} результатов...`);

  if (results.length === 0) {
    console.log('[select] Нет результатов для отбора.');
    return [];
  }

  // TODO: заменить на реальный вызов Claude messages.parse()
  // const Anthropic = (await import('@anthropic-ai/sdk')).default;
  // const { zodOutputFormat } = await import('@anthropic-ai/sdk/helpers/zod');
  // const { z } = await import('zod');
  //
  // const client = new Anthropic();
  // const TopicsSchema = z.object({
  //   topics: z.array(z.object({
  //     title: z.string(),
  //     sourceUrl: z.string().url(),
  //     sourceContent: z.string(),
  //     slug: z.string(),
  //     tags: z.array(z.string()),
  //     reasoning: z.string(),
  //   })),
  // });
  //
  // const message = await client.messages.parse({
  //   model: 'claude-sonnet-4-5',
  //   max_tokens: 4096,
  //   system: SYSTEM_PROMPT,
  //   messages: [{ role: 'user', content: formatResults(results) }],
  //   output_config: { format: zodOutputFormat(TopicsSchema) },
  // });
  // return message.parsed_output.topics;

  console.log('[select] STUB: возвращаю пустой массив. Подключи Claude на Ступени 5.');
  return [];
}
