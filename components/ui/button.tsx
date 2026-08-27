import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Button and link surfaces, transcribed from DESIGN.md 4.
 *
 * Sharp architectural geometry (2px maximum), zero elevation, uppercase 13px
 * label at 0.12em. Contrast is checked in both directions: obsidian fill takes
 * alabaster type, hairline outline takes ink type and inverts on hover.
 */

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-[2px] font-sans font-semibold uppercase " +
  "whitespace-nowrap cursor-pointer " +
  "transition-[background-color,color,border-color,transform,box-shadow,letter-spacing] duration-300 " +
  "[transition-timing-function:var(--ease-spring)] " +
  "hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.985] " +
  "disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:shadow-none disabled:active:scale-100";

const VARIANT: Record<Variant, string> = {
  primary:
    "bg-[var(--color-ink)] text-[var(--color-canvas)] border border-[var(--color-ink)] shadow-[0_2px_8px_rgba(0,0,0,0.08)] " +
    "hover:bg-[var(--color-ink-tint)] hover:border-[var(--color-ink-tint)] hover:shadow-[0_8px_24px_rgba(18,18,20,0.2)] hover:tracking-[0.15em]",
  secondary:
    "bg-transparent text-[var(--color-ink)] border border-[var(--color-ink)] shadow-[0_1px_4px_rgba(0,0,0,0.04)] " +
    "hover:bg-[var(--color-ink)] hover:text-[var(--color-canvas)] hover:shadow-[0_6px_20px_rgba(18,18,20,0.12)] hover:tracking-[0.15em]",
  ghost:
    "bg-transparent text-[var(--color-muted)] border border-transparent " +
    "hover:text-[var(--color-ink)] hover:bg-[var(--color-surface)] hover:border-[var(--color-hairline-strong)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)]",
};

/* Minimum 44px tall so the target clears the mobile guidance in AGENTS.md. */
const SIZE: Record<Size, string> = {
  md: "min-h-[44px] px-5 text-[13px] tracking-[0.12em]",
  lg: "min-h-[52px] px-7 text-[13px] tracking-[0.14em]",
};

export interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  readonly variant?: Variant;
  readonly size?: Size;
  readonly fullWidth?: boolean;
  readonly children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  fullWidth,
  className,
  type = "button",
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(BASE, VARIANT[variant], SIZE[size], fullWidth && "w-full", className)}
      {...rest}
    >
      {children}
    </button>
  );
}

export interface ButtonLinkProps extends ComponentPropsWithoutRef<typeof Link> {
  readonly variant?: Variant;
  readonly size?: Size;
  readonly fullWidth?: boolean;
  readonly children: ReactNode;
}

/**
 * Navigation always renders as an anchor so middle-click and Cmd-click keep
 * working, per the AGENTS.md navigation rule.
 */
export function ButtonLink({
  variant = "primary",
  size = "md",
  fullWidth,
  className,
  children,
  ...rest
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(BASE, VARIANT[variant], SIZE[size], fullWidth && "w-full", className)}
      {...rest}
    >
      {children}
    </Link>
  );
}
