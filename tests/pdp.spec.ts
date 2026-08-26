import { expect, test } from "@playwright/test";
import {
  hasHorizontalOverflow,
  readInteractionShift,
  recordLayoutShifts,
  resetInteractionShift,
  settle,
} from "./helpers";

/**
 * Product detail: size selection, stock states, disclosure panels and the
 * cross-sell module.
 */
test.describe("product detail", () => {
  test.beforeEach(async ({ page }) => {
    await recordLayoutShifts(page);
  });

  test("selecting a size marks exactly one option as checked", async ({ page }) => {
    // Anvers offers XS to XL and does not stock L.
    await page.goto("/product/anvers-cropped-bomber");
    await settle(page);

    await expect(page.getByTestId("size-input-S")).not.toBeChecked();

    await page.getByTestId("size-M").click();
    await expect(page.getByTestId("size-input-M")).toBeChecked();
    await expect(page.getByTestId("size-input-S")).not.toBeChecked();

    // Radio semantics: choosing another size releases the first.
    await page.getByTestId("size-S").click();
    await expect(page.getByTestId("size-input-S")).toBeChecked();
    await expect(page.getByTestId("size-input-M")).not.toBeChecked();
  });

  test("a sold-out size cannot be chosen and says so to assistive tech", async ({ page }) => {
    await page.goto("/product/anvers-cropped-bomber");
    await settle(page);

    const soldOut = page.getByTestId("size-input-L");
    await expect(soldOut).toBeDisabled();

    await page.getByTestId("size-L").click({ force: true });
    await expect(soldOut).not.toBeChecked();

    await expect(page.getByTestId("size-L")).toContainText("sold out");
  });

  test("adding without a size surfaces validation instead of a dead button", async ({ page }) => {
    await page.goto("/product/anvers-cropped-bomber");
    await settle(page);

    const addToBag = page.getByTestId("add-to-bag");
    // Stays enabled with nothing chosen, so the press can explain itself.
    await expect(addToBag).toBeEnabled();

    await addToBag.click();
    await expect(page.getByTestId("size-error")).toHaveText("Choose a size to continue.");
    await expect(page.getByTestId("cart-drawer")).toHaveCount(0);

    // Focus moves to the first size so the keyboard can act on the message.
    await expect(page.getByTestId("size-input-XS")).toBeFocused();

    await page.getByTestId("size-M").click();
    await expect(page.getByTestId("size-error")).toHaveCount(0);

    await addToBag.click();
    await expect(page.getByTestId("cart-drawer")).toBeVisible();
    await expect(page.getByTestId("cart-line")).toHaveCount(1);
  });

  test("quantity carries through from the panel into the bag", async ({ page }) => {
    await page.goto("/product/rundle-boxy-tee");
    await settle(page);

    await page.getByTestId("pdp-qty-increase").click();
    await page.getByTestId("pdp-qty-increase").click();
    await expect(page.getByTestId("pdp-qty-value")).toContainText("3");

    await page.getByTestId("size-L").click();
    await page.getByTestId("add-to-bag").click();

    await expect(page.getByTestId("cart-drawer")).toBeVisible();
    await expect(page.getByTestId("cart-count")).toHaveText("3");
    await expect(page.getByTestId("cart-subtotal")).toHaveText("€345");
  });

  test("specification panels open and close without moving the page around them", async ({
    page,
  }) => {
    await page.goto("/product/anvers-cropped-bomber");
    await settle(page);

    const trigger = page.getByTestId("accordion-trigger-fit");
    const panel = page.getByTestId("accordion-panel-fit");

    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(panel).toBeHidden();

    await resetInteractionShift(page);
    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(panel).toBeVisible();
    await expect(panel).toContainText("dropped shoulder");
    await settle(page, 500);

    // The panel is never height-animated, so nothing above it can drift.
    expect(await hasHorizontalOverflow(page)).toBe(false);

    await trigger.click();
    await expect(panel).toBeHidden();
  });

  test("the first specification panel is open on arrival", async ({ page }) => {
    await page.goto("/product/sablon-wool-trouser");
    await settle(page);

    await expect(page.getByTestId("accordion-trigger-materials")).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    await expect(page.getByTestId("accordion-panel-materials")).toContainText("virgin wool");
  });

  test("complete the look cross-sells three pieces and adds one straight to the bag", async ({
    page,
  }) => {
    await page.goto("/product/anvers-cropped-bomber");
    await settle(page);

    const module = page.getByRole("region", { name: "Complete the look" });
    await expect(module).toBeVisible();

    const pairings = module.getByTestId("product-card");
    await expect(pairings).toHaveCount(3);

    // The cross-sell never offers the piece already being viewed.
    await expect(module.locator('[data-slug="anvers-cropped-bomber"]')).toHaveCount(0);

    const pairing = pairings.first();
    const slug = await pairing.getAttribute("data-slug");
    await pairing.scrollIntoViewIfNeeded();
    await pairing.hover();
    await page.getByTestId(`quick-size-${slug}-M`).click();

    await expect(page.getByTestId("cart-drawer")).toBeVisible();
    await expect(page.getByTestId("cart-line")).toHaveCount(1);
  });

  test("the purchase panel pins beside the gallery on desktop", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1280", "Split screen only applies at lg.");

    await page.goto("/product/anvers-cropped-bomber");
    await settle(page);

    const before = await page
      .getByTestId("add-to-bag")
      .evaluate((node) => node.getBoundingClientRect().top);

    await page.evaluate(() => window.scrollTo(0, 900));
    await settle(page, 400);

    const after = await page
      .getByTestId("add-to-bag")
      .evaluate((node) => node.getBoundingClientRect().top);

    // Sticky, so the control barely moves in the viewport while the gallery
    // scrolls a full 900px past it.
    expect(Math.abs(after - before)).toBeLessThan(200);
    await expect(page.getByTestId("add-to-bag")).toBeInViewport();
  });

  test("the gallery shot index jumps to a plate", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1280", "The shot index renders from lg up.");

    await page.goto("/product/anvers-cropped-bomber");
    await settle(page);

    await page.getByTestId("shot-link-2").click();
    await settle(page, 700);

    const plate = page.locator("#shot-2");
    await expect(plate).toBeInViewport();
  });

  test("loads without cumulative shift and without sideways scroll", async ({ page }) => {
    await page.goto("/product/nord-quilted-liner");
    await settle(page, 1200);

    expect(await hasHorizontalOverflow(page)).toBe(false);
    expect(await readInteractionShift(page)).toBeLessThan(0.1);
  });
});
