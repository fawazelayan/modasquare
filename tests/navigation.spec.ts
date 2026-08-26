import { expect, test } from "@playwright/test";
import { hasHorizontalOverflow, readInteractionShift, recordLayoutShifts, settle } from "./helpers";

/**
 * Global navigation, search overlay and cross-viewport structure.
 */
test.describe("navigation and search", () => {
  test.beforeEach(async ({ page }) => {
    await recordLayoutShifts(page);
  });

  test("the header reaches all three collections on every viewport", async ({ page }, testInfo) => {
    await page.goto("/");
    await settle(page);

    const isMobile = testInfo.project.name === "mobile-390";
    const prefix = isMobile ? "nav-mobile" : "nav";

    for (const slug of ["women", "men", "teen"] as const) {
      await expect(page.getByTestId(`${prefix}-${slug}`)).toBeVisible();
    }

    await page.getByTestId(`${prefix}-men`).click();
    await page.waitForURL(/\/men\/?$/);
    await expect(page.getByRole("heading", { level: 1, name: "Men" })).toBeVisible();
    await expect(page.getByTestId(`${prefix}-men`)).toHaveAttribute("aria-current", "page");
  });

  test("the desktop navigation stays on one line inside the height cap", async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name === "mobile-390", "The cap is a desktop rule.");

    await page.goto("/");
    await settle(page);

    const height = await page
      .locator("header")
      .evaluate((node) => node.getBoundingClientRect().height);

    // AGENTS.md caps the desktop header at 80px.
    expect(height).toBeLessThanOrEqual(80);

    const navLines = await page.evaluate(() => {
      // Only the rendered rail counts. The mobile collection row is in the DOM
      // at every width and collapses to display:none above md.
      const links = Array.from(document.querySelectorAll('[data-testid^="nav-"]')).filter(
        (link) => link.getClientRects().length > 0,
      );
      return new Set(links.map((link) => Math.round(link.getBoundingClientRect().top))).size;
    });
    expect(navLines).toBe(1);
  });

  test("search opens, matches, and closes on Escape", async ({ page }, testInfo) => {
    await page.goto("/");
    await settle(page);

    const triggerId =
      testInfo.project.name === "mobile-390" ? "search-trigger-mobile" : "search-trigger";
    await page.getByTestId(triggerId).click();

    const modal = page.getByTestId("search-modal");
    await expect(modal).toBeVisible();

    // Focus lands in the field, which is the only thing to do in this dialog.
    const field = page.getByRole("searchbox", { name: /Search products/i });
    await expect(field).toBeFocused();

    await field.fill("merino");
    await expect(page.getByTestId("search-results")).toBeVisible();
    await expect(page.getByTestId("search-results").getByRole("listitem")).toHaveCount(1);
    await expect(page.getByText("Meridian Boxy Knit")).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(modal).toHaveCount(0);
  });

  test("search offers a route out when nothing matches", async ({ page }, testInfo) => {
    await page.goto("/");
    await settle(page);

    const triggerId =
      testInfo.project.name === "mobile-390" ? "search-trigger-mobile" : "search-trigger";
    await page.getByTestId(triggerId).click();

    await page.getByRole("searchbox", { name: /Search products/i }).fill("zzzznothing");

    await expect(page.getByText('No pieces match "zzzznothing".')).toBeVisible();
    // No dead end: collections are still one click away.
    await expect(
      page.getByTestId("search-modal").getByRole("link", { name: "Women" }),
    ).toBeVisible();
  });

  test("a search result navigates to the product", async ({ page }, testInfo) => {
    await page.goto("/");
    await settle(page);

    const triggerId =
      testInfo.project.name === "mobile-390" ? "search-trigger-mobile" : "search-trigger";
    await page.getByTestId(triggerId).click();
    await page.getByRole("searchbox", { name: /Search products/i }).fill("anvers");

    await page.getByTestId("search-results").getByRole("link").first().click();
    await page.waitForURL(/\/product\/anvers-cropped-bomber/);
    await expect(
      page.getByRole("heading", { level: 1, name: "Anvers Cropped Bomber" }),
    ).toBeVisible();
  });

  test("the skip link is the first stop for the keyboard", async ({ page }) => {
    await page.goto("/");
    await settle(page);

    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Skip to content" });
    await expect(skip).toBeFocused();
    await expect(skip).toBeVisible();
  });

  test("the homepage title and the collection title name the current view", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle("Modasquare");

    await page.goto("/teen");
    await expect(page).toHaveTitle("Teen | Modasquare");

    await page.goto("/product/kite-parachute-pant");
    await expect(page).toHaveTitle("Kite Parachute Pant | Modasquare");
  });

  test("an unknown collection renders the recovery page", async ({ page }) => {
    await page.goto("/kidswear");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("taken down");
    await expect(page.getByRole("link", { name: "Back to the homepage" })).toBeVisible();
  });

  test("the homepage loads without cumulative shift or sideways scroll", async ({ page }) => {
    await page.goto("/");
    await settle(page, 1400);

    expect(await hasHorizontalOverflow(page)).toBe(false);
    expect(await readInteractionShift(page)).toBeLessThan(0.1);
  });

  test("the hero call to action is reachable without scrolling on desktop", async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1280", "Hero fit is a desktop rule.");

    await page.goto("/");
    await settle(page);

    await expect(page.getByRole("link", { name: "Shop the collection" }).first()).toBeInViewport();
  });
});
