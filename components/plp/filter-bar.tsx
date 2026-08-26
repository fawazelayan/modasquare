"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { CaretDown, Columns, SquaresFour, X } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/cn";
import {
  FIT_OPTIONS,
  PRICE_BANDS,
  SIZE_ORDER,
  type FitLabel,
  type PriceBandId,
  type SizeLabel,
} from "@/lib/catalog";
import {
  activeFilterCount,
  serialiseFilters,
  toggleValue,
  type GridView,
  type PlpFilters,
} from "@/lib/filters";

type FacetId = "size" | "fit" | "price";

/**
 * Sticky filter rail.
 *
 * All state is written to the query string rather than held locally, so a
 * filtered view is a real address: it can be shared, bookmarked, and Back
 * returns to the previous selection with the scroll position intact. The rail
 * renders from the parsed filters it is handed, which means the server-rendered
 * grid and these controls can never drift apart.
 *
 * The open facet hangs off the bottom of the rail as a full-width overlay
 * rather than expanding a row in the flow. Expanding in the flow looked fine
 * until you clicked something else on the page: the panel closed on pointerdown
 * and every element below it jumped up before the click resolved, so the press
 * landed on whatever slid into its place.
 */
export function FilterBar({
  filters,
  resultCount,
  totalCount,
}: {
  readonly filters: PlpFilters;
  readonly resultCount: number;
  readonly totalCount: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [openFacet, setOpenFacet] = useState<FacetId | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const groupId = useId();

  const push = useCallback(
    (next: PlpFilters) => {
      const query = serialiseFilters(next);
      // `replace` rather than `push`: a filter tweak is a refinement of the same
      // view, so it should not bury the previous page under history entries.
      // `scroll: false` keeps the customer where they were in the grid.
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router],
  );

  const toggleSize = (value: SizeLabel) =>
    push({ ...filters, sizes: toggleValue(filters.sizes, value, SIZE_ORDER) });

  const toggleFit = (value: FitLabel) =>
    push({ ...filters, fits: toggleValue(filters.fits, value, FIT_OPTIONS) });

  const toggleBand = (value: PriceBandId) =>
    push({
      ...filters,
      bands: toggleValue(
        filters.bands,
        value,
        PRICE_BANDS.map((band) => band.id),
      ),
    });

  const setView = (view: GridView) => push({ ...filters, view });

  const clearAll = () => push({ ...filters, sizes: [], fits: [], bands: [] });

  const activeCount = activeFilterCount(filters);

  // Escape closes the open facet, and a click outside the rail dismisses it.
  useEffect(() => {
    if (!openFacet) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenFacet(null);
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpenFacet(null);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [openFacet]);

  const facets: ReadonlyArray<{ id: FacetId; label: string; count: number }> = [
    { id: "size", label: "Size", count: filters.sizes.length },
    { id: "fit", label: "Fit", count: filters.fits.length },
    { id: "price", label: "Price", count: filters.bands.length },
  ];

  const facetButtonClass = (isOpen: boolean, count: number) =>
    cn(
      "inline-flex min-h-[44px] items-center gap-2 rounded-[2px] border px-4",
      "text-[12px] font-semibold uppercase tracking-[0.12em]",
      "transition-[background-color,color,border-color] duration-200",
      "[transition-timing-function:var(--ease-quiet)]",
      count > 0 || isOpen
        ? "border-[var(--color-ink)] text-[var(--color-ink)]"
        : "border-[var(--color-hairline-strong)] text-[var(--color-muted)] hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]",
    );

  const optionClass = (selected: boolean) =>
    cn(
      "numeral inline-flex min-h-[44px] items-center justify-center rounded-[2px] border px-4",
      "text-[12px] uppercase tracking-[0.1em]",
      "transition-[background-color,color,border-color] duration-200",
      "[transition-timing-function:var(--ease-quiet)]",
      selected
        ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-canvas)]"
        : "border-[var(--color-hairline-strong)] bg-[var(--color-canvas)] text-[var(--color-ink)] hover:border-[var(--color-ink)]",
    );

  return (
    <div
      ref={containerRef}
      className={
        "relative sticky top-[var(--header-height)] z-[20] border-y border-[var(--color-hairline)] " +
        "bg-[var(--color-frost)] backdrop-blur-[12px] backdrop-saturate-150"
      }
      data-testid="filter-bar"
    >
      <div className="atelier-shell">
        <div className="flex items-center justify-between gap-4 py-3">
          {/* Facets scroll horizontally on narrow screens rather than wrapping
              into a second sticky row that would eat the viewport. */}
          <div className="scroll-contained -mx-1 flex min-w-0 flex-1 items-center gap-2 overflow-x-auto px-1 py-1">
            {facets.map((facet) => {
              const isOpen = openFacet === facet.id;
              return (
                <button
                  key={facet.id}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`${groupId}-${facet.id}`}
                  onClick={() => setOpenFacet(isOpen ? null : facet.id)}
                  data-testid={`facet-${facet.id}`}
                  className={cn(facetButtonClass(isOpen, facet.count), "shrink-0")}
                >
                  {facet.label}
                  {facet.count > 0 ? (
                    <span className="numeral text-[11px]">{`(${facet.count})`}</span>
                  ) : null}
                  <CaretDown
                    aria-hidden="true"
                    weight="light"
                    size={12}
                    className={cn(
                      "transition-transform duration-300 [transition-timing-function:var(--ease-spring)]",
                      isOpen && "rotate-180",
                    )}
                  />
                </button>
              );
            })}

            {activeCount > 0 ? (
              <button
                type="button"
                onClick={clearAll}
                data-testid="filter-clear"
                className="inline-flex min-h-[44px] shrink-0 items-center gap-1.5 px-2 text-[12px] uppercase tracking-[0.12em] text-[var(--color-muted)] transition-colors duration-200 hover:text-[var(--color-ink)]"
              >
                <X aria-hidden="true" weight="light" size={12} />
                Clear
              </button>
            ) : null}
          </div>

          <div className="flex shrink-0 items-center gap-4">
            {/* The count is the feedback loop for every filter change. */}
            <p
              aria-live="polite"
              className="numeral hidden text-[12px] tracking-[0.1em] text-[var(--color-muted)] sm:block"
              data-testid="result-count"
            >
              {resultCount === totalCount
                ? `${totalCount} pieces`
                : `${resultCount} of ${totalCount}`}
            </p>

            <div
              role="group"
              aria-label="Grid density"
              className="flex items-center rounded-[2px] border border-[var(--color-hairline-strong)]"
            >
              <ViewToggle
                isActive={filters.view === "editorial"}
                label="Editorial view, two columns"
                testId="view-editorial"
                onClick={() => setView("editorial")}
              >
                <Columns aria-hidden="true" weight="light" size={16} />
              </ViewToggle>
              <ViewToggle
                isActive={filters.view === "dense"}
                label="Dense view, four columns"
                testId="view-dense"
                onClick={() => setView("dense")}
              >
                <SquaresFour aria-hidden="true" weight="light" size={16} />
              </ViewToggle>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- facet options */}
      {/* The open panel is an overlay hung off the rail, not a block in the
          flow. If it took up space, opening or closing a facet would push the
          whole grid up and down, and anything the customer was about to click
          would move out from under the pointer between press and release. */}
      <div
        className={
          "absolute inset-x-0 top-full border-b border-[var(--color-hairline)] " +
          "bg-[var(--color-canvas)] shadow-[0_1px_0_0_var(--color-hairline)]"
        }
        hidden={openFacet === null}
      >
        <div className="atelier-shell">
          <div id={`${groupId}-size`} hidden={openFacet !== "size"} className="py-4">
            <fieldset className={openFacet === "size" ? "panel-in" : undefined}>
              <legend className="sr-only">Filter by size</legend>
              <div className="flex flex-wrap gap-2">
                {SIZE_ORDER.map((size) => {
                  const selected = filters.sizes.includes(size);
                  return (
                    <button
                      key={size}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => toggleSize(size)}
                      data-testid={`filter-size-${size}`}
                      className={optionClass(selected)}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
              <p className="mt-3 text-[13px] text-[var(--color-muted)]">
                Sizes shown are the ones currently on the shelf.
              </p>
            </fieldset>
          </div>

          <div id={`${groupId}-fit`} hidden={openFacet !== "fit"} className="py-4">
            <fieldset className={openFacet === "fit" ? "panel-in" : undefined}>
              <legend className="sr-only">Filter by fit</legend>
              <div className="flex flex-wrap gap-2">
                {FIT_OPTIONS.map((fit) => {
                  const selected = filters.fits.includes(fit);
                  return (
                    <button
                      key={fit}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => toggleFit(fit)}
                      data-testid={`filter-fit-${fit}`}
                      className={optionClass(selected)}
                    >
                      {fit}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          </div>

          <div id={`${groupId}-price`} hidden={openFacet !== "price"} className="py-4">
            <fieldset className={openFacet === "price" ? "panel-in" : undefined}>
              <legend className="sr-only">Filter by price</legend>
              <div className="flex flex-wrap gap-2">
                {PRICE_BANDS.map((band) => {
                  const selected = filters.bands.includes(band.id);
                  return (
                    <button
                      key={band.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => toggleBand(band.id)}
                      data-testid={`filter-price-${band.id}`}
                      className={optionClass(selected)}
                    >
                      {band.label}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          </div>
        </div>
      </div>
    </div>
  );
}

function ViewToggle({
  isActive,
  label,
  testId,
  onClick,
  children,
}: {
  readonly isActive: boolean;
  readonly label: string;
  readonly testId: string;
  readonly onClick: () => void;
  readonly children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      // A toggle, not a link: `aria-pressed` states which density is live.
      aria-pressed={isActive}
      aria-label={label}
      data-testid={testId}
      className={cn(
        "flex h-11 w-11 items-center justify-center transition-[background-color,color] duration-200",
        "[transition-timing-function:var(--ease-quiet)]",
        isActive
          ? "bg-[var(--color-ink)] text-[var(--color-canvas)]"
          : "text-[var(--color-muted)] hover:text-[var(--color-ink)]",
      )}
    >
      {children}
    </button>
  );
}
