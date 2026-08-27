import {
  FIT_OPTIONS,
  PRICE_BANDS,
  SIZE_ORDER,
  type FitLabel,
  type PriceBandId,
  type Product,
  type SizeLabel,
} from "@/lib/catalog";

/**
 * PLP state lives in the URL, not in component state.
 *
 * AGENTS.md requires that filters, tabs and view toggles are deep-linkable and
 * that Back restores what the user was looking at. Parsing and serialising in
 * one module keeps the Server Component (which renders the filtered grid) and
 * the Client Component (which writes the query string) reading the same rules.
 */

export type GridView = "editorial" | "dense";

export const DEFAULT_VIEW: GridView = "editorial";

export interface PlpFilters {
  readonly sizes: ReadonlyArray<SizeLabel>;
  readonly fits: ReadonlyArray<FitLabel>;
  readonly bands: ReadonlyArray<PriceBandId>;
  readonly sub?: string;
  readonly view: GridView;
}

export const PARAM = {
  size: "size",
  fit: "fit",
  price: "price",
  sub: "sub",
  view: "view",
} as const;

type RawParams = Record<string, string | string[] | undefined>;

function readList(params: RawParams, key: string): string[] {
  const raw = params[key];
  if (!raw) return [];
  const joined = Array.isArray(raw) ? raw.join(",") : raw;
  return joined
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

/** Parses a query string bag into validated filter state. Unknown values drop. */
export function parseFilters(params: RawParams): PlpFilters {
  const sizes = readList(params, PARAM.size).filter((value): value is SizeLabel =>
    (SIZE_ORDER as ReadonlyArray<string>).includes(value),
  );

  const fits = readList(params, PARAM.fit).filter((value): value is FitLabel =>
    (FIT_OPTIONS as ReadonlyArray<string>).includes(value),
  );

  const bands = readList(params, PARAM.price).filter((value): value is PriceBandId =>
    PRICE_BANDS.some((band) => band.id === value),
  );

  const rawSub = params[PARAM.sub] || params.type;
  const subValue = Array.isArray(rawSub) ? rawSub[0] : rawSub;
  const sub = typeof subValue === "string" && subValue.trim().length > 0 ? subValue.trim().toLowerCase() : undefined;

  const rawView = params[PARAM.view];
  const viewValue = Array.isArray(rawView) ? rawView[0] : rawView;
  const view: GridView = viewValue === "dense" ? "dense" : DEFAULT_VIEW;

  return { sizes, fits, bands, sub, view };
}

/**
 * Builds the query string for a filter state. Defaults are omitted so the clean
 * URL stays clean, which also means the canonical PLP address has no query at
 * all when nothing is selected.
 */
export function serialiseFilters(filters: PlpFilters): string {
  const params = new URLSearchParams();

  if (filters.sizes.length > 0) params.set(PARAM.size, [...filters.sizes].join(","));
  if (filters.fits.length > 0) params.set(PARAM.fit, [...filters.fits].join(","));
  if (filters.bands.length > 0) params.set(PARAM.price, [...filters.bands].join(","));
  if (filters.sub && filters.sub !== "all") params.set(PARAM.sub, filters.sub);
  if (filters.view !== DEFAULT_VIEW) params.set(PARAM.view, filters.view);

  return params.toString();
}

export function activeFilterCount(filters: PlpFilters): number {
  return (
    filters.sizes.length +
    filters.fits.length +
    filters.bands.length +
    (filters.sub && filters.sub !== "all" ? 1 : 0)
  );
}

function matchesPrice(product: Product, bands: ReadonlyArray<PriceBandId>): boolean {
  if (bands.length === 0) return true;
  return bands.some((id) => {
    const band = PRICE_BANDS.find((candidate) => candidate.id === id);
    if (!band) return false;
    return product.price >= band.min && product.price <= band.max;
  });
}

/**
 * Multi-select within a facet is OR, across facets it is AND. Size matching only
 * counts a size the customer could actually buy, so a sold-out M does not put a
 * product into the "M" results.
 */
export function applyFilters(products: ReadonlyArray<Product>, filters: PlpFilters): Product[] {
  return products.filter((product) => {
    const sizeOk =
      filters.sizes.length === 0 ||
      filters.sizes.some((size) =>
        product.sizes.some((option) => option.label === size && option.inStock),
      );

    const fitOk = filters.fits.length === 0 || filters.fits.includes(product.fit);

    const subOk =
      !filters.sub ||
      filters.sub === "all" ||
      product.subcategory === filters.sub;

    return sizeOk && fitOk && subOk && matchesPrice(product, filters.bands);
  });
}

/** Adds or removes one value from a facet array, preserving canonical order. */
export function toggleValue<T extends string>(
  current: ReadonlyArray<T>,
  value: T,
  order: ReadonlyArray<T>,
): T[] {
  const next = current.includes(value)
    ? current.filter((entry) => entry !== value)
    : [...current, value];

  return order.filter((entry) => next.includes(entry));
}
