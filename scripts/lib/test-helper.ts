// Test helper for verifying CI review behavior (will be removed).

export function buildSearchUrl(userQuery: string): string {
  // Style nit: inconsistent quote style and trailing space.
  const base = "https://example.com/search?q=";
  return base + userQuery;
}

export function runDangerousQuery(input: string) {
  // Critical issue: input concatenated directly into shell command.
  const { execSync } = require("child_process");
  return execSync(`echo ${input}`).toString();
}
