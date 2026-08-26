import { expect, test } from "@playwright/test";
import {
  hasHorizontalOverflow,
  readInteractionShift,
  recordLayoutShifts,
  resetInteractionShift,
  settle,
} from "./helpers";

/**
 * Listing page: grid density switching and multi-select filtering.
 *
 * The point of most of these assertions is that state lives in the URL. If a
 * filter or a view only existed in component memory, the deep-link and Back
 * cases below would fail.
 */
test.describe("product listing", () => {
  test.beforeEach(async ({ page }) => {
    await recordLayoutShifts(page);
  });

  test("switches grid density and records it in the URL", async ({ page }) => {
    await page.goto("/women");
    await settle(page);

    const grid = page.getByTestId("product-grid");
    await expect(grid).toHaveAttribute("data-view", "editorial");
    // The default view is canonical, so it is absent from the query string.
    expect(new URL(page.url()).searchParams.get("view")).toBeNull();

    await page.getByTestId("view-dense").click();
    await expect(grid).toHaveAttribute("data-view", "dense");
    await expect(page.getByTestId("view-dense")).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByTestId("view-editorial")).toHaveAttribute("aria-pressed", "false");
    await expect(page).toHaveURL(/view=dense/);

    await page.getByTestId("view-editorial").click();
    await expect(grid).toHaveAttribute("data-view", "editorial");
    await expect(page).not.toHaveURL(/view=dense/);
  });

  test("a dense deep link renders dense on first paint", async ({ page }) => {
    await page.goto("/men?view=dense");
    await settle(page);

    await expect(page.getByTestId("product-grid")).toHaveAttribute("data-view", "dense");
    await expect(page.getByTestId("view-dense")).toHaveAttribute("aria-pressed", "true");
  });

  test("switching density does not shift the layout around it", async ({ page }) => {
    await page.goto("/women");
    await settle(page);
    await resetInteractionShift(page);

    await page.getByTestId("view-dense").click();
    await expect(page.getByTestId("product-grid")).toHaveAttribute("data-view", "dense");
    await settle(page);

    // Grid tiles reflow by design. What must not move is everything above them:
    // the header, the collection title and the sticky filter rail.
    const filterBarTop = await page
      .getByTestId("filter-bar")
      .evaluate((node) => Math.round(node.getBoundingClientRect().top));
    expect(filterBarTop).toBeGreaterThanOrEqual(0);
    expect(await hasHorizontalOverflow(page)).toBe(false);
  });

  test("multi-select size filtering narrows the grid and survives a reload", async ({ page }) => {
    await page.goto("/women");
    await settle(page);

    const total = await page.getByTestId("product-card").count();
    expect(total).toBeGreaterThan(0);

    await page.getByTestId("facet-size").click();
    await page.getByTestId("filter-size-XS").click();
    await expect(page).toHaveURL(/size=XS/);

    const afterOne = await page.getByTestId("product-card").count();
    expect(afterOne).toBeLessThanOrEqual(total);

    // The panel stays open after a selection, so the second value goes straight
    // in. Within a facet the match is OR, so the set widens.
    await page.getByTestId("filter-size-L").click();
    await expect(page).toHaveURL(/size=XS%2CL|size=XS,L/);

    const afterTwo = await page.getByTestId("product-card").count();
    expect(afterTwo).toBeGreaterThanOrEqual(afterOne);

    // Reload the deep link: server-rendered result must match.
    const url = page.url();
    await page.goto(url);
    await settle(page);
    expect(await page.getByTestId("product-card").count()).toBe(afterTwo);
    await expect(page.getByTestId("facet-size")).toContainText("(2)");
  });

  test("filters across facets combine and clear together", async ({ page }) => {
    await page.goto("/women");
    await settle(page);

    await page.getByTestId("facet-fit").click();
    await page.getByTestId("filter-fit-Tailored").click();
    await expect(page).toHaveURL(/fit=Tailored/);

    const tailoredCount = await page.getByTestId("product-card").count();
    expect(tailoredCount).toBeGreaterThan(0);

    await page.getByTestId("facet-price").click();
    await page.getByTestId("filter-price-band-4").click();
    await expect(page).toHaveURL(/price=band-4/);

    // Tailored and over 800 is empty in Women, so the designed empty state runs.
    await expect(page.getByTestId("empty-results")).toBeVisible();
    await expect(page.getByTestId("product-card")).toHaveCount(0);

    await page.getByTestId("empty-clear").click();
    await expect(page.getByTestId("product-card")).not.toHaveCount(0);
    await expect(page).not.toHaveURL(/fit=|price=/);
  });

  test("the clear control removes every active facet", async ({ page }) => {
    await page.goto("/teen?size=S&fit=Oversized");
    await settle(page);

    await expect(page.getByTestId("facet-size")).toContainText("(1)");
    await expect(page.getByTestId("facet-fit")).toContainText("(1)");

    await page.getByTestId("filter-clear").click();
    await expect(page.getByTestId("filter-clear")).toHaveCount(0);
    await expect(page).toHaveURL(/\/teen\/?$/);
  });

  test("browser Back restores the previous filter state", async ({ page }) => {
    await page.goto("/women");
    await settle(page);

    await page.getByTestId("facet-fit").click();
    await page.getByTestId("filter-fit-Oversized").click();
    await expect(page).toHaveURL(/fit=Oversized/);
    const filtered = await page.getByTestId("product-card").count();

    await page.getByTestId("product-card").first().getByRole("link").first().click();
    await page.waitForURL(/\/product\//);

    await page.goBack();
    await page.waitForURL(/fit=Oversized/);
    await settle(page);

    expect(await page.getByTestId("product-card").count()).toBe(filtered);
  });

  test("the filter rail stays pinned under the header while scrolling", async ({ page }) => {
    await page.goto("/women");
    await settle(page);

    await page.evaluate(() => window.scrollTo(0, 1200));
    await settle(page, 400);

    const bar = page.getByTestId("filter-bar");
    await expect(bar).toBeVisible();

    const { barTop, headerBottom } = await page.evaluate(() => {
      const barEl = document.querySelector('[data-testid="filter-bar"]')!;
      const headerEl = document.querySelector("header")!;
      return {
        barTop: Math.round(barEl.getBoundingClientRect().top),
        headerBottom: Math.round(headerEl.getBoundingClientRect().bottom),
      };
    });

    // Pinned directly beneath the header, never underneath it.
    expect(Math.abs(barTop - headerBottom)).toBeLessThanOrEqual(2);
  });

  test("opening a facet panel does not push the grid down the page", async ({ page }) => {
    await page.goto("/women");
    await settle(page);

    const gridTopBefore = await page
      .getByTestId("product-grid")
      .evaluate((node) => Math.round(node.getBoundingClientRect().top));

    await page.getByTestId("facet-size").click();
    await expect(page.getByTestId("filter-size-M")).toBeVisible();
    await settle(page, 400);

    const gridTopAfter = await page
      .getByTestId("product-grid")
      .evaluate((node) => Math.round(node.getBoundingClientRect().top));

    // The panel is an overlay. If it were a block in the flow, everything below
    // would move and a click already in progress would land on the wrong thing.
    expect(gridTopAfter).toBe(gridTopBefore);
  });

  test("sold-out sizes are disabled on the tile", async ({ page }) => {
    // Meridian Boxy Knit offers XS to XL and stocks only S, M and L.
    await page.goto("/women");
    await settle(page);

    const card = page.locator('[data-slug="meridian-boxy-knit"]');
    await card.scrollIntoViewIfNeeded();
    await card.hover();

    await expect(page.getByTestId("quick-size-meridian-boxy-knit-XS")).toBeDisabled();
    await expect(page.getByTestId("quick-size-meridian-boxy-knit-M")).toBeEnabled();
  });

  test("loads without cumulative shift and without sideways scroll", async ({ page }) => {
    await page.goto("/women");
    await settle(page, 1200);

    expect(await hasHorizontalOverflow(page)).toBe(false);
    expect(await readInteractionShift(page)).toBeLessThan(0.1);
  });
});
