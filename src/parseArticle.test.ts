import { describe, expect, test } from "vitest";
import { parseArticle } from "./parseArticle";

describe("parseArticle", () => {
  test("извлекает title из первого h1", () => {
    const markdown = "# Заголовок статьи\n\nНекоторый текст.";

    const result = parseArticle(markdown);

    expect(result.title).toBe("Заголовок статьи");
  });

  test("извлекает description из первого параграфа после h1", () => {
    const markdown =
      "# Заголовок\n\nПервый параграф с описанием.\n\nВторой параграф.";

    const result = parseArticle(markdown);

    expect(result.description).toBe("Первый параграф с описанием.");
  });
});
