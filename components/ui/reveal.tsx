import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Scroll reveal, DESIGN.md 6: staggered opacity plus a small rise.
 *
 * This is a Server Component and ships no JavaScript. The animation is a CSS
 * scroll-driven one (`animation-timeline: view()`), which matters for more than
 * bundle size: the first version used Motion's `whileInView`, and Motion writes
 * its `initial` state into the server HTML as `style="opacity:0"`. That means
 * four sections of this site were one failed JS request away from being
 * invisible, with the markup itself telling the browser to hide them.
 *
 * Here the element is opaque in the HTML. The reveal is layered on top by CSS,
 * and falls away cleanly in three directions: browsers without scroll-driven
 * animation skip it at the `@supports` gate, `prefers-reduced-motion` skips it
 * at the media query, and an inactive timeline (a page too short to scroll)
 * leaves the animation with no effect. Every one of those paths lands on
 * readable content.
 */
export function Reveal({
  children,
  index = 0,
  className,
  as: Component = "div",
}: {
  readonly children: ReactNode;
  /** Offsets the animation range so items in a row do not resolve in lockstep. */
  readonly index?: number;
  readonly className?: string;
  readonly as?: Extract<ElementType, "div" | "li" | "section" | "article">;
}) {
  return (
    <Component
      className={cn("reveal-in-view", className)}
      style={{ ["--reveal-index" as string]: Math.min(index, 6) }}
    >
      {children}
    </Component>
  );
}
