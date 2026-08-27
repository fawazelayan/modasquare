"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  CaretDown,
  CaretLeft,
  CaretRight,
  List,
} from "@phosphor-icons/react/dist/ssr";
import { DEPARTMENTS, type CategorySlug } from "@/lib/catalog";
import { cn } from "@/lib/cn";

interface DepartmentDroplistProps {
  readonly className?: string;
}

export function openDepartmentMenu() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("modasquare:open-menu"));
  }
}

export function DepartmentDroplist({ className }: DepartmentDroplistProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Track which tree branch is expanded (null = all collapsed by default)
  const [expandedDept, setExpandedDept] = useState<CategorySlug | null>(null);

  const reduceMotion = useReducedMotion();
  const menuId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Listen for open menu events from anywhere in the app
  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
    };
    window.addEventListener("modasquare:open-menu", handleOpen);
    return () => {
      window.removeEventListener("modasquare:open-menu", handleOpen);
    };
  }, []);

  // Reset to all collapsed whenever menu is closed
  useEffect(() => {
    if (!isOpen) {
      setExpandedDept(null);
    }
  }, [isOpen]);

  // Handle outside clicks and Escape key
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [isOpen]);

  const toggleDept = (slug: CategorySlug) => {
    setExpandedDept((prev) => (prev === slug ? null : slug));
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={cn("relative inline-flex items-center", className)}>
      {/* ---------------------------------------------------- 3-Lines Button (Bolder, Bigger, No text) */}
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={isOpen}
        aria-controls={menuId}
        aria-haspopup="dialog"
        aria-label="Open menu"
        onClick={() => setIsOpen((prev) => !prev)}
        data-testid="departments-trigger"
        className={cn(
          "relative flex h-11 w-11 items-center justify-center rounded-[2px] text-[var(--color-ink)]",
          "transition-transform duration-150 active:scale-95",
          isOpen && "text-[var(--color-ink)]",
        )}
      >
        <List aria-hidden="true" weight="bold" size={26} />
      </button>

      {/* ---------------------------------------------------- Pure Tree Structure Pop-up Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={menuId}
            role="region"
            aria-label="Departments menu"
            tabIndex={-1}
            data-testid="departments-droplist-panel"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 4, scale: 0.98 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "absolute left-0 top-full z-[60] mt-1 w-[calc(100vw-2rem)] max-w-[20rem] rounded-[2px]",
              "border border-[var(--color-hairline-strong)] bg-[var(--color-canvas)] p-4 sm:p-5 shadow-[0_12px_28px_rgba(0,0,0,0.08)] outline-none",
              "sm:w-[22rem] sm:max-w-none",
            )}
          >
            {/* ------------------------------------------- Pure Tree Structure (No box borders, No < or collections header) */}
            <div className="relative pl-2 pt-1">
              {/* Main Vertical Tree Line */}
              <div
                aria-hidden="true"
                className="absolute bottom-3 left-2 top-2 w-px bg-[var(--color-hairline-strong)]"
              />

              <div className="space-y-3">
                {DEPARTMENTS.map((dept) => {
                  const isExpanded = expandedDept === dept.slug;

                  return (
                    <div key={dept.slug} className="relative pl-4">
                      {/* Horizontal Branch Connector for Department */}
                      <div
                        aria-hidden="true"
                        className="absolute -left-[1px] top-3.5 h-px w-3 bg-[var(--color-hairline-strong)]"
                      />

                      {/* Department Root Row: Title + Expand Caret + VIEW ALL Link */}
                      <div className="flex items-center justify-between gap-3 py-0.5">
                        <button
                          type="button"
                          onClick={() => toggleDept(dept.slug)}
                          aria-expanded={isExpanded}
                          data-testid={`dept-tab-${dept.slug}`}
                          className="group flex flex-1 items-center gap-1.5 text-left"
                        >
                          <span className="font-sans text-[13px] font-semibold uppercase tracking-[0.16em] text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-ink)]">
                            {dept.label}
                          </span>

                          <span className="flex items-center text-[var(--color-muted)] transition-transform duration-200 group-hover:text-[var(--color-ink)]">
                            {isExpanded ? (
                              <CaretDown size={12} weight="regular" />
                            ) : (
                              <CaretRight size={12} weight="regular" />
                            )}
                          </span>
                        </button>

                        <Link
                          href={`/${dept.slug}`}
                          onClick={handleClose}
                          className="shrink-0 text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--color-muted)] transition-colors hover:text-[var(--color-ink)] underline underline-offset-4 decoration-[var(--color-hairline-strong)] hover:decoration-current"
                        >
                          View All
                        </Link>
                      </div>

                      {/* Expanded Subcategories (Child Tree) */}
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
                            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, height: "auto" }}
                            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
                            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="relative mb-1 ml-1 mt-1 pl-3">
                              {/* Subcategory Vertical Tree Line */}
                              <div
                                aria-hidden="true"
                                className="absolute bottom-2 left-0 top-1 w-px bg-[var(--color-hairline)]"
                              />

                              <ul className="space-y-0.5 py-0.5">
                                {dept.subcategories
                                  .filter((sub) => sub.slug !== "all")
                                  .map((sub) => {
                                    const href = sub.query
                                      ? `/${dept.slug}?${sub.query}`
                                      : `/${dept.slug}`;

                                    return (
                                      <li key={sub.slug} className="relative pl-2.5">
                                        {/* Subcategory Horizontal Connector Line */}
                                        <div
                                          aria-hidden="true"
                                          className="absolute -left-1 top-1/2 h-px w-2 bg-[var(--color-hairline)]"
                                        />

                                        <Link
                                          href={href}
                                          onClick={handleClose}
                                          data-testid={`sublink-${dept.slug}-${sub.slug}`}
                                          className="group flex min-h-[30px] items-center py-0.5 text-[12px] text-[var(--color-muted)] transition-colors hover:text-[var(--color-ink)] hover:translate-x-0.5 duration-150"
                                        >
                                          <span>
                                            {sub.label}
                                          </span>
                                        </Link>
                                      </li>
                                    );
                                  })}
                              </ul>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
