import Link from "next/link";
import { ArrowUpRight, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import { CATEGORIES } from "@/lib/catalog";

/**
 * Footer with direct WhatsApp Atelier contact.
 */

const CLIENT_CARE = [
  { label: "Shipping and returns", href: "/women" },
  { label: "Size and fit guide", href: "/women" },
  { label: "Care instructions", href: "/women" },
  { label: "Contact the atelier", href: "https://wa.me/962792290900" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--color-hairline)] bg-[var(--color-canvas)]">
      <div className="atelier-shell py-[clamp(3rem,7vw,5.5rem)]">
        {/* ---------------------------------------------------- Contact the Atelier */}
        <div className="max-w-[36rem]">
          <h2 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.1] tracking-[-0.02em] text-[var(--color-ink)]">
            Contact the atelier
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-[var(--color-muted)]">
            Direct inquiries, tailoring consultations and sizing guidance via WhatsApp.
          </p>
          <div className="mt-6">
            <a
              href="https://wa.me/962792290900"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[48px] items-center justify-center gap-2.5 rounded-[2px] border border-[var(--color-ink)] bg-[var(--color-ink)] px-6 text-[13px] font-semibold uppercase tracking-[0.14em] text-[var(--color-canvas)] transition-[background-color,transform] duration-200 hover:bg-[var(--color-ink-tint)] active:scale-[0.985]"
            >
              <WhatsappLogo aria-hidden="true" weight="regular" size={18} />
              <span>Message on WhatsApp</span>
              <ArrowUpRight aria-hidden="true" weight="light" size={15} className="opacity-70" />
            </a>
            <p className="numeral mt-2 text-[12px] tracking-[0.06em] text-[var(--color-muted)]">
              +962 7 9229 0900
            </p>
          </div>
        </div>

        {/* ---------------------------------------------------- Bottom: MODASQUARE + Collections & Client Care */}
        <div className="mt-[clamp(3rem,6vw,4.5rem)] border-t border-[var(--color-hairline)] pt-8">
          <p
            translate="no"
            className="text-[14px] font-semibold uppercase tracking-[0.2em] text-[var(--color-ink)]"
          >
            Modasquare
          </p>

          <div className="mt-6 grid grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4">
            <nav aria-labelledby="footer-collections">
              <h3
                id="footer-collections"
                className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-ink)]"
              >
                Collections
              </h3>
              <ul className="mt-3 space-y-2">
                {CATEGORIES.map((category) => (
                  <li key={category.slug}>
                    <Link
                      href={`/${category.slug}`}
                      className="link-ghost text-[13px] text-[var(--color-muted)] transition-colors hover:text-[var(--color-ink)]"
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
                className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-ink)]"
              >
                Client care
              </h3>
              <ul className="mt-3 space-y-2">
                {CLIENT_CARE.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="link-ghost text-[13px] text-[var(--color-muted)] transition-colors hover:text-[var(--color-ink)]"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="mt-8 border-t border-[var(--color-hairline)] pt-4">
            <p className="numeral text-[11px] tracking-[0.06em] text-[var(--color-muted)]">
              Interface prototype. Product photography not yet placed.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
