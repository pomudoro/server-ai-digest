export function parseArticle(markdown: string): {
  title: string;
  description: string;
} {
  const [heading, description] = markdown.split("\n\n");
  const title = heading.replace(/^# /, "");
  return { title, description };
}
