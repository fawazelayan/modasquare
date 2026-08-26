"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/cart/cart-provider";
import { Frame } from "@/components/ui/frame";
import { cn } from "@/lib/cn";
import type { Product, SizeLabel } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";

/**
 * Product tile.
 *
 * Two behaviours live here. The frame crossfades to the second gallery angle on
 * hover, which is the lookbook interaction in DESIGN.md 6, and a quick-size row
 * lets a size go straight into the bag without opening the product.
 *
 * The quick-size row is always in the DOM. Hiding it behind `hidden` would take
 * it out of the tab order, so instead it is transparent at desktop rest and
 * resolves on hover or focus-within. Below `lg` there is no hover to depend on,
 * so it is simply visible.
 */
export function ProductCard({
  product,
  /** `dense` trims the lockup for the multi-column grid. */
  density = "editorial",
}: {
  readonly product: Product;
  readonly density?: "editorial" | "dense";
}) {
  const { addLine } = useCart();
  const [pendingSize, setPendingSize] = useState<SizeLabel | null>(null);

  const [primary, secondary] = product.gallery;
  const isDense = density === "dense";

  const handleQuickAdd = (size: SizeLabel) => {
    setPendingSize(size);
    addLine(product, size, 1);
    // The drawer takes over as the confirmation, so the tile only needs to hold
    // the selected state long enough to read as a response to the tap.
    setTimeout(() => setPendingSize(null), 1200);
  };

  return (
    <article
      className="group relative flex flex-col"
      data-testid="product-card"
      data-slug={product.slug}
    >
      <div className="relative overflow-hidden rounded-[2px]">
        <Link
          href={`/product/${product.slug}`}
          className="block focus-visible:outline-offset-[-2px]"
          aria-label={`${product.name}, ${product.colour}, ${formatPrice(product.price)}`}
        >
          {/* Resting angle. Scales a hair on hover, per the 1.03 zoom in
              DESIGN.md 1, and holds still under reduced motion. */}
          <div
            className={cn(
              "transition-transform duration-[700ms] [transition-timing-function:var(--ease-spring)]",
              "motion-safe:group-hover:scale-[1.03]",
            )}
          >
            <Frame
              ratio={product.ratio}
              label={product.colour}
              note={isDense ? undefined : primary?.label}
              pitch={isDense ? 26 : 40}
            />
          </div>

          {/* Second angle, crossfaded in. Absolute so it cannot affect layout. */}
          {secondary ? (
            <div
              aria-hidden="true"
              className={cn(
                "pointer-events-none absolute inset-0 opacity-0",
                "transition-opacity duration-[420ms] [transition-timing-function:var(--ease-quiet)]",
                "group-hover:opacity-100 group-focus-within:opacity-100",
              )}
            >
              <Frame
                ratio={product.ratio}
                label={secondary.label}
                note={isDense ? undefined : "Second angle"}
                tone="raised"
                pitch={isDense ? 26 : 40}
              />
            </div>
          ) : null}
        </Link>

        {product.isNew ? (
          // The only ochre-bordered element on a tile. Text stays at ink so the
          // badge never depends on the accent for legibility.
          <span
            className={
              "numeral pointer-events-none absolute left-3 top-3 rounded-[2px] " +
              "border border-[var(--color-accent)] bg-[var(--color-canvas)] px-2 py-1 " +
              "text-[10px] uppercase tracking-[0.16em] text-[var(--color-ink)]"
            }
          >
            Just in
          </span>
        ) : null}

        {/* ------------------------------------------------------ quick size */}
        <div
          className={cn(
            "mt-3 lg:absolute lg:inset-x-0 lg:bottom-0 lg:mt-0 lg:p-3",
            "lg:opacity-0 lg:transition-opacity lg:duration-300",
            "lg:[transition-timing-function:var(--ease-quiet)]",
            "lg:group-hover:opacity-100 lg:group-focus-within:opacity-100",
          )}
        >
          <fieldset className="lg:rounded-[2px] lg:bg-[var(--color-frost)] lg:p-2 lg:backdrop-blur-[10px]">
            <legend className="sr-only">{`Add ${product.name} to bag in a size`}</legend>
            <div className="flex flex-wrap gap-1.5">
              {product.sizes.map((option) => {
                const isPending = pendingSize === option.label;
                return (
                  <button
                    key={option.label}
                    type="button"
                    disabled={!option.inStock}
                    onClick={() => handleQuickAdd(option.label)}
                    data-testid={`quick-size-${product.slug}-${option.label}`}
                    aria-label={
                      option.inStock
                        ? `Add ${product.name} in size ${option.label} to bag`
                        : `${product.name} in size ${option.label} is sold out`
                    }
                    className={cn(
                      "numeral inline-flex h-11 min-w-[2.75rem] items-center justify-center",
                      "rounded-[2px] border text-[11px] uppercase tracking-[0.1em]",
                      "transition-[background-color,color,border-color] duration-200",
                      "[transition-timing-function:var(--ease-quiet)] lg:h-9 lg:min-w-[2.25rem]",
                      option.inStock
                        ? "border-[var(--color-hairline-strong)] bg-[var(--color-canvas)] text-[var(--color-ink)] hover:border-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-[var(--color-canvas)]"
                        : // Sold out reads through three cues at once: the strike,
                          // the muted tone and the disabled state in the a11y tree.
                          "cursor-not-allowed border-[var(--color-hairline)] bg-transparent text-[var(--color-muted)] line-through",
                      isPending &&
                        "border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-canvas)]",
                    )}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </fieldset>
        </div>
      </div>

      {/* ------------------------------------------------------ price lockup */}
      <div className={cn("mt-3 flex items-start justify-between gap-4", isDense && "mt-2 gap-2")}>
        <div className="min-w-0">
          <h3 className={cn("truncate text-[var(--color-ink)]", isDense ? "text-[14px]" : "text-[15px]")}>
            <Link href={`/product/${product.slug}`} className="link-ghost decoration-transparent">
              {product.name}
            </Link>
          </h3>
          {/* Staggered lockup: the fabric note sits under the name rather than
              beside it, so the column reads down instead of across. */}
          <p
            className={cn(
              "mt-0.5 truncate text-[var(--color-muted)]",
              isDense ? "text-[12px]" : "text-[13px]",
            )}
          >
            {isDense ? product.colour : `${product.colour}. ${product.fabric}.`}
          </p>
        </div>

        <p
          className={cn(
            "numeral shrink-0 text-[var(--color-ink)]",
            isDense ? "text-[13px]" : "text-[14px]",
          )}
        >
          {formatPrice(product.price)}
        </p>
      </div>
    </article>
  );
}
