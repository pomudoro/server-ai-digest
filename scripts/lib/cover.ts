import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import type { DigestConfig } from './config.ts';
import type { Article } from './write.ts';

export interface CoverResult {
  slug: string;
  path: string; // относительный путь от корня проекта
}

/**
 * Генерирует обложку для статьи:
 * 1. Claude создаёт промпт для FLUX по заголовку и description
 * 2. Replicate FLUX-schnell генерирует изображение (16:9)
 * 3. sharp конвертирует в WebP
 * 4. Сохраняет в src/assets/digest/{date}/{slug}.webp
 *
 * TODO (Ступень 5): подключить Replicate и Claude для генерации промптов
 */
export async function generateCover(
  article: Article,
  config: DigestConfig,
): Promise<CoverResult | null> {
  console.log(`[cover] Генерирую обложку: ${article.slug}`);

  const dir = join(config.assetsDir, config.today);
  await mkdir(dir, { recursive: true });

  // TODO: заменить на реальный вызов
  // 1. Claude генерирует промпт для FLUX
  // const Anthropic = (await import('@anthropic-ai/sdk')).default;
  // const client = new Anthropic();
  // const promptMsg = await client.messages.create({
  //   model: 'claude-sonnet-4-5',
  //   max_tokens: 256,
  //   messages: [{
  //     role: 'user',
  //     content: `Generate a concise image prompt for a tech blog cover about: ${article.title}. ${article.description}. Style: minimalist, technical, no text.`,
  //   }],
  // });
  //
  // 2. Replicate FLUX генерирует изображение
  // const Replicate = (await import('replicate')).default;
  // const replicate = new Replicate({ auth: config.replicateApiToken });
  // const [output] = await replicate.run('black-forest-labs/flux-schnell', {
  //   input: { prompt: imagePrompt, aspect_ratio: '16:9', num_outputs: 1 },
  // });
  //
  // 3. sharp конвертирует в WebP
  // const sharp = (await import('sharp')).default;
  // const buffer = Buffer.from(await output.arrayBuffer());
  // const outPath = join(dir, `${article.slug}.webp`);
  // await sharp(buffer).webp({ quality: 85 }).toFile(outPath);
  //
  // return { slug: article.slug, path: outPath };

  console.log('[cover] STUB: пропускаю. Подключи Replicate на Ступени 5.');
  return null;
}

/**
 * Генерирует обложки для всех статей.
 * Если одна упала — пост будет без обложки.
 */
export async function generateCovers(
  articles: Article[],
  config: DigestConfig,
): Promise<Map<string, CoverResult>> {
  const covers = new Map<string, CoverResult>();

  for (const article of articles) {
    try {
      const cover = await generateCover(article, config);
      if (cover) covers.set(cover.slug, cover);
    } catch (err) {
      console.warn(`[cover] Не удалось сгенерировать обложку для "${article.slug}":`, err);
    }
  }

  return covers;
}
