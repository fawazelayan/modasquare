"use client";

import { Minus, Plus } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/cn";

/**
 * Quantity control.
 *
 * Two real buttons rather than a number input: on a touch keyboard a numeric
 * field is a worse target than a pair of 44px controls, and there is no free
 * text to validate. The live count is announced politely so a screen-reader user
 * hears the new value without the focus moving.
 */
export function QuantityStepper({
  value,
  min = 1,
  max = 10,
  label,
  onChange,
  className,
  testId,
}: {
  readonly value: number;
  readonly min?: number;
  readonly max?: number;
  /** Name of the thing being counted, folded into each control's label. */
  readonly label: string;
  readonly onChange: (next: number) => void;
  readonly className?: string;
  readonly testId?: string;
}) {
  const canDecrease = value > min;
  const canIncrease = value < max;

  const control =
    "flex h-full min-h-11 w-11 shrink-0 items-center justify-center text-[var(--color-muted)] " +
    "transition-[color,background-color] duration-200 [transition-timing-function:var(--ease-quiet)] " +
    "hover:bg-[var(--color-wireframe)] hover:text-[var(--color-ink)] " +
    "disabled:cursor-not-allowed disabled:text-[var(--color-muted)] disabled:opacity-45 " +
    "disabled:hover:bg-transparent";

  return (
    <div
      className={cn(
        "inline-flex items-stretch rounded-[2px] border border-[var(--color-hairline-strong)]",
        className,
      )}
      data-testid={testId}
    >
      <button
        type="button"
        className={control}
        onClick={() => onChange(value - 1)}
        disabled={!canDecrease}
        aria-label={`Decrease quantity of ${label}`}
        data-testid={testId ? `${testId}-decrease` : undefined}
      >
        <Minus aria-hidden="true" weight="light" size={14} />
      </button>

      <span
        aria-live="polite"
        aria-atomic="true"
        className="numeral flex min-w-[2.5rem] items-center justify-center text-center text-[14px] text-[var(--color-ink)]"
        data-testid={testId ? `${testId}-value` : undefined}
      >
        <span className="sr-only">{`Quantity of ${label}: `}</span>
        {value}
      </span>

      <button
        type="button"
        className={control}
        onClick={() => onChange(value + 1)}
        disabled={!canIncrease}
        aria-label={`Increase quantity of ${label}`}
        data-testid={testId ? `${testId}-increase` : undefined}
      >
        <Plus aria-hidden="true" weight="light" size={14} />
      </button>
    </div>
  );
}
