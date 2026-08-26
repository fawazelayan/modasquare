"use client";

import { useRef, useState } from "react";
import { CircleNotch, WarningCircle } from "@phosphor-icons/react/dist/ssr";
import { useCart } from "@/components/cart/cart-provider";
import { SpecAccordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { cn } from "@/lib/cn";
import { FREE_SHIPPING_THRESHOLD, type Product, type SizeLabel } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";

/**
 * Purchase controls.
 *
 * The size selector is a real radio group: native inputs kept off screen with
 * `sr-only`, each one wrapped in its own label so the control and its target
 * share a single hit area with no dead zone. Arrow-key roving between options,
 * the required-field semantics and the disabled handling all come from the
 * platform rather than from a re-implementation on top of divs.
 *
 * Add to bag stays enabled with no size chosen. Pressing it surfaces the
 * validation and moves focus to the first size, which is the behaviour
 * AGENTS.md asks for rather than a greyed-out button with no explanation.
 */
export function PurchasePanel({ product }: { readonly product: Product }) {
  const { addLine } = useCart();
  const [size, setSize] = useState<SizeLabel | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setAdding] = useState(false);
  const firstSizeRef = useRef<HTMLInputElement>(null);

  const inStockCount = product.sizes.filter((option) => option.inStock).length;
  const isSoldOut = inStockCount === 0;

  const handleAdd = async () => {
    if (isAdding) return;

    if (!size) {
      setError("Choose a size to continue.");
      firstSizeRef.current?.focus();
      return;
    }

    setError(null);
    setAdding(true);
    // Stands in for the cart mutation. Kept short: AGENTS.md targets sub-500ms.
    await new Promise((resolve) => setTimeout(resolve, 280));
    addLine(product, size, quantity);
    setAdding(false);
  };

  return (
    <div className="lg:sticky lg:top-[calc(var(--header-height)+2rem)] lg:self-start">
      <p className="numeral text-[11px] uppercase tracking-[0.16em] text-[var(--color-muted)]">
        {product.line}
      </p>

      <h1 className="mt-3 font-display text-[clamp(1.875rem,3vw,2.75rem)] font-light leading-[1.08] tracking-[-0.02em] text-[var(--color-ink)]">
        {product.name}
      </h1>

      <p className="numeral mt-3 text-[18px] text-[var(--color-ink)]">
        {formatPrice(product.price)}
      </p>

      <p className="mt-5 max-w-[52ch] text-[15px] leading-[1.75] text-[var(--color-muted)]">
        {product.summary}
      </p>

      <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-2 text-[13px]">
        <div className="flex gap-2">
          <dt className="text-[var(--color-muted)]">Colour</dt>
          <dd className="text-[var(--color-ink)]">{product.colour}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="text-[var(--color-muted)]">Fit</dt>
          <dd className="text-[var(--color-ink)]">{product.fit}</dd>
        </div>
      </dl>

      {/* ----------------------------------------------------- size selector */}
      <fieldset className="mt-8" data-testid="size-selector">
        <div className="flex items-baseline justify-between gap-4">
          <legend className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink)]">
            Size
          </legend>
          {/* Scarcity read from the data, not invented. */}
          {!isSoldOut && inStockCount <= 3 ? (
            <p className="numeral text-[11px] uppercase tracking-[0.12em] text-[var(--color-muted)]">
              {inStockCount === 1 ? "1 size left" : `${inStockCount} sizes left`}
            </p>
          ) : null}
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {product.sizes.map((option, index) => {
            const isSelected = size === option.label;
            return (
              <label
                key={option.label}
                data-testid={`size-${option.label}`}
                className={cn(
                  "relative inline-flex cursor-pointer select-none",
                  !option.inStock && "cursor-not-allowed",
                )}
              >
                <input
                  ref={index === 0 ? firstSizeRef : undefined}
                  type="radio"
                  name="product-size"
                  value={option.label}
                  disabled={!option.inStock}
                  checked={isSelected}
                  onChange={() => {
                    setSize(option.label);
                    setError(null);
                  }}
                  className="peer sr-only"
                  data-testid={`size-input-${option.label}`}
                />
                <span
                  className={cn(
                    "numeral inline-flex h-12 min-w-[3.25rem] items-center justify-center",
                    "rounded-[2px] border px-3 text-[13px] uppercase tracking-[0.08em]",
                    "transition-[background-color,color,border-color] duration-200",
                    "[transition-timing-function:var(--ease-quiet)]",
                    // The visible box carries the focus ring, because the real
                    // input is off screen.
                    "peer-focus-visible:outline peer-focus-visible:outline-2",
                    "peer-focus-visible:outline-offset-[3px] peer-focus-visible:outline-[var(--color-accent)]",
                    option.inStock
                      ? "border-[var(--color-hairline-strong)] text-[var(--color-ink)] hover:border-[var(--color-ink)]"
                      : // Sold out: struck through, dimmed, and disabled in the
                        // accessibility tree. Three cues, none of them colour.
                        "border-[var(--color-hairline)] text-[var(--color-muted)] line-through",
                    "peer-checked:border-[var(--color-ink)] peer-checked:bg-[var(--color-ink)] peer-checked:text-[var(--color-canvas)]",
                  )}
                >
                  {option.label}
                  {!option.inStock ? <span className="sr-only">, sold out</span> : null}
                </span>
              </label>
            );
          })}
        </div>

        <p
          aria-live="polite"
          className="mt-3 flex min-h-[1.25rem] items-start gap-2 text-[13px] leading-snug text-[var(--color-ink)]"
        >
          {error ? (
            <>
              <WarningCircle
                aria-hidden="true"
                weight="regular"
                size={15}
                className="mt-[3px] shrink-0 text-[var(--color-accent)]"
              />
              <span data-testid="size-error">{error}</span>
            </>
          ) : null}
        </p>
      </fieldset>

      {/* ------------------------------------------------------- add to bag */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <QuantityStepper
          value={quantity}
          label={product.name}
          onChange={setQuantity}
          testId="pdp-qty"
          className="h-[52px]"
        />

        <Button
          variant="primary"
          size="lg"
          onClick={handleAdd}
          disabled={isSoldOut || isAdding}
          data-testid="add-to-bag"
          className="min-w-[13rem] flex-1"
        >
          {isAdding ? (
            <CircleNotch
              aria-hidden="true"
              weight="bold"
              size={14}
              className="motion-safe:animate-spin"
            />
          ) : null}
          {/* Label survives the pending state rather than being swapped out. */}
          {isSoldOut ? "Sold out" : "Add to bag"}
        </Button>
      </div>

      <p className="mt-4 text-[13px] leading-relaxed text-[var(--color-muted)]">
        Complimentary shipping over {formatPrice(FREE_SHIPPING_THRESHOLD)}. Returns collected from your address
        within 30 days.
      </p>

      {/* -------------------------------------------------------- specifics */}
      <div className="mt-10">
        <SpecAccordion panels={product.specs} defaultOpenId={product.specs[0]?.id} />
      </div>
    </div>
  );
}
