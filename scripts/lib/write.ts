import type { DigestConfig } from './config.ts';
import type { SelectedTopic } from './select.ts';

export interface Article {
  title: string;
  description: string;
  body: string;
  tags: string[];
  slug: string;
  sourceUrl: string;
}

/**
 * Пишет статью по выбранной теме через Claude.
 * Промпт включает стиль из CLAUDE.md и пример sample-digest-post.md.
 *
 * TODO (Ступень 5): подключить @anthropic-ai/sdk с structured output
 *
 * Стиль статьи:
 * - Русский язык, английские термины как есть
 * - 300-500 слов
 * - Разговорный тон, 1-е лицо множественного числа
 * - Без маркетинга, без эмодзи
 * - Ссылка на первоисточник обязательна
 */
export async function writeArticle(
  topic: SelectedTopic,
  _config: DigestConfig,
): Promise<Article | null> {
  console.log(`[write] Пишу статью: ${topic.title}`);

  // TODO: заменить на реальный вызов Claude messages.parse()
  // const Anthropic = (await import('@anthropic-ai/sdk')).default;
  // const { zodOutputFormat } = await import('@anthropic-ai/sdk/helpers/zod');
  // const { z } = await import('zod');
  //
  // const ArticleSchema = z.object({
  //   title: z.string(),
  //   description: z.string(),
  //   body: z.string(),
  //   tags: z.array(z.string()),
  //   slug: z.string(),
  // });
  //
  // const client = new Anthropic();
  // const message = await client.messages.parse({
  //   model: 'claude-sonnet-4-5',
  //   max_tokens: 4096,
  //   system: WRITE_SYSTEM_PROMPT,
  //   messages: [{ role: 'user', content: topic.sourceContent }],
  //   output_config: { format: zodOutputFormat(ArticleSchema) },
  // });
  // return { ...message.parsed_output, sourceUrl: topic.sourceUrl };

  console.log('[write] STUB: пропускаю. Подключи Claude на Ступени 5.');
  return null;
}

/**
 * Пишет все статьи последовательно. Если одна упала — пропускает, продолжает.
 */
export async function writeArticles(
  topics: SelectedTopic[],
  config: DigestConfig,
): Promise<Article[]> {
  const articles: Article[] = [];

  for (const topic of topics) {
    try {
      const article = await writeArticle(topic, config);
      if (article) articles.push(article);
    } catch (err) {
      console.error(`[write] Ошибка при написании "${topic.title}":`, err);
    }
  }

  return articles;
}
