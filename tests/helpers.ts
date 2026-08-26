import type { Page } from "@playwright/test";

declare global {
  interface Window {
    __clsExcludingInput: number;
    __clsIncludingInput: number;
  }
}

/**
 * Installs a layout-shift recorder before the first script on the page runs.
 *
 * Two accumulators, because the platform draws a line the brief does not:
 * a shift within 500ms of a real interaction is flagged `hadRecentInput` and is
 * excluded from Core Web Vitals. That exclusion is exactly the shift we care
 * about when a drawer opens or a grid switches density, so it is counted
 * separately rather than discarded.
 */
export async function recordLayoutShifts(page: Page): Promise<void> {
  await page.addInitScript(() => {
    window.__clsExcludingInput = 0;
    window.__clsIncludingInput = 0;

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const shift = entry as PerformanceEntry & {
          value: number;
          hadRecentInput: boolean;
        };
        window.__clsIncludingInput += shift.value;
        if (!shift.hadRecentInput) {
          window.__clsExcludingInput += shift.value;
        }
      }
    });

    observer.observe({ type: "layout-shift", buffered: true });
  });
}

/** Cumulative Layout Shift as Core Web Vitals scores it. */
export async function readCls(page: Page): Promise<number> {
  return page.evaluate(() => window.__clsExcludingInput ?? 0);
}

/** Zeroes the interaction counter so the next assertion covers one action. */
export async function resetInteractionShift(page: Page): Promise<void> {
  await page.evaluate(() => {
    window.__clsIncludingInput = 0;
  });
}

/**
 * Every shift since the last reset, input-triggered ones included. The layout
 * shift API batches on a frame, so settle before reading.
 */
export async function readInteractionShift(page: Page): Promise<number> {
  await page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      }),
  );
  return page.evaluate(() => window.__clsIncludingInput ?? 0);
}

/** Waits for entry and exit transitions to finish before measuring anything. */
export async function settle(page: Page, ms = 700): Promise<void> {
  await page.waitForTimeout(ms);
}

/** True when the page body scrolls sideways, which it never should. */
export async function hasHorizontalOverflow(page: Page): Promise<boolean> {
  return page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
  );
}
