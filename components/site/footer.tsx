import Link from "next/link";
import { NewsletterForm } from "@/components/site/newsletter-form";
import { CATEGORIES } from "@/lib/catalog";

/**
 * Footer.
 *
 * Asymmetric on purpose: the sign-up holds the wide left column, the two link
 * groups sit narrow on the right. A symmetrical four-column footer would be the
 * generic answer and DESIGN.md 5 rules that out.
 */

const CLIENT_CARE = [
  { label: "Shipping and returns", href: "/women" },
  { label: "Size and fit guide", href: "/women" },
  { label: "Care instructions", href: "/women" },
  { label: "Contact the atelier", href: "/women" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--color-hairline)] bg-[var(--color-canvas)]">
      <div className="atelier-shell py-[clamp(3rem,7vw,5.5rem)]">
        <div className="grid grid-cols-1 gap-x-12 gap-y-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div>
            <h2 className="max-w-[18ch] font-display text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.1] tracking-[-0.02em] text-[var(--color-ink)]">
              Collection notices, sent once
            </h2>
            <p className="mt-3 max-w-[46ch] text-[15px] leading-relaxed text-[var(--color-muted)]">
              One message per drop, with the pieces and the dates. Nothing in between.
            </p>
            <div className="mt-6">
              <NewsletterForm />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-10 self-end">
            <nav aria-labelledby="footer-collections">
              <h3
                id="footer-collections"
                className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink)]"
              >
                Collections
              </h3>
              <ul className="mt-4 space-y-2">
                {CATEGORIES.map((category) => (
                  <li key={category.slug}>
                    <Link
                      href={`/${category.slug}`}
                      className="link-ghost text-[14px] text-[var(--color-muted)]"
                    >
                      {category.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-labelledby="footer-care">
              <h3
                id="footer-care"
                className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[var(--color-ink)]"
              >
                Client care
              </h3>
              <ul className="mt-4 space-y-2">
                {CLIENT_CARE.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="link-ghost text-[14px] text-[var(--color-muted)]"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        <div className="mt-[clamp(3rem,6vw,4.5rem)] flex flex-col gap-3 border-t border-[var(--color-hairline)] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p
            translate="no"
            className="text-[13px] font-semibold uppercase tracking-[0.2em] text-[var(--color-ink)]"
          >
            Modasquare
          </p>
          <p className="numeral text-[12px] tracking-[0.08em] text-[var(--color-muted)]">
            Interface prototype. Product photography not yet placed.
          </p>
        </div>
      </div>
    </footer>
  );
}
