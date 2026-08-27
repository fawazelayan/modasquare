"use client";

import Link from "next/link";
import { useState } from "react";
import { Handbag, MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";
import { useCart } from "@/components/cart/cart-provider";
import { DepartmentDroplist } from "@/components/site/department-droplist";
import { SearchModal } from "@/components/site/search-modal";
import { cn } from "@/lib/cn";
import { CATEGORIES } from "@/lib/catalog";
import { formatBadgeCount } from "@/lib/format";

/**
 * Global header with 3-lines Tree Droplist on the left,
 * clean MODASQUARE in center, and utilities on the right.
 */
export function SiteHeader() {
  const { itemCount, isReady, openDrawer } = useCart();
  const [isSearchOpen, setSearchOpen] = useState(false);

  const utilityButtonClass =
    "group relative flex h-11 w-11 items-center justify-center rounded-[2px] text-[var(--color-ink)] " +
    "transition-all duration-200 [transition-timing-function:var(--ease-spring)] " +
    "hover:bg-[var(--color-surface)] hover:scale-105 active:scale-95";

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
          <div className="grid h-16 grid-cols-[1fr_auto_1fr] items-center gap-2 md:h-[72px]">
            {/* Left: 3-Lines Tree Droplist Button + Search Magnifier */}
            <div className="flex min-w-0 items-center gap-1">
              {/* 3-lines icon button */}
              <DepartmentDroplist className="shrink-0 -ml-2" />

              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                aria-label="Open search"
                aria-haspopup="dialog"
                data-testid="search-trigger"
                className={cn(utilityButtonClass, "hidden md:flex")}
              >
                <MagnifyingGlass
                  aria-hidden="true"
                  weight="regular"
                  size={20}
                  className="transition-transform duration-200 [transition-timing-function:var(--ease-spring)] group-hover:scale-110 group-hover:-rotate-6"
                />
              </button>

              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                aria-label="Open search"
                aria-haspopup="dialog"
                data-testid="search-trigger-mobile"
                className={cn(utilityButtonClass, "flex md:hidden")}
              >
                <MagnifyingGlass
                  aria-hidden="true"
                  weight="regular"
                  size={20}
                  className="transition-transform duration-200 [transition-timing-function:var(--ease-spring)] group-hover:scale-110 group-hover:-rotate-6"
                />
              </button>
            </div>

            {/* Centre: Refined Professional MODASQUARE on all pages */}
            <div className="flex items-center justify-center min-w-0">
              <Link
                href="/"
                translate="no"
                aria-label="Modasquare Home"
                className="group justify-self-center truncate font-sans text-[14px] font-semibold uppercase tracking-[0.2em] text-[var(--color-ink)] transition-all duration-300 [transition-timing-function:var(--ease-spring)] hover:-translate-y-0.5 hover:text-[var(--color-ink-tint)] hover:tracking-[0.24em] active:translate-y-0 active:scale-95 md:text-[16px] md:tracking-[0.22em]"
              >
                Modasquare
              </Link>
            </div>

            {/* Right: Refined Cart Bag utility */}
            <div className="flex min-w-0 items-center justify-end gap-1">
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
                className={cn(utilityButtonClass, "-mr-2 shrink-0")}
              >
                <Handbag
                  aria-hidden="true"
                  weight="regular"
                  size={20}
                  className="transition-transform duration-200 [transition-timing-function:var(--ease-spring)] group-hover:-translate-y-0.5 group-hover:scale-105"
                />

                {/* Cart badge */}
                {isReady && itemCount > 0 ? (
                  <span
                    aria-hidden="true"
                    data-testid="cart-count"
                    className="numeral absolute -right-0.5 top-1 min-w-[18px] rounded-[2px] bg-[var(--color-ink)] px-1 py-px text-center text-[10px] font-medium leading-[14px] text-[var(--color-canvas)] transition-transform duration-200 [transition-timing-function:var(--ease-spring)] group-hover:scale-110 group-hover:-translate-y-0.5"
                  >
                    {formatBadgeCount(itemCount)}
                  </span>
                ) : null}
              </button>
            </div>
          </div>
        </div>
      </header>

      <SearchModal isOpen={isSearchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
