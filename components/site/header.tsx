"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Handbag, MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";
import { useCart } from "@/components/cart/cart-provider";
import { SearchModal } from "@/components/site/search-modal";
import { cn } from "@/lib/cn";
import { CATEGORIES } from "@/lib/catalog";
import { formatBadgeCount } from "@/lib/format";

/**
 * Global header.
 *
 * Desktop is a three-part rail at 72px: categories left, wordmark centred,
 * utilities right. There is no hamburger. With three categories the mobile
 * answer is a second hairline row rather than a menu behind a button, which
 * keeps every destination one tap away.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const { itemCount, isReady, openDrawer } = useCart();
  const [isSearchOpen, setSearchOpen] = useState(false);

  const isActive = (slug: string) => pathname === `/${slug}` || pathname.startsWith(`/${slug}/`);

  const navLinkClass = (active: boolean) =>
    cn(
      "relative inline-flex min-h-[44px] items-center text-[12px] font-semibold uppercase tracking-[0.16em]",
      "transition-colors duration-200 [transition-timing-function:var(--ease-quiet)]",
      active ? "text-[var(--color-ink)]" : "text-[var(--color-muted)] hover:text-[var(--color-ink)]",
      // The rule under the active category is drawn with a pseudo element so it
      // never adds height and never shifts the row.
      "after:pointer-events-none after:absolute after:inset-x-0 after:bottom-[10px] after:h-px",
      "after:origin-left after:bg-current after:transition-transform after:duration-300",
      "after:[transition-timing-function:var(--ease-spring)]",
      active ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100",
    );

  const utilityButtonClass =
    "relative flex h-11 w-11 items-center justify-center text-[var(--color-muted)] " +
    "transition-colors duration-200 [transition-timing-function:var(--ease-quiet)] " +
    "hover:text-[var(--color-ink)]";

  return (
    <>
      <header
        className={
          "sticky top-0 z-[40] border-b border-[var(--color-hairline)] " +
          "bg-[var(--color-frost)] backdrop-blur-[12px] backdrop-saturate-150"
        }
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <div className="atelier-shell">
          {/* -------------------------------------------------- primary rail */}
          <div className="grid h-16 grid-cols-[1fr_auto_1fr] items-center gap-4 md:h-[72px]">
            {/* Left: categories on desktop, search on mobile. */}
            <nav aria-label="Collections" className="hidden md:block">
              <ul className="flex items-center gap-8">
                {CATEGORIES.map((category) => {
                  const active = isActive(category.slug);
                  return (
                    <li key={category.slug}>
                      <Link
                        href={`/${category.slug}`}
                        aria-current={active ? "page" : undefined}
                        className={navLinkClass(active)}
                        data-testid={`nav-${category.slug}`}
                      >
                        {category.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="flex md:hidden">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                aria-label="Open search"
                aria-haspopup="dialog"
                data-testid="search-trigger-mobile"
                className={cn(utilityButtonClass, "-ml-3")}
              >
                <MagnifyingGlass aria-hidden="true" weight="light" size={20} />
              </button>
            </div>

            {/* Centre: wordmark. Tracking is the brand signature, so it is set
                here rather than inherited. */}
            <Link
              href="/"
              translate="no"
              className="justify-self-center font-sans text-[15px] font-semibold uppercase tracking-[0.2em] text-[var(--color-ink)] transition-colors duration-200 md:text-[17px] md:tracking-[0.22em]"
            >
              Modasquare
            </Link>

            {/* Right: utilities. */}
            <div className="flex items-center justify-end gap-1">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                aria-label="Open search"
                aria-haspopup="dialog"
                data-testid="search-trigger"
                className={cn(utilityButtonClass, "hidden md:flex")}
              >
                <MagnifyingGlass aria-hidden="true" weight="light" size={20} />
              </button>

              <button
                type="button"
                onClick={openDrawer}
                aria-haspopup="dialog"
                data-testid="cart-trigger"
                aria-label={
                  isReady && itemCount > 0
                    ? `Open bag, ${itemCount} ${itemCount === 1 ? "item" : "items"}`
                    : "Open bag, empty"
                }
                className={cn(utilityButtonClass, "-mr-3")}
              >
                <Handbag aria-hidden="true" weight="light" size={20} />

                {/* The count renders only after the client has read persisted
                    state, so the server and first client paint agree. */}
                {isReady && itemCount > 0 ? (
                  <span
                    aria-hidden="true"
                    data-testid="cart-count"
                    className="numeral absolute -right-0.5 top-1 min-w-[18px] rounded-[2px] bg-[var(--color-ink)] px-1 py-px text-center text-[10px] font-medium leading-[14px] text-[var(--color-canvas)]"
                  >
                    {formatBadgeCount(itemCount)}
                  </span>
                ) : null}
              </button>
            </div>
          </div>

          {/* ------------------------------------------------- mobile rail */}
          <nav
            aria-label="Collections"
            className="-mx-[var(--spacing-gutter)] border-t border-[var(--color-hairline)] md:hidden"
          >
            <ul className="flex">
              {CATEGORIES.map((category) => {
                const active = isActive(category.slug);
                return (
                  <li key={category.slug} className="flex-1">
                    <Link
                      href={`/${category.slug}`}
                      aria-current={active ? "page" : undefined}
                      data-testid={`nav-mobile-${category.slug}`}
                      className={cn(
                        "flex min-h-[44px] items-center justify-center text-[12px] font-semibold uppercase tracking-[0.16em]",
                        "transition-colors duration-200",
                        active
                          ? "text-[var(--color-ink)] shadow-[inset_0_-1px_0_0_var(--color-ink)]"
                          : "text-[var(--color-muted)]",
                      )}
                    >
                      {category.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </header>

      <SearchModal isOpen={isSearchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
