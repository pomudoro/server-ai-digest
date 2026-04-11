import { execSync } from 'node:child_process';
import type { Article } from './write.ts';
import type { DigestConfig } from './config.ts';

/**
 * Создаёт ветку, коммитит новые файлы и открывает PR через gh CLI.
 *
 * Поток:
 * 1. git checkout -b digest/{YYYY-MM-DD}
 * 2. git add src/content/blog/ src/assets/digest/
 * 3. git commit
 * 4. git push -u origin
 * 5. gh pr create
 * 6. finally: git checkout {original branch}
 */
export async function publish(
  articles: Article[],
  config: DigestConfig,
): Promise<string | null> {
  if (articles.length === 0) {
    console.log('[publish] Нет статей для публикации.');
    return null;
  }

  const branch = `digest/${config.today}`;
  const originalBranch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf-8' }).trim();

  console.log(`[publish] Создаю ветку ${branch}...`);

  try {
    execSync(`git checkout -b ${branch}`, { stdio: 'pipe' });

    execSync(`git add ${config.blogDir} ${config.assetsDir}`, { stdio: 'pipe' });

    const commitMsg = `feat(digest): AI digest for ${config.today}`;
    execSync(`git commit -m "${commitMsg}"`, { stdio: 'pipe' });

    execSync(`git push -u origin ${branch}`, { stdio: 'pipe' });

    const prTitle = `feat(digest): дайджест ${config.today}`;
    const articlesList = articles
      .map((a) => `- **${a.title}** ([источник](${a.sourceUrl}))`)
      .join('\n');
    const prBody = `## AI Digest — ${config.today}\n\n${articlesList}`;

    const prUrl = execSync(
      `gh pr create --title "${prTitle}" --body "${prBody}" --base main`,
      { encoding: 'utf-8' },
    ).trim();

    console.log(`[publish] PR создан: ${prUrl}`);
    return prUrl;
  } finally {
    execSync(`git checkout ${originalBranch}`, { stdio: 'pipe' });
  }
}
