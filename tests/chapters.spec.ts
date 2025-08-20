import { test, expect } from "@playwright/test";
import { getLinks } from "../scripts/get-urls-from-content-tree";

const baseUrl = "http://localhost:5173";

const links = getLinks();

test("app renders", async ({ page }) => {
  await page.goto(baseUrl);
  await expect(page).toHaveTitle("LingDocs Pashto Grammar");
});

test.describe("every chapter renders", () => {
  links.forEach((link) => {
    test(link, async ({ page }) => {
      const url = `${baseUrl}${link}`;
      await page.goto(url);
      const chapterTitle = page.getByTestId("chapter-title");
      await expect(chapterTitle).toBeVisible();
    });
  });
});
