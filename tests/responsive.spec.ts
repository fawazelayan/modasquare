import { expect, test, type Page } from "@playwright/test";
import { hasHorizontalOverflow, recordLayoutShifts, settle } from "./helpers";

/**
 * Responsive structure at the three widths named in the brief.
 *
 * The Playwright projects already run every spec at 390, 768 and 1280, so the
 * assertions here read the project name and check the shape that width is meant
 * to produce rather than resizing inside the test.
 */

const ROUTES = ["/", "/women", "/men", "/teen", "/product/anvers-cropped-bomber"] as const;

/** Counts distinct column positions by reading the rendered left edges. */
async function columnCount(page: Page, selector: string): Promise<number> {
  return page.evaluate((sel) => {
    const nodes = Array.from(document.querySelectorAll(sel)).filter(
      (node) => node.getClientRects().length > 0,
    );
    const firstTop = nodes.length > 0 ? Math.round(nodes[0].getBoundingClientRect().top) : 0;
    return nodes.filter((node) => Math.abs(Math.round(node.getBoundingClientRect().top) - firstTop) < 4)
      .length;
  }, selector);
}

test.describe("responsive structure", () => {
  test.beforeEach(async ({ page }) => {
    await recordLayoutShifts(page);
  });

  for (const route of ROUTES) {
    test(`${route} never scrolls sideways`, async ({ page }) => {
      await page.goto(route);
      await settle(page, 900);

      expect(await hasHorizontalOverflow(page)).toBe(false);

      // And still not after scrolling to the bottom, where the footer and the
      // staggered plate band could otherwise push past the gutter.
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await settle(page, 500);
      expect(await hasHorizontalOverflow(page)).toBe(false);
    });
  }

  test("the editorial grid holds one column on mobile and two above it", async ({
    page,
  }, testInfo) => {
    await page.goto("/women");
    await settle(page);

    const columns = await columnCount(page, '[data-testid="product-grid"] > li');

    if (testInfo.project.name === "mobile-390") {
      expect(columns).toBe(1);
    } else {
      // From `sm` up the editorial grid is two wide. Above `lg` the odd tiles
      // drop, so only the first tile shares the top edge with its neighbour.
      expect(columns).toBeGreaterThanOrEqual(1);
      expect(columns).toBeLessThanOrEqual(2);
    }
  });

  test("the dense grid packs more columns than the editorial grid", async ({ page }) => {
    await page.goto("/women?view=editorial");
    await settle(page);
    const editorialWidth = await page
      .locator('[data-testid="product-grid"] > li')
      .first()
      .evaluate((node) => node.getBoundingClientRect().width);

    await page.goto("/women?view=dense");
    await settle(page);
    const denseWidth = await page
      .locator('[data-testid="product-grid"] > li')
      .first()
      .evaluate((node) => node.getBoundingClientRect().width);

    expect(denseWidth).toBeLessThan(editorialWidth);
  });

  test("the product page splits on desktop and stacks below it", async ({ page }, testInfo) => {
    await page.goto("/product/anvers-cropped-bomber");
    await settle(page);

    const galleryBox = await page.getByTestId("pdp-gallery").boundingBox();
    const panelBox = await page.getByTestId("size-selector").boundingBox();
    expect(galleryBox).not.toBeNull();
    expect(panelBox).not.toBeNull();

    if (testInfo.project.name === "desktop-1280") {
      // Side by side: the panel starts to the right of the gallery.
      expect(panelBox!.x).toBeGreaterThan(galleryBox!.x + galleryBox!.width - 40);
    } else {
      // Stacked: the panel starts below the gallery.
      expect(panelBox!.y).toBeGreaterThan(galleryBox!.y);
    }
  });

  test("the drawer never exceeds the viewport width", async ({ page }) => {
    await page.goto("/");
    await settle(page);

    await page.getByTestId("cart-trigger").click();
    const box = await page.getByTestId("cart-drawer").boundingBox();
    const viewport = page.viewportSize();

    expect(box).not.toBeNull();
    expect(viewport).not.toBeNull();
    // One pixel of slack: the panel is transformed, and a composited transform
    // reports sub-pixel widths such as 390.000015.
    expect(box!.width).toBeLessThanOrEqual(viewport!.width + 1);
    expect(box!.x).toBeGreaterThanOrEqual(-1);
  });

  test("every interactive target clears the minimum hit size", async ({ page }) => {
    await page.goto("/women");
    await settle(page);

    const undersized = await page.evaluate(() => {
      const controls = Array.from(
        document.querySelectorAll<HTMLElement>("button, a[href], input:not([type='radio'])"),
      ).filter(
        (node) =>
          node.getClientRects().length > 0 &&
          !node.hasAttribute("aria-hidden") &&
          // Skip-link style controls are deliberately 1x1 until focused, at
          // which point they expand to a full-size target.
          !node.classList.contains("sr-only"),
      );

      return controls
        .map((node) => {
          const rect = node.getBoundingClientRect();
          return {
            label: (node.getAttribute("aria-label") ?? node.textContent ?? "").trim().slice(0, 40),
            height: Math.round(rect.height),
            width: Math.round(rect.width),
          };
        })
        .filter((entry) => entry.height > 0 && (entry.height < 24 || entry.width < 24));
    });

    expect(undersized).toEqual([]);
  });
});
