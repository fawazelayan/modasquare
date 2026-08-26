import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Geist, Geist_Mono } from "next/font/google";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { CartProvider } from "@/components/cart/cart-provider";
import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import "./globals.css";

/**
 * Fonts are self-hosted through next/font, which inlines the face declarations
 * and preloads the files from our own origin. No render-blocking request to a
 * third-party font host, and no flash of fallback metrics.
 *
 * DESIGN.md offers three display serifs. Cormorant Garamond is the one taken:
 * the taste skill rules out Fraunces outright, and Editorial New is not openly
 * licensed. Body and metadata follow the Geist pairing named in the same table.
 */
const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const sans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://modasquare.example"),
  title: {
    default: "Modasquare",
    // Every route sets its own title, so the tab always names the current view.
    template: "%s | Modasquare",
  },
  description:
    "Structured outerwear, column tailoring and heavyweight jersey, cut for volume and made in small runs.",
  openGraph: {
    title: "Modasquare",
    description:
      "Structured outerwear, column tailoring and heavyweight jersey, cut for volume and made in small runs.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Zoom is deliberately left unrestricted.
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbf9f5" },
    { media: "(prefers-color-scheme: dark)", color: "#121214" },
  ],
};

export default function RootLayout({ children }: { readonly children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body>
        <CartProvider>
          <a
            href="#main"
            className={
              "sr-only rounded-[2px] focus:not-sr-only focus:fixed focus:left-4 focus:top-4 " +
              "focus:z-[80] focus:inline-flex focus:min-h-[44px] focus:items-center " +
              "focus:border focus:border-[var(--color-ink)] focus:bg-[var(--color-canvas)] " +
              "focus:px-4 focus:text-[13px] focus:font-semibold focus:uppercase " +
              "focus:tracking-[0.12em] focus:text-[var(--color-ink)]"
            }
          >
            Skip to content
          </a>

          <SiteHeader />

          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>

          <SiteFooter />

          {/* One drawer instance for the whole app, so any route can open it. */}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
