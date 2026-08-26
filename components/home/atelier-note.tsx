import { Frame } from "@/components/ui/frame";
import { Reveal } from "@/components/ui/reveal";

/**
 * Atelier note.
 *
 * Not another text-beside-image split. The statement is pushed off the left
 * edge into the right two thirds, leaving a deliberate empty zone, and the
 * detail plates run underneath as a staggered band at three different vertical
 * offsets. That vertical stagger is the lookbook device named in DESIGN.md 1.
 */

const PLATES = [
  { label: "Bar tack", note: "Stitch detail", ratio: "3:4" as const, offset: "lg:mt-0", pitch: 34 },
  { label: "Selvedge", note: "Fabric edge", ratio: "4:5" as const, offset: "lg:mt-24", pitch: 30 },
  { label: "Two-part cuff", note: "Hardware", ratio: "1:1" as const, offset: "lg:mt-10", pitch: 38 },
];

export function AtelierNote() {
  return (
    <section aria-labelledby="atelier-note-title" className="atelier-shell atelier-section">
      <Reveal className="lg:pl-[32%]">
        <h2
          id="atelier-note-title"
          className="max-w-[24ch] font-display text-[length:var(--text-h1)] font-light leading-[1.1] tracking-[-0.02em] text-[var(--color-ink)]"
        >
          Cut, sewn and finished in one building
        </h2>
        <p className="mt-5 max-w-[58ch] text-[16px] leading-[1.75] text-[var(--color-muted)]">
          Patterns are graded on the floor where the garments are made, so a change to a
          shoulder or a hem is tested the same week it is drawn. Runs stay small because the
          table only holds so much.
        </p>
      </Reveal>

      <div className="mt-16 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-3 lg:gap-x-10">
        {PLATES.map((plate, index) => (
          <Reveal
            key={plate.label}
            index={index}
            className={index === 2 ? `col-span-2 lg:col-span-1 ${plate.offset}` : plate.offset}
          >
            {/* The frame already names itself, so there is no caption under it. */}
            <Frame ratio={plate.ratio} label={plate.label} note={plate.note} pitch={plate.pitch} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
