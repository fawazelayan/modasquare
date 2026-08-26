/**
 * Locale-aware formatting.
 *
 * The locale is pinned rather than read from the browser. `Intl` resolved on the
 * server against one locale and on the client against another is the classic
 * hydration mismatch, and AGENTS.md asks for date/number rendering to be guarded
 * against exactly that.
 */

const LOCALE = "en-GB";
const CURRENCY = "JOD";

const priceFormatter = new Intl.NumberFormat(LOCALE, {
  style: "currency",
  currency: CURRENCY,
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const countFormatter = new Intl.NumberFormat(LOCALE);

export function formatPrice(amount: number): string {
  return priceFormatter.format(amount);
}

/**
 * Cart counters cap their visible label so a three-digit count cannot blow out
 * the pill geometry in the header. The accessible name keeps the true number.
 */
export function formatBadgeCount(value: number): string {
  return value > 99 ? "99+" : countFormatter.format(value);
}
