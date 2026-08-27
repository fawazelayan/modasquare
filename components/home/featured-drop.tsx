"use client";

import { ProductCard } from "@/components/plp/product-card";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { openDepartmentMenu } from "@/components/site/department-droplist";
import { FEATURED_DROP_SLUGS, getProducts } from "@/lib/catalog";

/**
 * Featured drop.
 *
 * A pinned title beside a scroll-snap rail. The rail is a plain overflow
 * container: every tile holds a real link, so tabbing walks the rail and the
 * browser scrolls each card into view. There is no drag-only gesture and no
 * hijacked scroll to recover from.
 */
export function FeaturedDrop() {
  const products = getProducts(FEATURED_DROP_SLUGS);

  return (
    <section
      id="featured-drop"
      aria-labelledby="featured-drop-title"
      className="atelier-section border-y border-[var(--color-hairline)] bg-[var(--color-surface)]"
    >
      <div className="atelier-shell">
        <div className="grid grid-cols-1 gap-y-10 lg:grid-cols-[minmax(0,0.34fr)_minmax(0,1fr)] lg:gap-x-16">
          <Reveal className="lg:sticky lg:top-32 lg:self-start">
            <h2
              id="featured-drop-title"
              className="max-w-[14ch] font-display text-[length:var(--text-h2)] font-light leading-[1.12] tracking-[-0.01em] text-[var(--color-ink)]"
            >
              This week on the floor
            </h2>
            <p className="mt-4 max-w-[38ch] text-[15px] leading-relaxed text-[var(--color-muted)]">
              Four pieces released together. Sizes are held for seven days, then the run
              closes.
            </p>
            <Button
              type="button"
              variant="secondary"
              className="mt-7"
              onClick={openDepartmentMenu}
            >
              Shop the collection
            </Button>
          </Reveal>

          {/* The rail bleeds into the right gutter so the last tile is clipped
              rather than resolved, which is what signals that it scrolls. */}
          <div className="min-w-0 -mr-[var(--spacing-gutter)] lg:-mr-[calc(var(--spacing-gutter)/2)]">
            <ul
              className="scroll-contained flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 pr-[var(--spacing-gutter)]"
              data-testid="drop-rail"
            >
              {products.map((product) => (
                <li
                  key={product.slug}
                  className="w-[70vw] shrink-0 snap-start sm:w-[46vw] lg:w-[calc((100%-3rem)/2.4)]"
                >
                  <ProductCard product={product} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
