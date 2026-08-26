"use client";

import Link from "next/link";
import { useId, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { MagnifyingGlass, X } from "@phosphor-icons/react/dist/ssr";
import { Frame } from "@/components/ui/frame";
import { useDialog } from "@/components/ui/use-dialog";
import { CATEGORIES, PRODUCTS } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";

const MAX_RESULTS = 6;

/**
 * Search overlay.
 *
 * The catalogue is static and small, so matching runs locally against name,
 * line, colour and fabric. Three states are designed rather than one: the
 * resting state offers collections, the matched state lists products, and the
 * unmatched state offers a way out instead of a dead end.
 */
export function SearchModal({
  isOpen,
  onClose,
}: {
  readonly isOpen: boolean;
  readonly onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const reduceMotion = useReducedMotion();
  const inputRef = useRef<HTMLInputElement>(null);
  const labelId = useId();
  const surfaceRef = useDialog<HTMLDivElement>({
    isOpen,
    onClose,
    initialFocusRef: inputRef,
  });

  const trimmed = query.trim().toLowerCase();

  const results = useMemo(() => {
    if (trimmed.length < 2) return [];
    return PRODUCTS.filter((product) =>
      [product.name, product.line, product.colour, product.fabric, product.fit]
        .join(" ")
        .toLowerCase()
        .includes(trimmed),
    ).slice(0, MAX_RESULTS);
  }, [trimmed]);

  const hasQuery = trimmed.length >= 2;

  return (
    <AnimatePresence>
      {isOpen ? (
        <div className="fixed inset-0 z-[60]">
          <motion.button
            type="button"
            aria-label="Close search"
            onClick={onClose}
            className="absolute inset-0 h-full w-full cursor-default bg-[var(--color-scrim)] backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.28, ease: [0.4, 0, 0.2, 1] }}
          />

          <motion.div
            ref={surfaceRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelId}
            tabIndex={-1}
            data-testid="search-modal"
            className="absolute inset-x-0 top-0 max-h-[88dvh] overflow-hidden border-b border-[var(--color-hairline)] bg-[var(--color-canvas)] outline-none"
            initial={reduceMotion ? { opacity: 0 } : { y: "-100%" }}
            animate={reduceMotion ? { opacity: 1 } : { y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { y: "-100%" }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="atelier-shell flex max-h-[88dvh] flex-col py-6">
              <div className="flex items-center justify-between gap-4">
                <h2
                  id={labelId}
                  className="numeral text-[11px] uppercase tracking-[0.18em] text-[var(--color-muted)]"
                >
                  Search
                </h2>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close search"
                  data-testid="search-close"
                  className="-mr-2 flex h-11 w-11 items-center justify-center text-[var(--color-muted)] transition-colors duration-200 hover:text-[var(--color-ink)]"
                >
                  <X aria-hidden="true" weight="light" size={20} />
                </button>
              </div>

              {/* Search is a form so Enter behaves the way the keyboard expects.
                  Submission is a no-op here: results are already live. */}
              <form
                role="search"
                onSubmit={(event) => event.preventDefault()}
                className="mt-4 flex items-center gap-3 border-b border-[var(--color-ink)] pb-3"
              >
                <MagnifyingGlass
                  aria-hidden="true"
                  weight="light"
                  size={22}
                  className="shrink-0 text-[var(--color-muted)]"
                />
                <label htmlFor="site-search" className="sr-only">
                  Search products by name, colour or fabric
                </label>
                <input
                  ref={inputRef}
                  id="site-search"
                  name="q"
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  autoComplete="off"
                  spellCheck={false}
                  enterKeyHint="search"
                  placeholder="Wool trouser, nylon, oversized…"
                  className="min-w-0 flex-1 bg-transparent font-display text-[clamp(1.5rem,4vw,2.25rem)] leading-tight text-[var(--color-ink)] outline-none placeholder:text-[var(--color-muted)] placeholder:opacity-60"
                />
                {query ? (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      inputRef.current?.focus();
                    }}
                    className="shrink-0 text-[12px] uppercase tracking-[0.12em] text-[var(--color-muted)] transition-colors duration-200 hover:text-[var(--color-ink)]"
                  >
                    Clear
                  </button>
                ) : null}
              </form>

              <div className="scroll-contained mt-6 min-h-0 flex-1 overflow-y-auto pb-4">
                {!hasQuery ? (
                  <div>
                    <p className="numeral text-[11px] uppercase tracking-[0.16em] text-[var(--color-muted)]">
                      Collections
                    </p>
                    <ul className="mt-3 flex flex-wrap gap-x-8 gap-y-2">
                      {CATEGORIES.map((category) => (
                        <li key={category.slug}>
                          <Link
                            href={`/${category.slug}`}
                            onClick={onClose}
                            className="link-ghost font-display text-[28px] leading-tight text-[var(--color-ink)]"
                          >
                            {category.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : results.length === 0 ? (
                  <div className="max-w-[46ch]">
                    <p className="text-[15px] leading-relaxed text-[var(--color-ink)]">
                      {`No pieces match "${query.trim()}".`}
                    </p>
                    <p className="mt-2 text-[14px] leading-relaxed text-[var(--color-muted)]">
                      Try a fabric such as merino or ripstop, a colour such as bone, or open a
                      collection.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                      {CATEGORIES.map((category) => (
                        <Link
                          key={category.slug}
                          href={`/${category.slug}`}
                          onClick={onClose}
                          className="link-ghost text-[13px] uppercase tracking-[0.12em] text-[var(--color-ink)]"
                        >
                          {category.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    <p
                      aria-live="polite"
                      className="numeral text-[11px] uppercase tracking-[0.16em] text-[var(--color-muted)]"
                    >
                      {results.length === 1 ? "1 result" : `${results.length} results`}
                    </p>

                    <ul
                      className="mt-4 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-6"
                      data-testid="search-results"
                    >
                      {results.map((product) => (
                        <li key={product.slug}>
                          <Link
                            href={`/product/${product.slug}`}
                            onClick={onClose}
                            className="group block"
                          >
                            <Frame
                              ratio="3:4"
                              label={product.colour}
                              image={product.gallery[0]?.image}
                              alt={product.name}
                              pitch={22}
                            />
                            <p className="mt-2 truncate text-[14px] text-[var(--color-ink)] underline decoration-transparent decoration-1 underline-offset-4 transition-[text-decoration-color] duration-200 group-hover:decoration-[var(--color-ink)]">
                              {product.name}
                            </p>
                            <p className="numeral text-[12px] text-[var(--color-muted)]">
                              {formatPrice(product.price)}
                            </p>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
