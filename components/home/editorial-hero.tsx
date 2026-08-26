import { ButtonLink } from "@/components/ui/button";
import { Frame } from "@/components/ui/frame";

/**
 * Editorial hero.
 *
 * Asymmetric split rather than a centred stack, which is what DESIGN_VARIANCE 8
 * calls for. Four text elements at most: eyebrow, headline, one line of subtext,
 * two calls to action. Nothing else lives up here.
 *
 * Entry motion runs off the CSS cascade with a per-element index, so the hero
 * animates on first paint without shipping a scroll observer for content that is
 * already in view.
 */
export function EditorialHero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative border-b border-[var(--color-hairline)]"
    >
      <div className="atelier-shell">
        <div
          className={
            "grid grid-cols-1 items-center gap-x-16 gap-y-12 pb-16 pt-12 " +
            "lg:min-h-[calc(100dvh-var(--header-height))] " +
            "lg:grid-cols-[minmax(0,1fr)_minmax(0,0.68fr)] lg:pb-20 lg:pt-20"
          }
        >
          {/* ------------------------------------------------------- copy */}
          <div className="max-w-[42rem]">
            <p className="eyebrow reveal" style={{ ["--reveal-index" as string]: 0 }}>
              Atelier Series 04
            </p>

            <h1
              id="hero-title"
              className="reveal mt-5 font-display text-[length:var(--text-display)] font-light leading-[1.05] tracking-[-0.03em] text-[var(--color-ink)]"
              style={{ ["--reveal-index" as string]: 1 }}
            >
              Cut wide,{" "}
              {/* Emphasis stays inside the same family. The italic carries extra
                  line-height and bottom reserve so the descender is never cut. */}
              <em className="block pb-1 font-display italic leading-[1.1] text-[var(--color-ink)]">
                built to hold
              </em>
            </h1>

            <p
              className="reveal mt-6 max-w-[46ch] text-[17px] leading-[1.7] text-[var(--color-muted)]"
              style={{ ["--reveal-index" as string]: 2 }}
            >
              Outerwear, tailoring and heavy jersey from the fourth Atelier series, made in
              small runs.
            </p>

            <div
              className="reveal mt-9 flex flex-wrap items-center gap-3"
              style={{ ["--reveal-index" as string]: 3 }}
            >
              <ButtonLink href="/women" variant="primary" size="lg">
                Shop the collection
              </ButtonLink>
              <ButtonLink href="#featured-drop" variant="secondary" size="lg">
                See the drop
              </ButtonLink>
            </div>
          </div>

          {/* ------------------------------------------------------ frames */}
          {/* Staggered pair: a tall plate with a square detail dropped below and
              pulled left, so the column never reads as a single centred block. */}
          <div
            className="reveal relative lg:pl-10"
            style={{ ["--reveal-index" as string]: 4 }}
          >
            <div className="ml-auto w-[86%] lg:w-full">
              <Frame ratio="3:4" label="Look 01" note="Anvers bomber" pitch={44} />
            </div>

            {/* Pulled up and left so the pair overlaps rather than stacking.
                The negative top margin is what keeps the whole composition
                inside the first screen at desktop. */}
            <div className="relative -mt-16 w-[46%] sm:w-[38%] lg:-ml-14 lg:-mt-28 lg:w-[46%]">
              <Frame ratio="1:1" label="Bonded canvas" note="Fabric" tone="raised" pitch={26} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
