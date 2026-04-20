---
name: digest
description: Full digest article publishing cycle - search, write, cover, commit, deploy
disable-model-invocation: true
---

Execute a full digest publishing cycle. Follow each step in order.

## Step 1. Search for news

Use the Tavily MCP server to search for the most interesting bare metal AI news from the past week. Search query: "AI infrastructure hardware news: GPU servers, accelerators, HPC, datacenter cooling".
Pick the single most newsworthy item.

## Step 2. Write the article

Write an article about the selected news item.
Follow the editorial policy from CLAUDE.md strictly:

- Title, description, publication date, source link.
- The article should be informative and concise.
- Save the article as a markdown file in the content directory following the existing naming convention.

## Step 3. Generate cover image

Invoke the /cover skill with a one-sentence description of the article:
/cover \<one-sentence description of the article\>

## Step 4. Add cover to article

Add the cover image path to the article's frontmatter as `heroImage:` (field name defined in `src/content.config.ts`). Do NOT use `cover:` — it is not in the schema and will not render.

## Step 5. Commit and push

- Stage all new/changed files for the article.
- Commit with message: "feat: add digest - \<article title\>".
- Push to the remote repository.

## Step 6. Report

Print a summary:

- Article title and file path.
- Cover image path.
- Git commit hash.
- Deployed URL (if known from Vercel).
