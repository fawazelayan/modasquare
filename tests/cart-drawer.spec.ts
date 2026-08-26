import { expect, test } from "@playwright/test";
import {
  hasHorizontalOverflow,
  readInteractionShift,
  recordLayoutShifts,
  resetInteractionShift,
  settle,
} from "./helpers";

/**
 * Cart drawer: the flow the brief calls out first.
 *
 * Covers opening from the header on every viewport, the empty state, adding a
 * line from the listing grid, the free-shipping tracker, the quantity adjusters,
 * removal with undo, and the focus contract on close.
 */
test.describe("cart drawer", () => {
  test.beforeEach(async ({ page }) => {
    await recordLayoutShifts(page);
  });

  test("opens from the header and shows the empty state", async ({ page }) => {
    await page.goto("/");
    await settle(page);

    await page.getByTestId("cart-trigger").click();

    const drawer = page.getByTestId("cart-drawer");
    await expect(drawer).toBeVisible();
    await expect(drawer).toHaveAttribute("aria-modal", "true");
    await expect(page.getByText("Nothing here yet")).toBeVisible();

    // Empty bag means no subtotal and no checkout control to press.
    await expect(page.getByTestId("cart-subtotal")).toHaveCount(0);
    await expect(page.getByTestId("express-checkout")).toHaveCount(0);
  });

  test("opening the drawer shifts nothing on the page behind it", async ({ page }) => {
    await page.goto("/women");
    await settle(page);
    await resetInteractionShift(page);

    await page.getByTestId("cart-trigger").click();
    await expect(page.getByTestId("cart-drawer")).toBeVisible();
    await settle(page);

    // Body scroll locks when the drawer opens. Without scrollbar compensation
    // the whole page would jump sideways, which this catches.
    expect(await readInteractionShift(page)).toBeLessThan(0.01);
    expect(await hasHorizontalOverflow(page)).toBe(false);
  });

  test("adding from the listing grid fills the bag and moves the shipping tracker", async ({
    page,
  }) => {
    await page.goto("/women");
    await settle(page);

    const card = page.getByTestId("product-card").first();
    const slug = await card.getAttribute("data-slug");
    expect(slug).toBeTruthy();

    await card.hover();
    await page.getByTestId(`quick-size-${slug}-S`).click();

    // Quick add opens the drawer as its own confirmation.
    const drawer = page.getByTestId("cart-drawer");
    await expect(drawer).toBeVisible();
    await expect(page.getByTestId("cart-line")).toHaveCount(1);
    await expect(page.getByTestId("cart-count")).toHaveText("1");

    const tracker = page.getByTestId("shipping-tracker");
    await expect(tracker).toBeVisible();

    // The first Women piece is over the 350 threshold, so shipping is unlocked.
    await expect(page.getByText("Complimentary shipping applied.")).toBeVisible();

    const scale = await page
      .getByTestId("shipping-progress-fill")
      .evaluate((node) => getComputedStyle(node).transform);
    expect(scale).not.toBe("none");
  });

  test("shows the remaining amount when the bag is under the threshold", async ({ page }) => {
    // Aster Ribbed Tank is 130, well under the 350 free-shipping threshold.
    await page.goto("/product/aster-ribbed-tank");
    await settle(page);

    await page.getByTestId("size-S").click();
    await page.getByTestId("add-to-bag").click();

    await expect(page.getByTestId("cart-drawer")).toBeVisible();
    await expect(page.getByTestId("shipping-remaining")).toContainText("220");
  });

  test("quantity adjusters and subtotal stay in step", async ({ page }) => {
    await page.goto("/product/aster-ribbed-tank");
    await settle(page);

    await page.getByTestId("size-M").click();
    await page.getByTestId("add-to-bag").click();
    await expect(page.getByTestId("cart-drawer")).toBeVisible();

    await expect(page.getByTestId("cart-subtotal")).toHaveText("€130");

    const stepper = "qty-aster-ribbed-tank--M";
    await page.getByTestId(`${stepper}-increase`).click();
    await expect(page.getByTestId(`${stepper}-value`)).toContainText("2");
    await expect(page.getByTestId("cart-subtotal")).toHaveText("€260");
    await expect(page.getByTestId("cart-count")).toHaveText("2");

    await page.getByTestId(`${stepper}-decrease`).click();
    await expect(page.getByTestId("cart-subtotal")).toHaveText("€130");

    // At one, decreasing further is disabled: removal is its own explicit action.
    await expect(page.getByTestId(`${stepper}-decrease`)).toBeDisabled();
  });

  test("removal offers undo and restores the line", async ({ page }) => {
    await page.goto("/product/aster-ribbed-tank");
    await settle(page);

    await page.getByTestId("size-M").click();
    await page.getByTestId("add-to-bag").click();
    await expect(page.getByTestId("cart-line")).toHaveCount(1);

    await page.getByTestId("remove-aster-ribbed-tank--M").click();
    await expect(page.getByTestId("cart-line")).toHaveCount(0);

    const undo = page.getByTestId("cart-undo");
    await expect(undo).toBeVisible();
    await expect(undo).toContainText("Aster Ribbed Tank");

    await page.getByTestId("cart-undo-action").click();
    await expect(page.getByTestId("cart-line")).toHaveCount(1);
    await expect(page.getByTestId("cart-undo")).toHaveCount(0);
  });

  test("escape closes the drawer and returns focus to the trigger", async ({ page }) => {
    await page.goto("/");
    await settle(page);

    const trigger = page.getByTestId("cart-trigger");
    await trigger.click();
    await expect(page.getByTestId("cart-drawer")).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.getByTestId("cart-drawer")).toHaveCount(0);

    // Focus must land back where it came from, per the APG dialog contract.
    await expect(trigger).toBeFocused();
  });

  test("the scrim closes the drawer", async ({ page }) => {
    await page.goto("/");
    await settle(page);

    await page.getByTestId("cart-trigger").click();
    await expect(page.getByTestId("cart-drawer")).toBeVisible();

    // Aim at the exposed edge of the scrim. Its box spans the viewport, so a
    // default centre-click would land on the panel sitting over it.
    await page
      .getByRole("button", { name: "Close bag" })
      .first()
      .click({ position: { x: 12, y: 200 } });
    await expect(page.getByTestId("cart-drawer")).toHaveCount(0);
  });

  test("the bag survives navigation between routes", async ({ page }) => {
    await page.goto("/product/aster-ribbed-tank");
    await settle(page);

    await page.getByTestId("size-M").click();
    await page.getByTestId("add-to-bag").click();
    await expect(page.getByTestId("cart-drawer")).toBeVisible();
    await page.getByTestId("cart-close").click();

    await page.goto("/men");
    await settle(page);

    await expect(page.getByTestId("cart-count")).toHaveText("1");
  });
});
