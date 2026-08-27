import Link from "next/link";
import {
  ArrowUpRight,
  Clock,
  InstagramLogo,
  MapPin,
  Phone,
  WhatsappLogo,
} from "@phosphor-icons/react/dist/ssr";
import { CATEGORIES } from "@/lib/catalog";

/**
 * Footer with Flagship Location, Opening Hours, and Direct Atelier Contact.
 */

const CLIENT_CARE = [
  { label: "Shipping and returns", href: "/women" },
  { label: "Size and fit guide", href: "/women" },
  { label: "Care instructions", href: "/women" },
  { label: "Contact the atelier", href: "https://wa.me/962792290900" },
];

const SCHEDULE = [
  { day: "Thursday", hours: "10 AM – 11 PM" },
  { day: "Friday", hours: "2 PM – 11 PM" },
  { day: "Saturday", hours: "10 AM – 11 PM" },
  { day: "Sunday", hours: "10 AM – 11 PM" },
  { day: "Monday", hours: "10 AM – 11 PM" },
  { day: "Tuesday", hours: "10 AM – 11 PM" },
  { day: "Wednesday", hours: "10 AM – 11 PM" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--color-hairline)] bg-[var(--color-canvas)]">
      <div className="atelier-shell py-[clamp(3rem,7vw,5.5rem)]">
        {/* ---------------------------------------------------- Top Grid: Flagship & Schedule */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          {/* Left Column: Flagship & Direct Contact */}
          <div className="flex flex-col justify-between">
            <div>
              <h2 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.1] tracking-[-0.02em] text-[var(--color-ink)]">
                Atelier & Flagship Store
              </h2>
              <p className="mt-3 max-w-[34rem] text-[15px] leading-relaxed text-[var(--color-muted)]">
                Visit our Amman flagship atelier for tailoring consultations, collection previews, and personal fittings.
              </p>

              {/* Location Link to Google Maps */}
              <div className="mt-6">
                <a
                  href="https://maps.app.goo.gl/WbiQy5RXed3HCPn8A"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open Modasquare location on Google Maps: Wasfi At-Tall St. 347, Amman"
                  className="group inline-flex items-start gap-3 rounded-[2px] border border-[var(--color-hairline-strong)] bg-[var(--color-surface)] p-4 transition-all duration-300 [transition-timing-function:var(--ease-spring)] hover:-translate-y-0.5 hover:border-[var(--color-ink)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.06)]"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[2px] bg-[var(--color-canvas)] text-[var(--color-ink)] transition-transform duration-200 group-hover:scale-110">
                    <MapPin aria-hidden="true" weight="regular" size={18} />
                  </div>
                  <div className="min-w-0 flex-1 pr-2">
                    <span className="flex items-center gap-1.5 text-[14px] font-semibold text-[var(--color-ink)]">
                      <span>Wasfi At-Tall St. 347, Amman</span>
                      <ArrowUpRight
                        aria-hidden="true"
                        weight="bold"
                        size={14}
                        className="opacity-60 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                      />
                    </span>
                    <p className="mt-0.5 text-[12px] text-[var(--color-muted)]">
                      Open in Google Maps
                    </p>
                  </div>
                </a>
              </div>
            </div>

            {/* Direct Contact & Socials */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="https://wa.me/962792290900"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[46px] items-center justify-center gap-2.5 rounded-[2px] border border-[var(--color-ink)] bg-[var(--color-ink)] px-5 text-[13px] font-semibold uppercase tracking-[0.14em] text-[var(--color-canvas)] shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-all duration-300 [transition-timing-function:var(--ease-spring)] hover:-translate-y-0.5 hover:bg-[var(--color-ink-tint)] hover:border-[var(--color-ink-tint)] hover:shadow-[0_8px_24px_rgba(18,18,20,0.2)] active:scale-[0.985]"
              >
                <WhatsappLogo aria-hidden="true" weight="regular" size={18} />
                <span>Message on WhatsApp</span>
                <ArrowUpRight aria-hidden="true" weight="light" size={14} className="opacity-70" />
              </a>

              <a
                href="https://instagram.com/modasquarejo?utm_medium=copy_link"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-[2px] border border-[var(--color-hairline-strong)] bg-[var(--color-canvas)] px-4 text-[13px] font-semibold uppercase tracking-[0.12em] text-[var(--color-ink)] shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition-all duration-300 [transition-timing-function:var(--ease-spring)] hover:-translate-y-0.5 hover:border-[var(--color-ink)] hover:bg-[var(--color-surface)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] active:scale-[0.985]"
              >
                <InstagramLogo aria-hidden="true" weight="regular" size={18} />
                <span>Instagram</span>
                <ArrowUpRight aria-hidden="true" weight="light" size={14} className="opacity-70" />
              </a>

              <a
                href="tel:+962792290900"
                className="numeral inline-flex min-h-[46px] items-center justify-center gap-2 rounded-[2px] border border-[var(--color-hairline-strong)] bg-[var(--color-canvas)] px-4 text-[13px] tracking-[0.06em] text-[var(--color-ink)] shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition-all duration-300 [transition-timing-function:var(--ease-spring)] hover:-translate-y-0.5 hover:border-[var(--color-ink)] hover:bg-[var(--color-surface)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] active:scale-[0.985]"
              >
                <Phone aria-hidden="true" weight="regular" size={16} />
                <span>+962 7 9229 0900</span>
              </a>
            </div>
          </div>

          {/* Right Column: Opening Hours Schedule */}
          <div className="rounded-[2px] border border-[var(--color-hairline-strong)] bg-[var(--color-surface)] p-6 sm:p-7">
            <div className="flex items-center justify-between border-b border-[var(--color-hairline)] pb-4">
              <div className="flex items-center gap-2.5">
                <Clock aria-hidden="true" weight="regular" size={18} className="text-[var(--color-ink)]" />
                <h3 className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[var(--color-ink)]">
                  Store Hours
                </h3>
              </div>

              {/* Status Badge */}
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[rgba(34,197,94,0.12)] px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-[0.1em] text-[rgb(21,128,61)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[rgb(34,197,94)] animate-pulse" />
                Open now
              </span>
            </div>

            <div className="mt-4 divide-y divide-[var(--color-hairline)]">
              {SCHEDULE.map((item) => (
                <div
                  key={item.day}
                  className="flex items-center justify-between py-2.5 text-[13px]"
                >
                  <span className="font-medium text-[var(--color-ink)]">
                    {item.day}
                  </span>
                  <span className="numeral text-[var(--color-muted)]">
                    {item.hours}
                  </span>
                </div>
              ))}
            </div>
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
                    {item.href.startsWith("http") ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-ghost text-[13px] text-[var(--color-muted)] transition-colors hover:text-[var(--color-ink)]"
                      >
                        {item.label}
                      </a>
                    ) : (
                      <Link
                        href={item.href}
                        className="link-ghost text-[13px] text-[var(--color-muted)] transition-colors hover:text-[var(--color-ink)]"
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="mt-8 flex flex-col gap-2 border-t border-[var(--color-hairline)] pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="numeral text-[11px] tracking-[0.06em] text-[var(--color-muted)]">
              Wasfi At-Tall St. 347, Amman, Jordan &bull; +962 7 9229 0900
            </p>
            <p className="numeral text-[11px] tracking-[0.06em] text-[var(--color-muted)]">
              &copy; {new Date().getFullYear()} Modasquare. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
