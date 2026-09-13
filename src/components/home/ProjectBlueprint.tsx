/**
 * The builder's answer: a live blueprint of the visitor's project, drawn in
 * THE WINDOW as they describe it.
 *
 * This is the one window on the page that shows something that does not exist
 * yet, so it is drawn as exactly that — a schematic on a drafting grid, dashed
 * outlines and solid blocks, never a pretend finished website. Every module it
 * adds is labelled with the visitor's OWN choice (the real `t.contact.form`
 * strings they just clicked); nothing it draws is a promise about scope, time or
 * price.
 *
 *   project type  → the page skeleton (site / shop / app / redesign / unsure)
 *   features      → modules added to it (payments, booking, languages, …)
 *   budget        → pinned to the footer as the visitor's own label
 *   definition    → how "assembled" the whole drawing is (0 = loose parts)
 */
import { motion } from "framer-motion";
import { EASE } from "@/components/cinematic";

type Props = {
  type: number | null;
  features: number[];
  featureLabels: readonly string[];
  budgetLabel: string | null;
  definition: number;
  reduced: boolean;
};

const line = "border border-dashed border-[oklch(0.72_0.16_250/0.7)]";
const solid = "bg-[oklch(0.72_0.16_250/0.2)]";
const ink = "bg-white/45";

export function ProjectBlueprint({
  type,
  features,
  featureLabels,
  budgetLabel,
  definition,
  reduced,
}: Props) {
  const has = (i: number) => features.includes(i);
  const t = type ?? 4;
  const pop = (on: boolean, delay = 0) => ({
    initial: false as const,
    animate: on ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.94, y: 6 },
    transition: { duration: reduced ? 0 : 0.55, delay: reduced ? 0 : delay, ease: EASE },
  });
  // `right` anchors a tag to its module's right edge and lets it run left: the
  // language switch is two small pills, and a left-anchored, width-capped tag
  // truncated "Vícejazyčnost" to "V…".
  const tag = (label: string, anchor: "left" | "right" = "left") => (
    <span
      className={`absolute -top-[1.5cqw] z-10 ${anchor === "right" ? "right-0 whitespace-nowrap" : "left-[1cqw] max-w-[calc(100%-2cqw)] truncate"} rounded-[0.4cqw] bg-primary px-[1cqw] py-[0.45cqw] text-[1.7cqw] leading-none font-medium text-white shadow-[0_0.6cqw_1.6cqw_-0.6cqw_oklch(0.65_0.18_255/0.9)]`}
    >
      {label}
    </span>
  );
  const bars = (n: number, w = ["80%", "64%", "72%"]) => (
    <div className="space-y-[0.7cqw]">
      {Array.from({ length: n }, (_, k) => (
        <div
          key={k}
          className={`h-[0.7cqw] rounded-full ${ink}`}
          style={{ width: w[k % w.length] }}
        />
      ))}
    </div>
  );

  // Loose parts drift apart while nothing is defined, and settle as it is.
  const loose = (1 - definition) * (reduced ? 0 : 1);

  return (
    <div
      aria-hidden
      className="relative aspect-[16/11] overflow-hidden bg-[radial-gradient(80%_70%_at_50%_40%,#12203d,#0a1020_75%)] [container-type:inline-size]"
      style={{
        backgroundImage:
          "linear-gradient(oklch(0.72 0.16 250 / 0.07) 1px, transparent 1px), linear-gradient(90deg, oklch(0.72 0.16 250 / 0.07) 1px, transparent 1px)",
        backgroundSize: "2.5cqw 2.5cqw",
      }}
    >
      <motion.div
        animate={{ opacity: 0.78 + definition * 0.22 }}
        transition={{ duration: reduced ? 0 : 0.8, ease: EASE }}
        className="absolute inset-[3cqw] flex flex-col gap-[1.8cqw]"
      >
        {/* Nav — every project has one. Languages add their switch to it. */}
        <motion.div
          animate={{ x: loose * -14, rotate: loose * -1.2 }}
          transition={{ duration: reduced ? 0 : 0.9, ease: EASE }}
          className={`relative flex h-[5cqw] shrink-0 items-center justify-between rounded-[0.8cqw] px-[1.6cqw] ${line}`}
        >
          <div className={`h-[1.4cqw] w-[9cqw] rounded-full ${ink}`} />
          <div className="flex items-center gap-[1.4cqw]">
            {t === 1 && <div className={`h-[2.4cqw] w-[14cqw] rounded-full ${line}`} />}
            {[0, 1, 2].map((k) => (
              <div key={k} className={`h-[0.8cqw] w-[5cqw] rounded-full ${ink} opacity-70`} />
            ))}
            <motion.div {...pop(has(2))} className="relative flex gap-[0.5cqw]">
              {has(2) && tag(featureLabels[2], "right")}
              {["CZ", "EN"].map((l) => (
                <span
                  key={l}
                  className={`rounded-[0.4cqw] px-[0.6cqw] py-[0.2cqw] font-mono text-[1.1cqw] text-white/70 ${line}`}
                >
                  {l}
                </span>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Body by project type. */}
        <div className="relative flex min-h-0 flex-1 gap-[1.8cqw]">
          {t === 2 && (
            <motion.div
              animate={{ x: loose * -18 }}
              transition={{ duration: reduced ? 0 : 0.9, ease: EASE }}
              className={`w-[16%] shrink-0 space-y-[1.2cqw] rounded-[0.8cqw] p-[1.4cqw] ${line}`}
            >
              {bars(6, ["90%", "70%", "80%"])}
            </motion.div>
          )}

          <div className="flex min-w-0 flex-1 flex-col gap-[1.8cqw]">
            {/* Hero / heading block */}
            <motion.div
              animate={{ y: loose * -10, rotate: loose * 0.8 }}
              transition={{ duration: reduced ? 0 : 0.9, ease: EASE }}
              className={`relative flex shrink-0 items-center gap-[2cqw] rounded-[0.8cqw] p-[2cqw] ${line} ${
                t === 1 || t === 2 ? "h-[9cqw]" : "h-[15cqw]"
              }`}
            >
              <div className="flex-1 space-y-[1cqw]">
                <div className={`h-[2cqw] w-[70%] rounded-full ${ink}`} />
                {t !== 2 && <div className={`h-[2cqw] w-[48%] rounded-full ${ink}`} />}
                {bars(2)}
                {t !== 2 && (
                  <div className="mt-[0.6cqw] h-[2.6cqw] w-[12cqw] rounded-[0.6cqw] bg-primary/80" />
                )}
              </div>
              {(t === 0 || t === 3) && (
                <div className={`h-full w-[36%] rounded-[0.6cqw] ${solid}`} />
              )}
            </motion.div>

            {/* Content grid */}
            <motion.div
              animate={{ y: loose * 12, rotate: loose * -0.6 }}
              transition={{ duration: reduced ? 0 : 0.9, ease: EASE }}
              className={`grid min-h-0 flex-1 gap-[1.6cqw] ${t === 1 ? "grid-cols-4" : "grid-cols-3"}`}
            >
              {Array.from({ length: t === 1 ? 8 : 3 }, (_, k) => (
                <div
                  key={k}
                  className={`flex flex-col gap-[0.8cqw] rounded-[0.8cqw] p-[1.2cqw] ${line}`}
                >
                  <div className={`min-h-[3cqw] flex-1 rounded-[0.5cqw] ${solid}`} />
                  {bars(t === 1 ? 1 : 2)}
                  {t === 1 && <div className="h-[1.6cqw] w-[45%] rounded-full bg-primary/60" />}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Feature modules, docked on the right as they are chosen. */}
          <div
            className={`w-[26%] shrink-0 flex-col gap-[1.8cqw] ${[0, 1, 3, 4].some(has) ? "flex" : "hidden"}`}
          >
            <motion.div
              {...pop(has(0))}
              className={`relative rounded-[0.8cqw] p-[1.4cqw] ${line} ${has(0) ? "" : "hidden"}`}
            >
              {has(0) && tag(featureLabels[0])}
              <div className="mt-[0.8cqw] h-[4.6cqw] rounded-[0.6cqw] bg-[linear-gradient(120deg,oklch(0.65_0.18_255/0.55),oklch(0.72_0.16_250/0.15))]" />
              <div className="mt-[1cqw] h-[2cqw] rounded-[0.5cqw] bg-primary/70" />
            </motion.div>
            <motion.div
              {...pop(has(1), 0.05)}
              className={`relative rounded-[0.8cqw] p-[1.4cqw] ${line} ${has(1) ? "" : "hidden"}`}
            >
              {has(1) && tag(featureLabels[1])}
              <div className="mt-[0.8cqw] grid grid-cols-7 gap-[0.5cqw]">
                {Array.from({ length: 21 }, (_, k) => (
                  <div
                    key={k}
                    className={`aspect-square rounded-[0.3cqw] ${k === 9 ? "bg-primary" : solid}`}
                  />
                ))}
              </div>
            </motion.div>
            <motion.div
              {...pop(has(3), 0.1)}
              className={`relative rounded-[0.8cqw] p-[1.4cqw] ${line} ${has(3) ? "" : "hidden"}`}
            >
              {has(3) && tag(featureLabels[3])}
              <div className="mt-[0.8cqw] space-y-[1cqw]">
                {[0, 1].map((k) => (
                  <div key={k} className="flex gap-[1cqw]">
                    <div className={`size-[4cqw] shrink-0 rounded-[0.5cqw] ${solid}`} />
                    <div className="flex-1">{bars(2)}</div>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div
              {...pop(has(4), 0.15)}
              className={`relative flex items-center gap-[1cqw] rounded-[0.8cqw] p-[1.4cqw] ${line} ${has(4) ? "" : "hidden"}`}
            >
              {has(4) && tag(featureLabels[4])}
              <div className="mt-[0.6cqw] size-[2.4cqw] rounded-full bg-primary/80" />
              <div className="mt-[0.6cqw] h-px flex-1 border-t border-dashed border-primary/70" />
              <div className={`mt-[0.6cqw] h-[3.4cqw] w-[5cqw] rounded-[0.5cqw] ${solid}`} />
            </motion.div>
          </div>
        </div>

        {/* Footer — the budget the visitor chose, pinned where a spec sheet
            would carry it. */}
        <div
          className={`relative flex h-[4cqw] shrink-0 items-center justify-between rounded-[0.8cqw] px-[1.6cqw] ${line}`}
        >
          <div className="flex gap-[1.2cqw]">
            {[0, 1, 2].map((k) => (
              <div key={k} className={`h-[0.8cqw] w-[6cqw] rounded-full ${ink} opacity-60`} />
            ))}
          </div>
          <motion.span
            {...pop(budgetLabel !== null)}
            className="rounded-[0.4cqw] border border-primary/60 bg-primary/15 px-[1cqw] py-[0.4cqw] text-[1.6cqw] leading-none font-medium text-white tabular-nums"
          >
            {budgetLabel}
          </motion.span>
        </div>
      </motion.div>

      {/* Mobile app — a phone joins the drawing. */}
      <motion.div
        {...pop(has(5), 0.1)}
        className={`absolute right-[30%] bottom-[6cqw] aspect-[1/2] w-[14%] rounded-[1.6cqw] bg-[#0a1020] p-[0.9cqw] ${line}`}
      >
        {has(5) && tag(featureLabels[5])}
        <div className={`h-full w-full space-y-[0.9cqw] rounded-[1cqw] p-[1cqw] ${solid}`}>
          <div className={`h-[5cqw] rounded-[0.5cqw] ${solid}`} />
          {bars(3)}
          <div className="h-[2cqw] rounded-[0.5cqw] bg-primary/70" />
        </div>
      </motion.div>
    </div>
  );
}

export default ProjectBlueprint;
