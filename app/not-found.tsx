import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { Frame } from "@/components/ui/frame";
import { CATEGORIES } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Page not found",
};

/**
 * Not found.
 *
 * Every route that can fail resolves here, so it has to offer a way onward
 * rather than an apology. Three collections and the homepage are one tap away.
 */
export default function NotFound() {
  return (
    <section className="atelier-shell grid grid-cols-1 items-center gap-12 py-[clamp(4rem,10vw,8rem)] lg:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] lg:gap-20">
      <Frame ratio="4:5" label="Not found" pitch={34} />

      <div className="max-w-[46ch]">
        <h1 className="font-display text-[length:var(--text-h1)] font-light leading-[1.08] tracking-[-0.02em] text-[var(--color-ink)]">
          This page has been taken down
        </h1>
        <p className="mt-4 text-[16px] leading-[1.75] text-[var(--color-muted)]">
          The address no longer points at anything. It may have been a piece from a closed
          run, or the link may have been mistyped.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <ButtonLink href="/" variant="primary" size="lg">
            Back to the homepage
          </ButtonLink>
        </div>

        <div className="mt-8 border-t border-[var(--color-hairline)] pt-5">
          <p className="text-[13px] uppercase tracking-[0.12em] text-[var(--color-muted)]">
            Or open a collection
          </p>
          <ul className="mt-3 flex flex-wrap gap-x-8 gap-y-2">
            {CATEGORIES.map((category) => (
              <li key={category.slug}>
                <Link
                  href={`/${category.slug}`}
                  className="link-ghost font-display text-[24px] leading-tight text-[var(--color-ink)]"
                >
                  {category.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
