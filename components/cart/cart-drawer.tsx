"use client";

import Link from "next/link";
import { useId } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUUpLeft, Check, X } from "@phosphor-icons/react/dist/ssr";
import { useCart } from "@/components/cart/cart-provider";
import { openDepartmentMenu } from "@/components/site/department-droplist";
import { Button } from "@/components/ui/button";
import { Frame } from "@/components/ui/frame";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { useDialog } from "@/components/ui/use-dialog";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";

/**
 * Slide-over bag.
 *
 * Mounted once in the root layout, so every route can open it. Motion here is
 * a single transform on the panel plus an opacity on the scrim, which is the
 * spring curve named in DESIGN.md 6 and nothing the compositor cannot handle.
 */
export function CartDrawer() {
  const {
    lines,
    lastRemoved,
    itemCount,
    subtotal,
    remainingForFreeShipping,
    shippingProgress,
    isDrawerOpen,
    closeDrawer,
    setQuantity,
    removeLine,
    restoreLine,
  } = useCart();

  const reduceMotion = useReducedMotion();
  const titleId = useId();
  const surfaceRef = useDialog<HTMLDivElement>({ isOpen: isDrawerOpen, onClose: closeDrawer });

  const qualifiesForFreeShipping = remainingForFreeShipping === 0 && subtotal > 0;

  return (
    <AnimatePresence>
      {isDrawerOpen ? (
        <div className="fixed inset-0 z-[70] overflow-hidden" data-testid="cart-drawer-root">
          <motion.button
            type="button"
            aria-label="Close bag"
            onClick={closeDrawer}
            className="absolute inset-0 h-full w-full cursor-default bg-[var(--color-scrim)] backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.32, ease: [0.4, 0, 0.2, 1] }}
          />

          <motion.div
            ref={surfaceRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            data-testid="cart-drawer"
            className={
              // A sliver of scrim stays uncovered on a phone. A drawer that fills
              // the whole screen reads as a new page and takes the tap-outside
              // gesture away with it.
              "absolute right-0 top-0 flex h-full w-[calc(100%-3.5rem)] max-w-[30rem] flex-col " +
              "sm:w-full " +
              "border-l border-[var(--color-hairline)] bg-[var(--color-canvas)] outline-none " +
              "sm:max-w-[26rem] lg:max-w-[30rem]"
            }
            style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
            initial={reduceMotion ? { opacity: 0 } : { x: "100%" }}
            animate={reduceMotion ? { opacity: 1 } : { x: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { x: "100%" }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { duration: 0.56, ease: [0.16, 1, 0.3, 1] }
            }
          >
            {/* ---------------------------------------------------- header */}
            <header className="flex items-start justify-between gap-4 border-b border-[var(--color-hairline)] px-6 py-5">
              <div className="min-w-0">
                <h2
                  id={titleId}
                  className="font-display text-[26px] leading-tight tracking-[-0.01em] text-[var(--color-ink)]"
                >
                  Your bag
                </h2>
                <p className="numeral mt-1 text-[11px] uppercase tracking-[0.16em] text-[var(--color-muted)]">
                  {itemCount === 1 ? "1 item" : `${itemCount} items`}
                </p>
              </div>

              <button
                type="button"
                onClick={closeDrawer}
                aria-label="Close bag"
                data-testid="cart-close"
                className={
                  "-mr-2 flex h-11 w-11 shrink-0 items-center justify-center text-[var(--color-muted)] " +
                  "transition-colors duration-200 [transition-timing-function:var(--ease-quiet)] " +
                  "hover:text-[var(--color-ink)]"
                }
              >
                <X aria-hidden="true" weight="light" size={20} />
              </button>
            </header>

            {/* ----------------------------------------------------- lines */}
            <div className="scroll-contained min-h-0 flex-1 overflow-y-auto">
              {lines.length === 0 ? (
                <EmptyBag onClose={closeDrawer} />
              ) : (
                <ul className="divide-y divide-[var(--color-hairline)] px-6">
                  {lines.map((line) => (
                    <li key={line.id} className="flex gap-4 py-5" data-testid="cart-line">
                      <Link
                        href={`/product/${line.slug}`}
                        onClick={closeDrawer}
                        className="w-20 shrink-0"
                        tabIndex={-1}
                        aria-hidden="true"
                      >
                        <Frame
                          ratio="3:4"
                          label={line.colour}
                          image={line.image}
                          alt={line.name}
                          pitch={18}
                        />
                      </Link>

                      <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
                        <div>
                          <div className="flex items-baseline justify-between gap-2">
                            <Link
                              href={`/product/${line.slug}`}
                              onClick={closeDrawer}
                              className="link-ghost min-w-0 flex-1 truncate text-[14px] font-medium text-[var(--color-ink)] sm:text-[15px]"
                            >
                              {line.name}
                            </Link>

                            <p className="numeral shrink-0 text-right text-[13px] text-[var(--color-ink)] sm:text-[14px]">
                              {formatPrice(line.price * line.quantity)}
                            </p>
                          </div>

                          <p className="numeral mt-1 text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted)]">
                            {`${line.colour} / Size ${line.size}`}
                          </p>
                        </div>

                        <div className="mt-3 flex items-center justify-between gap-3">
                          <QuantityStepper
                            value={line.quantity}
                            label={`${line.name}, size ${line.size}`}
                            onChange={(next) => setQuantity(line.id, next)}
                            testId={`qty-${line.id}`}
                          />

                          <button
                            type="button"
                            onClick={() => removeLine(line.id)}
                            data-testid={`remove-${line.id}`}
                            className={
                              "min-h-[44px] px-1 text-[12px] uppercase tracking-[0.12em] " +
                              "text-[var(--color-muted)] underline decoration-[var(--color-hairline-strong)] " +
                              "underline-offset-4 transition-colors duration-200 " +
                              "[transition-timing-function:var(--ease-quiet)] hover:text-[var(--color-ink)] " +
                              "hover:decoration-current"
                            }
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Undo window. Removal is reversible for eight seconds rather than
                guarded behind a confirmation dialog. */}
            <div aria-live="polite" className="empty:hidden">
              {lastRemoved ? (
                <div
                  data-testid="cart-undo"
                  className="flex items-center justify-between gap-3 border-t border-[var(--color-hairline)] bg-[var(--color-surface)] px-6 py-3"
                >
                  <p className="min-w-0 truncate text-[13px] text-[var(--color-muted)]">
                    {`Removed ${lastRemoved.line.name}.`}
                  </p>
                  <button
                    type="button"
                    onClick={restoreLine}
                    className="shrink-0 text-[12px] uppercase tracking-[0.12em] text-[var(--color-ink)] underline underline-offset-4"
                  >
                    Undo
                  </button>
                </div>
              ) : null}
            </div>

            {/* ---------------------------------------------------- footer */}
            {lines.length > 0 ? (
              <footer className="border-t border-[var(--color-hairline)] bg-[var(--color-canvas)] px-6 py-5">
                <div className="flex items-baseline justify-between text-[13px]">
                  <span className="uppercase tracking-[0.12em] text-[var(--color-muted)]">
                    Subtotal
                  </span>
                  <span
                    className="numeral text-[16px] text-[var(--color-ink)]"
                    data-testid="cart-subtotal"
                  >
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <p className="mt-1.5 text-[12px] leading-relaxed text-[var(--color-muted)]">
                  Taxes and delivery are calculated at the next step.
                </p>

                <button
                  type="button"
                  data-testid="checkout-button"
                  className={
                    "mt-4 flex min-h-[48px] w-full items-center justify-center rounded-[2px] " +
                    "bg-[var(--color-ink)] px-6 text-[13px] font-semibold uppercase tracking-[0.14em] " +
                    "text-[var(--color-canvas)] transition-opacity duration-200 " +
                    "[transition-timing-function:var(--ease-quiet)] hover:opacity-90"
                  }
                >
                  Proceed to checkout
                </button>

                <button
                  type="button"
                  onClick={closeDrawer}
                  className="mt-3 min-h-[44px] w-full text-[12px] uppercase tracking-[0.12em] text-[var(--color-muted)] transition-colors duration-200 hover:text-[var(--color-ink)]"
                >
                  Continue shopping
                </button>
              </footer>
            ) : null}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}

/**
 * Empty state. It names what is missing and offers the next step rather than
 * leaving the customer at a dead end.
 */
function EmptyBag({ onClose }: { readonly onClose: () => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-5 px-8 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-surface)] text-[var(--color-ink)]">
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      </div>

      <div>
        <p className="font-display text-[22px] leading-tight text-[var(--color-ink)]">
          Nothing here yet
        </p>
        <p className="mx-auto mt-2 max-w-[28ch] text-[14px] leading-relaxed text-[var(--color-muted)]">
          Pieces you add from any collection will be held here.
        </p>
      </div>

      <button
        type="button"
        onClick={() => {
          onClose();
          openDepartmentMenu();
        }}
        className={
          "inline-flex min-h-[44px] items-center justify-center rounded-[2px] border " +
          "border-[var(--color-ink)] px-8 text-[13px] font-semibold uppercase tracking-[0.14em] " +
          "text-[var(--color-ink)] transition-colors duration-200 " +
          "[transition-timing-function:var(--ease-quiet)] hover:bg-[var(--color-ink)] " +
          "hover:text-[var(--color-canvas)]"
        }
      >
        Browse
      </button>
    </div>
  );
}
