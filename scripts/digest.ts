import { writeFile, mkdir } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { loadConfig } from './lib/config.ts';
import { generateCovers } from './lib/cover.ts';
import { getExistingSources } from './lib/dedup.ts';
import { publish } from './lib/publish.ts';
import { deduplicateResults, searchNews } from './lib/search.ts';
import { selectTopics } from './lib/select.ts';
import { writeArticles } from './lib/write.ts';
import type { Article } from './lib/write.ts';
import type { CoverResult } from './lib/cover.ts';

/**
 * Собирает frontmatter + body в готовый .md файл.
 */
function buildMarkdown(
  article: Article,
  cover: CoverResult | undefined,
  today: string,
): string {
  const heroLine = cover
    ? `heroImage: '../../assets/digest/${today}/${article.slug}.webp'`
    : '';

  const tags = article.tags.map((t) => `'${t}'`).join(', ');

  const lines = [
    '---',
    `title: '${article.title.replace(/'/g, "''")}'`,
    `description: '${article.description.replace(/'/g, "''")}'`,
    `pubDate: '${today}'`,
    `tags: [${tags}]`,
    `source: '${article.sourceUrl}'`,
  ];

  if (heroLine) lines.push(heroLine);
  lines.push('---', '', article.body, '');

  return lines.join('\n');
}

/**
 * Записывает статьи и обложки на диск.
 */
async function writeFiles(
  articles: Article[],
  covers: Map<string, CoverResult>,
  today: string,
  blogDir: string,
): Promise<void> {
  console.log(`\n[files] Записываю ${articles.length} статей...`);

  for (const article of articles) {
    const cover = covers.get(article.slug);
    const markdown = buildMarkdown(article, cover, today);
    const filePath = join(blogDir, `${article.slug}.md`);
    await writeFile(filePath, markdown, 'utf-8');
    console.log(`[files] ${filePath}`);
  }
}

async function main() {
  console.log('=== AI Digest Pipeline ===\n');

  // Stage 0: Config
  console.log('[0/6] Загрузка конфигурации...');
  const config = loadConfig();
  console.log(`[0/6] Дата: ${config.today}\n`);

  // Stage 1: Dedup
  console.log('[1/6] Чтение существующих постов...');
  const existingSources = await getExistingSources(config.blogDir);
  console.log(`[1/6] Найдено ${existingSources.size} существующих источников.\n`);

  // Stage 2: Search + Select
  console.log('[2/6] Поиск новостей...');
  const rawResults = await searchNews(config);
  const results = deduplicateResults(rawResults, existingSources);
  console.log(`[2/6] Найдено ${results.length} уникальных результатов.\n`);

  if (results.length === 0) {
    console.log('Нет новых результатов. Завершаю.');
    process.exit(0);
  }

  console.log('[2/6] Отбор тем...');
  const topics = await selectTopics(results, config);
  console.log(`[2/6] Выбрано ${topics.length} тем.\n`);

  if (topics.length === 0) {
    console.log('Нет подходящих тем. Завершаю.');
    process.exit(0);
  }

  // Stage 3: Write articles
  console.log('[3/6] Написание статей...');
  const articles = await writeArticles(topics, config);
  console.log(`[3/6] Написано ${articles.length} статей.\n`);

  if (articles.length === 0) {
    console.log('Не удалось написать ни одной статьи. Завершаю.');
    process.exit(1);
  }

  // Stage 4: Generate covers
  console.log('[4/6] Генерация обложек...');
  const covers = await generateCovers(articles, config);
  console.log(`[4/6] Сгенерировано ${covers.size} обложек.\n`);

  // Stage 5: Write files
  console.log('[5/6] Запись файлов...');
  await writeFiles(articles, covers, config.today, config.blogDir);
  console.log('[5/6] Файлы записаны.\n');

  // Stage 6: Publish
  console.log('[6/6] Публикация...');
  const prUrl = await publish(articles, config);

  // Summary
  console.log('\n=== Готово ===');
  console.log(`Статей: ${articles.length}`);
  console.log(`Обложек: ${covers.size}`);
  if (prUrl) console.log(`PR: ${prUrl}`);
}

main().catch((err) => {
  console.error('\n[FATAL]', err);
  process.exit(1);
});
