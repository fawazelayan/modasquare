"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  CaretDown,
  CaretRight,
  SlidersHorizontal,
  X,
} from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/cn";
import {
  DEPARTMENTS,
  FIT_OPTIONS,
  PRICE_BANDS,
  SIZE_ORDER,
  type FitLabel,
  type PriceBandId,
  type SizeLabel,
  type SubcategorySlug,
} from "@/lib/catalog";
import {
  activeFilterCount,
  serialiseFilters,
  toggleValue,
  type GridView,
  type PlpFilters,
} from "@/lib/filters";

type FilterSection = "sub" | "size" | "fit" | "price";

/**
 * FilterBar with single Filter popup modal and intuitive grid switchers.
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
  const [isModalOpen, setModalOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const modalId = useId();

  // Track expanded filter tree sections inside the modal (all open by default for effortless browsing)
  const [expandedSections, setExpandedSections] = useState<Record<FilterSection, boolean>>({
    sub: true,
    size: true,
    fit: true,
    price: true,
  });

  const toggleSection = (section: FilterSection) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Derive relevant department subcategories based on current route
  const currentDept = DEPARTMENTS.find((d) => pathname.includes(`/${d.slug}`)) || DEPARTMENTS[0];

  const push = useCallback(
    (next: PlpFilters) => {
      const query = serialiseFilters(next);
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router],
  );

  const toggleSub = (value: SubcategorySlug) => {
    const nextSub = filters.sub === value ? undefined : value;
    push({ ...filters, sub: nextSub });
  };

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

  const clearAll = () => push({ ...filters, sizes: [], fits: [], bands: [], sub: undefined });

  const activeCount = activeFilterCount(filters);

  // Close modal on Escape key
  useEffect(() => {
    if (!isModalOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setModalOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isModalOpen]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  return (
    <>
      <div
        className="relative z-[20] border-y border-[var(--color-hairline)] bg-[var(--color-canvas)]"
        data-testid="filter-bar"
      >
        <div className="atelier-shell">
          <div className="flex items-center justify-between gap-4 py-3">
            {/* ------------------------------------------------ Left: Filter Button + Active Pills */}
            <div className="scroll-contained -mx-1 flex min-w-0 flex-1 items-center gap-2 overflow-x-auto px-1 py-0.5">
              {/* Single Filter Button */}
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                aria-haspopup="dialog"
                aria-expanded={isModalOpen}
                data-testid="filter-modal-trigger"
                className={cn(
                  "inline-flex min-h-[38px] shrink-0 items-center gap-2 rounded-[2px] border px-3.5",
                  "text-[11px] font-medium uppercase tracking-[0.14em]",
                  "transition-colors duration-150 active:scale-95",
                  activeCount > 0
                    ? "border-[var(--color-ink)] bg-[var(--color-surface)] text-[var(--color-ink)]"
                    : "border-[var(--color-hairline-strong)] bg-[var(--color-canvas)] text-[var(--color-ink)] hover:border-[var(--color-ink)]",
                )}
              >
                <SlidersHorizontal aria-hidden="true" weight="regular" size={15} />
                <span>Filters</span>
                {activeCount > 0 ? (
                  <span
                    aria-hidden="true"
                    className="numeral ml-0.5 min-w-[17px] rounded-full bg-[var(--color-ink)] px-1 text-center text-[9px] font-semibold text-[var(--color-canvas)]"
                  >
                    {activeCount}
                  </span>
                ) : null}
              </button>

              {/* Active Subcategory Pill */}
              {filters.sub && filters.sub !== "all" ? (
                <button
                  type="button"
                  onClick={() => push({ ...filters, sub: undefined })}
                  className="inline-flex min-h-[38px] shrink-0 items-center gap-1.5 rounded-[2px] border border-[var(--color-hairline-strong)] bg-[var(--color-surface)] px-3 text-[11px] font-medium uppercase tracking-[0.1em] text-[var(--color-ink)] hover:border-[var(--color-ink)]"
                  title="Remove subcategory"
                >
                  <span className="capitalize">{filters.sub}</span>
                  <X aria-hidden="true" weight="bold" size={10} className="text-[var(--color-muted)]" />
                </button>
              ) : null}

              {/* Active Size Pills */}
              {filters.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleSize(size)}
                  className="numeral inline-flex min-h-[38px] shrink-0 items-center gap-1.5 rounded-[2px] border border-[var(--color-hairline-strong)] bg-[var(--color-surface)] px-3 text-[11px] font-medium text-[var(--color-ink)] hover:border-[var(--color-ink)]"
                  title={`Remove size ${size}`}
                >
                  <span>{size}</span>
                  <X aria-hidden="true" weight="bold" size={10} className="text-[var(--color-muted)]" />
                </button>
              ))}

              {/* Active Fit Pills */}
              {filters.fits.map((fit) => (
                <button
                  key={fit}
                  type="button"
                  onClick={() => toggleFit(fit)}
                  className="inline-flex min-h-[38px] shrink-0 items-center gap-1.5 rounded-[2px] border border-[var(--color-hairline-strong)] bg-[var(--color-surface)] px-3 text-[11px] font-medium uppercase tracking-[0.1em] text-[var(--color-ink)] hover:border-[var(--color-ink)]"
                  title={`Remove fit ${fit}`}
                >
                  <span>{fit}</span>
                  <X aria-hidden="true" weight="bold" size={10} className="text-[var(--color-muted)]" />
                </button>
              ))}

              {/* Active Price Band Pills */}
              {filters.bands.map((bandId) => {
                const band = PRICE_BANDS.find((b) => b.id === bandId);
                if (!band) return null;
                return (
                  <button
                    key={bandId}
                    type="button"
                    onClick={() => toggleBand(bandId)}
                    className="inline-flex min-h-[38px] shrink-0 items-center gap-1.5 rounded-[2px] border border-[var(--color-hairline-strong)] bg-[var(--color-surface)] px-3 text-[11px] font-medium text-[var(--color-ink)] hover:border-[var(--color-ink)]"
                    title="Remove price band"
                  >
                    <span>{band.label}</span>
                    <X aria-hidden="true" weight="bold" size={10} className="text-[var(--color-muted)]" />
                  </button>
                );
              })}

              {/* Clear All */}
              {activeCount > 0 ? (
                <button
                  type="button"
                  onClick={clearAll}
                  data-testid="filter-clear"
                  className="inline-flex min-h-[38px] shrink-0 items-center gap-1 px-2 text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--color-muted)] transition-colors hover:text-[var(--color-ink)] underline underline-offset-4 decoration-[var(--color-hairline-strong)]"
                >
                  Reset all
                </button>
              ) : null}
            </div>

            {/* ------------------------------------------------ Right: Piece Count & Refined Grid Switches */}
            <div className="flex shrink-0 items-center gap-3 sm:gap-4">
              <p
                aria-live="polite"
                className="numeral hidden text-[11px] tracking-[0.1em] text-[var(--color-muted)] sm:block"
                data-testid="result-count"
              >
                {resultCount === totalCount
                  ? `${totalCount} pieces`
                  : `${resultCount} of ${totalCount}`}
              </p>

              {/* Borderless Grid Switcher Controls */}
              <div
                role="group"
                aria-label="Grid density layout"
                className="flex items-center gap-1 bg-transparent p-0"
              >
                {/* 1-Column / Stacked Feed View (Images under each other) */}
                <button
                  type="button"
                  aria-pressed={filters.view === "editorial"}
                  aria-label="Stacked view (images under each other)"
                  title="Stacked view"
                  data-testid="view-editorial"
                  onClick={() => setView("editorial")}
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-[2px] transition-colors duration-150",
                    filters.view === "editorial"
                      ? "bg-black text-white"
                      : "bg-white text-[#666666] hover:text-black hover:bg-neutral-100",
                  )}
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <rect
                      x="2"
                      y="2"
                      width="12"
                      height="5.2"
                      rx="0.5"
                      stroke="currentColor"
                      strokeWidth="1.1"
                      fill="none"
                    />
                    <rect
                      x="2"
                      y="8.8"
                      width="12"
                      height="5.2"
                      rx="0.5"
                      stroke="currentColor"
                      strokeWidth="1.1"
                      fill="none"
                    />
                  </svg>
                </button>

                {/* 4-Column Dense Grid View */}
                <button
                  type="button"
                  aria-pressed={filters.view === "dense"}
                  aria-label="Grid view"
                  title="Grid view"
                  data-testid="view-dense"
                  onClick={() => setView("dense")}
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-[2px] transition-colors duration-150",
                    filters.view === "dense"
                      ? "bg-black text-white"
                      : "bg-white text-[#666666] hover:text-black hover:bg-neutral-100",
                  )}
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <rect
                      x="2"
                      y="2"
                      width="5"
                      height="5"
                      rx="0.5"
                      stroke="currentColor"
                      strokeWidth="1.1"
                      fill="none"
                    />
                    <rect
                      x="9"
                      y="2"
                      width="5"
                      height="5"
                      rx="0.5"
                      stroke="currentColor"
                      strokeWidth="1.1"
                      fill="none"
                    />
                    <rect
                      x="2"
                      y="9"
                      width="5"
                      height="5"
                      rx="0.5"
                      stroke="currentColor"
                      strokeWidth="1.1"
                      fill="none"
                    />
                    <rect
                      x="9"
                      y="9"
                      width="5"
                      height="5"
                      rx="0.5"
                      stroke="currentColor"
                      strokeWidth="1.1"
                      fill="none"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- Pop-up Filter Tree Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${modalId}-title`}
            className="fixed inset-0 z-[80] flex items-center justify-center p-4"
          >
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={() => setModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              aria-hidden="true"
            />

            {/* Modal Dialog (wont fill the whole screen) */}
            <motion.div
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 8 }}
              animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "relative z-10 flex max-h-[85vh] w-full max-w-[28rem] flex-col rounded-[2px]",
                "border border-[var(--color-hairline-strong)] bg-[var(--color-canvas)] shadow-2xl",
              )}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[var(--color-hairline)] px-6 py-4">
                <div className="flex items-center gap-2">
                  <h2
                    id={`${modalId}-title`}
                    className="font-sans text-[14px] font-semibold uppercase tracking-[0.16em] text-[var(--color-ink)]"
                  >
                    Filters
                  </h2>
                  {activeCount > 0 ? (
                    <span className="numeral rounded-full bg-[var(--color-ink)] px-2 py-0.5 text-[10px] font-bold text-[var(--color-canvas)]">
                      {activeCount}
                    </span>
                  ) : null}
                </div>

                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  aria-label="Close filters"
                  className="-mr-1 flex h-8 w-8 items-center justify-center rounded-[2px] text-[var(--color-muted)] transition-colors hover:text-[var(--color-ink)]"
                >
                  <X aria-hidden="true" weight="bold" size={18} />
                </button>
              </div>

              {/* Scrollable Tree Content */}
              <div className="scroll-contained flex-1 overflow-y-auto px-6 py-5">
                <div className="relative pl-2">
                  {/* Vertical Tree Line */}
                  <div
                    aria-hidden="true"
                    className="absolute bottom-4 left-2 top-2 w-px bg-[var(--color-hairline-strong)]"
                  />

                  <div className="space-y-5">
                    {/* ----------------------------- 1. Subcategories Tree Node */}
                    <div className="relative pl-4">
                      <div
                        aria-hidden="true"
                        className="absolute -left-[1px] top-3 h-px w-3 bg-[var(--color-hairline-strong)]"
                      />

                      <button
                        type="button"
                        onClick={() => toggleSection("sub")}
                        className="group flex w-full items-center justify-between py-1 text-left"
                      >
                        <span className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink)]">
                          Category
                        </span>
                        <span className="text-[var(--color-muted)] transition-transform duration-150 group-hover:text-[var(--color-ink)]">
                          {expandedSections.sub ? (
                            <CaretDown size={12} weight="regular" />
                          ) : (
                            <CaretRight size={12} weight="regular" />
                          )}
                        </span>
                      </button>

                      {expandedSections.sub && (
                        <div className="relative mb-2 ml-1 mt-2 pl-3">
                          <div
                            aria-hidden="true"
                            className="absolute bottom-2 left-0 top-1 w-px bg-[var(--color-hairline)]"
                          />
                          <div className="flex flex-wrap gap-1.5 py-1">
                            {currentDept.subcategories
                              .filter((sub) => sub.slug !== "all")
                              .map((sub) => {
                                const isSelected = filters.sub === sub.slug;
                                return (
                                  <button
                                    key={sub.slug}
                                    type="button"
                                    onClick={() => toggleSub(sub.slug as SubcategorySlug)}
                                    className={cn(
                                      "inline-flex min-h-[34px] items-center rounded-[2px] border px-3 text-[12px] font-medium transition-colors",
                                      isSelected
                                        ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-canvas)]"
                                        : "border-[var(--color-hairline-strong)] bg-[var(--color-surface)] text-[var(--color-ink)] hover:border-[var(--color-ink)]",
                                    )}
                                  >
                                    {sub.label}
                                  </button>
                                );
                              })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* ----------------------------- 2. Sizes Tree Node */}
                    <div className="relative pl-4">
                      <div
                        aria-hidden="true"
                        className="absolute -left-[1px] top-3 h-px w-3 bg-[var(--color-hairline-strong)]"
                      />

                      <button
                        type="button"
                        onClick={() => toggleSection("size")}
                        className="group flex w-full items-center justify-between py-1 text-left"
                      >
                        <span className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink)]">
                          Size
                        </span>
                        <span className="text-[var(--color-muted)] transition-transform duration-150 group-hover:text-[var(--color-ink)]">
                          {expandedSections.size ? (
                            <CaretDown size={12} weight="regular" />
                          ) : (
                            <CaretRight size={12} weight="regular" />
                          )}
                        </span>
                      </button>

                      {expandedSections.size && (
                        <div className="relative mb-2 ml-1 mt-2 pl-3">
                          <div
                            aria-hidden="true"
                            className="absolute bottom-2 left-0 top-1 w-px bg-[var(--color-hairline)]"
                          />
                          <div className="flex flex-wrap gap-1.5 py-1">
                            {SIZE_ORDER.map((size) => {
                              const isSelected = filters.sizes.includes(size);
                              return (
                                <button
                                  key={size}
                                  type="button"
                                  onClick={() => toggleSize(size)}
                                  className={cn(
                                    "numeral inline-flex h-9 min-w-[40px] items-center justify-center rounded-[2px] border px-2.5 text-[12px] font-medium transition-colors",
                                    isSelected
                                      ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-canvas)]"
                                      : "border-[var(--color-hairline-strong)] bg-[var(--color-surface)] text-[var(--color-ink)] hover:border-[var(--color-ink)]",
                                  )}
                                >
                                  {size}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* ----------------------------- 3. Fit Tree Node */}
                    <div className="relative pl-4">
                      <div
                        aria-hidden="true"
                        className="absolute -left-[1px] top-3 h-px w-3 bg-[var(--color-hairline-strong)]"
                      />

                      <button
                        type="button"
                        onClick={() => toggleSection("fit")}
                        className="group flex w-full items-center justify-between py-1 text-left"
                      >
                        <span className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink)]">
                          Fit & Silhouette
                        </span>
                        <span className="text-[var(--color-muted)] transition-transform duration-150 group-hover:text-[var(--color-ink)]">
                          {expandedSections.fit ? (
                            <CaretDown size={12} weight="regular" />
                          ) : (
                            <CaretRight size={12} weight="regular" />
                          )}
                        </span>
                      </button>

                      {expandedSections.fit && (
                        <div className="relative mb-2 ml-1 mt-2 pl-3">
                          <div
                            aria-hidden="true"
                            className="absolute bottom-2 left-0 top-1 w-px bg-[var(--color-hairline)]"
                          />
                          <div className="flex flex-wrap gap-1.5 py-1">
                            {FIT_OPTIONS.map((fit) => {
                              const isSelected = filters.fits.includes(fit);
                              return (
                                <button
                                  key={fit}
                                  type="button"
                                  onClick={() => toggleFit(fit)}
                                  className={cn(
                                    "inline-flex min-h-[34px] items-center rounded-[2px] border px-3 text-[12px] font-medium transition-colors",
                                    isSelected
                                      ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-canvas)]"
                                      : "border-[var(--color-hairline-strong)] bg-[var(--color-surface)] text-[var(--color-ink)] hover:border-[var(--color-ink)]",
                                  )}
                                >
                                  {fit}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* ----------------------------- 4. Price Band Tree Node */}
                    <div className="relative pl-4">
                      <div
                        aria-hidden="true"
                        className="absolute -left-[1px] top-3 h-px w-3 bg-[var(--color-hairline-strong)]"
                      />

                      <button
                        type="button"
                        onClick={() => toggleSection("price")}
                        className="group flex w-full items-center justify-between py-1 text-left"
                      >
                        <span className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink)]">
                          Price
                        </span>
                        <span className="text-[var(--color-muted)] transition-transform duration-150 group-hover:text-[var(--color-ink)]">
                          {expandedSections.price ? (
                            <CaretDown size={12} weight="regular" />
                          ) : (
                            <CaretRight size={12} weight="regular" />
                          )}
                        </span>
                      </button>

                      {expandedSections.price && (
                        <div className="relative mb-2 ml-1 mt-2 pl-3">
                          <div
                            aria-hidden="true"
                            className="absolute bottom-2 left-0 top-1 w-px bg-[var(--color-hairline)]"
                          />
                          <div className="flex flex-wrap gap-1.5 py-1">
                            {PRICE_BANDS.map((band) => {
                              const isSelected = filters.bands.includes(band.id);
                              return (
                                <button
                                  key={band.id}
                                  type="button"
                                  onClick={() => toggleBand(band.id)}
                                  className={cn(
                                    "inline-flex min-h-[34px] items-center rounded-[2px] border px-3 text-[12px] font-medium transition-colors",
                                    isSelected
                                      ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-canvas)]"
                                      : "border-[var(--color-hairline-strong)] bg-[var(--color-surface)] text-[var(--color-ink)] hover:border-[var(--color-ink)]",
                                  )}
                                >
                                  {band.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="flex items-center justify-between border-t border-[var(--color-hairline)] bg-[var(--color-surface)] px-6 py-4">
                <button
                  type="button"
                  onClick={clearAll}
                  disabled={activeCount === 0}
                  className="text-[12px] font-medium uppercase tracking-[0.12em] text-[var(--color-muted)] transition-colors hover:text-[var(--color-ink)] disabled:opacity-40 disabled:hover:text-[var(--color-muted)]"
                >
                  Reset all
                </button>

                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="inline-flex min-h-[44px] items-center justify-center rounded-[2px] border border-[var(--color-ink)] bg-[var(--color-ink)] px-6 text-[13px] font-semibold uppercase tracking-[0.12em] text-[var(--color-canvas)] transition-transform active:scale-95"
                >
                  {resultCount === totalCount
                    ? `Show all (${resultCount})`
                    : `Show ${resultCount} pieces`}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
