import { expect, test } from "@playwright/test";

test("loads playground and shows title", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  await expect(page).toHaveTitle(/AestheticOS/i);
});
