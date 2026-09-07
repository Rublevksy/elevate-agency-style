/**
 * Project builder — the page's one interactive beat.
 *
 * Everything before this section is a camera the visitor drives but cannot
 * change. Here the world answers back: every choice re-lights the scene and
 * swaps the room behind it, so describing a project is itself the last shot of
 * the film rather than a form bolted to the end of it.
 *
 * WHY IT IS NOT SCROLL-DRIVEN. The hero, the services room and the case reels
 * are all cut against the master timeline, and a fourth pinned act would make
 * the page read as one trick repeated. The brief's sequence puts INTERACTION as
 * its own beat, and a form whose steps advance on scroll is a worse form: it
 * takes control away exactly where the visitor most needs it. So this section
 * uses the act only for its ARRIVAL — it picks up the move the cases were
 * making — and hands the rest to the pointer and the keyboard.
 *
 * WHAT IS REUSED, DELIBERATELY:
 *
 *   - Every string comes from `t.form.*`, which already exists in CZ/EN/RU/UA
 *     because the /contact stepper uses it. No key was added and no copy was
 *     written for this section.
 *   - The submit payload is byte-for-byte the shape `Contact.tsx` sends:
 *     name / email / phone / service / budget / message, with the optional
 *     answers serialised into the tail of `message`. `telegram.functions.ts` is
 *     a protected system and its contract is untouched.
 *   - The scene plates are the five approved service crops. A choice does not
 *     summon a new picture; it moves the camera to the part of the studio where
 *     that kind of work happens.
 *
 * THE AI VISUAL-CONCEPT STAGE IS PROVISIONED, NOT BUILT. PRODUCT.md section 15
 * wants a step where a visitor picks a generated visual direction, and section
 * 11 forbids spending generation credits before approval. The seam for it is
 * `answers`: a plain record that the brief serialiser walks in order. Adding the
 * step is a new entry in STEPS plus a case in the scene reducer — no change to
 * the payload, the validation or the transport. Nothing here calls a generator.
 */
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { motion, useTransform } from "framer-motion";
import { toast } from "sonner";
import { EASE, useAct, useMotionCapability } from "@/components/cinematic";
import { SceneImage, type SceneName } from "@/components/media/SceneImage";
import { sendContactToTelegram } from "@/lib/telegram.functions";
import { useT } from "@/lib/i18n";

/**
 * Budget values in CZK, matching `Contact.tsx` exactly — the transport takes a
 * number and the label is what the visitor actually chose. Duplicated rather
 * than exported from the other component on purpose: that file is the /contact
 * route's own stepper and this section must not be able to break it.
 */
const BUDGET_VALUES = [20000, 50000, 100000, 150000, 0];

/**
 * Which room the camera stands in for each project type, in `t.form.projectTypes`
 * order: company site, e-shop, web application, redesign, not sure. A redesign is
 * still a website, and "not sure" opens on the branding room because that is
 * where a project without a defined shape actually starts.
 */
const TYPE_SCENES: SceneName[] = ["svc-web", "svc-eshop", "svc-app", "svc-web", "svc-branding"];

/** The act. It pins nothing, and says so — the register must not be lied to. */
const BUILDER_VIEWPORTS = 1.25;

type Answers = {
  type: number | null;
  features: number[];
  goal: string;
  budget: number | null;
  name: string;
  email: string;
  phone: string;
  message: string;
};

const EMPTY: Answers = {
  type: null,
  features: [],
  goal: "",
  budget: null,
  name: "",
  email: "",
  phone: "",
  message: "",
};

export function ProjectBuilder() {
  const { t } = useT();
  const f = t.contact.form;
  const capability = useMotionCapability();
  const reduced = capability === "still";

  const act = useAct("builder", { viewports: BUILDER_VIEWPORTS, pin: 0 });
  const { ref, enter } = act;
  // Arrival only: the section picks up the move the case reels were making and
  // then stops, because everything after this point is the visitor's to drive.
  const enterY = useTransform(enter, [0, 1], [40, 0]);

  const [step, setStep] = useState(0);
  const [a, setA] = useState<Answers>(EMPTY);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Which heading belongs to which step.
   *
   * `f.stepTitles` is stored in the /contact stepper's order — type, features,
   * CONTACT, BUDGET — and this section asks for the budget before the contact
   * details, because a visitor who has just described a project answers "how
   * much" while they are still thinking about the project and answers "who are
   * you" once they have decided to send it. Indexing the array by step number
   * therefore put the budget options under the heading "Contact details" and the
   * name and e-mail fields under "What is your approximate budget?" — measured
   * in the browser, not guessed.
   *
   * The order of the strings in i18n is not this section's to change: it is
   * shared with a shipping route. So the mapping is stated here instead, once,
   * and the heading is always read through it.
   */
  const TITLE_FOR_STEP = [0, 1, 3, 2];
  const steps = TITLE_FOR_STEP.map((i) => f.stepTitles[i]);
  const last = steps.length - 1;

  /**
   * The scene's response. Both readings are continuous rather than per-option,
   * so the room brightens as the project gets more defined instead of jumping
   * to a lookup value — the difference between a world reacting and a switch
   * being flipped.
   */
  const scene = TYPE_SCENES[a.type ?? 0] ?? "svc-web";
  const definition = useMemo(() => {
    let d = a.type === null ? 0 : 0.34;
    d += Math.min(a.features.length, 4) * 0.09;
    if (a.goal.trim()) d += 0.08;
    if (a.budget !== null) d += 0.16;
    return Math.min(1, d);
  }, [a.type, a.features.length, a.goal, a.budget]);

  const canAdvance = step === 0 ? a.type !== null : step === 2 ? a.budget !== null : true;

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(a.email.trim());
  const canSubmit =
    a.type !== null &&
    a.budget !== null &&
    a.name.trim().length > 0 &&
    validEmail &&
    a.message.trim().length > 0;

  const toggleFeature = (i: number) =>
    setA((s) => ({
      ...s,
      features: s.features.includes(i) ? s.features.filter((x) => x !== i) : [...s.features, i],
    }));

  /**
   * The brief, assembled in one place. Optional answers are serialised into the
   * tail of `message` exactly as the /contact stepper does, because the
   * transport takes six fields and adding a seventh would change a protected
   * contract. A future visual-concept step appends one more line here.
   */
  const onSubmit = async () => {
    if (!canSubmit || a.type === null || a.budget === null) return;
    setError(null);
    setSending(true);
    try {
      const picked = a.features.map((i) => f.features[i]).filter(Boolean);
      const extra: string[] = [];
      if (picked.length) extra.push(`${f.featuresLabel} ${picked.join(", ")}`);
      if (a.goal.trim()) extra.push(`${f.goalLabel} ${a.goal.trim()}`);
      await sendContactToTelegram({
        data: {
          name: a.name.trim(),
          email: a.email.trim(),
          phone: a.phone.trim(),
          service: f.projectTypes[a.type],
          budget: BUDGET_VALUES[a.budget] ?? 0,
          message: `[${f.budgets[a.budget]}]${extra.length ? `\n${extra.join("\n")}` : ""}\n${a.message.trim()}`,
        },
      });
      setSent(true);
      toast.success(`${f.successTitle} ${f.successBody}`);
    } catch (err) {
      console.error(err);
      setError(f.errors.sendFailed);
      toast.error(f.errors.sendFailed);
    } finally {
      setSending(false);
    }
  };

  return (
    <section
      ref={ref}
      id="builder"
      /* A full stage, not a block. The room needs the height to be a room at all:
         at the section's natural content height the plate was a 700px slot, the
         figure was cropped to a sliver and the scene read as a smudge behind a
         form. */
      className="relative z-10 flex min-h-[100svh] items-center overflow-hidden bg-[#0A0D13]"
      aria-label={f.stepTitles[0]}
    >
      {/* THE ROOM THE PROJECT IS BEING BUILT IN. Same construction as the
          services stage — right-anchored plate, one radial mask so no edge is
          straight, the section's own black rising as a floor — because this is
          the same studio, seen once the visitor has started describing what they
          want built in it. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-[min(52%,calc(104svh*0.6704))] lg:block"
      >
        <motion.div
          animate={{ opacity: 0.52 + definition * 0.4, scale: 1 + definition * 0.03 }}
          transition={{ duration: reduced ? 0 : 1.1, ease: EASE }}
          className="absolute inset-0 origin-[70%_50%]"
        >
          <div className="absolute inset-0 overflow-hidden [mask-image:radial-gradient(100%_135%_at_100%_50%,#000_0%,#000_30%,transparent_97%)]">
            {/* The takes are stacked and cross-faded rather than wiped: nothing
                is being cut to here — the room is simply the one that matches
                what has been described so far. */}
            {TYPE_SCENES.map((name, i) => (
              <motion.div
                key={`${name}-${i}`}
                initial={false}
                animate={{ opacity: scene === name ? 1 : 0 }}
                transition={{ duration: reduced ? 0 : 0.8, ease: EASE }}
                className="absolute inset-0"
              >
                <SceneImage
                  name={name}
                  alt=""
                  sizes="(min-width: 1024px) 46vw, 100vw"
                  className="absolute inset-0 block h-full w-full"
                  imgClassName="h-full w-full object-cover object-[50%_16%]"
                />
              </motion.div>
            ))}
          </div>
          {/* The floor — and, as in the services room, the thing that keeps the
              third-party mark and the baked screen copy in `svc-eshop` out of
              frame. Same cut line, for the same two reasons. */}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,#0A0D13_0%,#0A0D13_46%,transparent_82%)]" />
          {/* ...and a ceiling, because this section's top edge is a section
              boundary rather than the top of the viewport. Without it the plate
              butts into the case reel above in a hard horizontal line — the
              exact seam the services join exists to avoid. */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[26%] bg-[linear-gradient(to_bottom,#0A0D13_0%,transparent_100%)]" />
        </motion.div>
        {/* The light answers the brief getting more definite. */}
        <motion.div
          animate={{ opacity: 0.25 + definition * 0.75 }}
          transition={{ duration: reduced ? 0 : 1.1, ease: EASE }}
          className="absolute inset-0 mix-blend-screen"
        >
          <div className="absolute inset-0 bg-[radial-gradient(58%_44%_at_26%_20%,oklch(0.65_0.18_255/0.2),transparent_70%)]" />
        </motion.div>
      </div>

      <motion.div
        style={{ opacity: reduced ? 1 : enter, y: reduced ? 0 : enterY }}
        className="container-luxe relative w-full py-28"
      >
        <div className="max-w-[34rem]">
          <div className="flex items-baseline gap-4">
            <p className="label-micro flex items-center gap-3 text-white/55">
              <span aria-hidden className="size-[5px] rounded-full bg-primary" />
              {t.contact.title}
            </p>
            <span className="label-micro tabular-nums text-white/25">
              {f.stepLabel} {Math.min(step + 1, steps.length)} / {steps.length}
            </span>
          </div>

          {sent ? (
            <div className="mt-10">
              <h2 className="heading-scene text-[clamp(1.7rem,1.2rem+1.6vw,2.6rem)] text-white">
                {f.successTitle}
              </h2>
              <p className="mt-4 max-w-[46ch] text-[0.9375rem] leading-relaxed text-white/60">
                {f.successBody}
              </p>
              <button
                type="button"
                onClick={() => {
                  setA(EMPTY);
                  setStep(0);
                  setSent(false);
                }}
                className="mt-8 text-sm font-medium text-white/60 underline-offset-8 transition-colors hover:text-white hover:underline"
              >
                {f.sendAgain}
              </button>
            </div>
          ) : (
            <>
              <h2 className="heading-scene mt-6 text-[clamp(1.7rem,1.2rem+1.6vw,2.6rem)] text-white">
                {steps[step]}
              </h2>

              {/* The progress of the brief itself, as one rule that fills. */}
              <div aria-hidden className="relative mt-7 h-px w-full bg-white/10">
                <motion.span
                  animate={{ scaleX: definition }}
                  transition={{ duration: reduced ? 0 : 0.8, ease: EASE }}
                  className="absolute inset-0 block h-px origin-left bg-primary shadow-[0_0_10px_oklch(0.65_0.18_255/0.6)]"
                />
              </div>

              <div className="mt-9 min-h-[19rem]">
                {step === 0 && (
                  <OptionList
                    options={f.projectTypes}
                    selected={a.type === null ? [] : [a.type]}
                    onPick={(i) => setA((s) => ({ ...s, type: i }))}
                    reduced={reduced}
                  />
                )}

                {step === 1 && (
                  <>
                    <OptionList
                      options={f.features}
                      selected={a.features}
                      onPick={toggleFeature}
                      reduced={reduced}
                      multi
                    />
                    <label className="mt-7 block">
                      <span className="label-micro block text-white/45">{f.goalLabel}</span>
                      <input
                        value={a.goal}
                        onChange={(e) => setA((s) => ({ ...s, goal: e.target.value }))}
                        placeholder={f.goalPlaceholder}
                        className="mt-3 w-full border-b border-white/15 bg-transparent pb-2 text-[0.95rem] text-white outline-none transition-colors placeholder:text-white/25 focus:border-primary"
                      />
                    </label>
                  </>
                )}

                {step === 2 && (
                  <>
                    <OptionList
                      options={f.budgets}
                      selected={a.budget === null ? [] : [a.budget]}
                      onPick={(i) => setA((s) => ({ ...s, budget: i }))}
                      reduced={reduced}
                    />
                    <p className="mt-6 max-w-[42ch] text-[0.8125rem] leading-relaxed text-white/40">
                      {f.budgetHelp}
                    </p>
                  </>
                )}

                {step === 3 && (
                  <div className="space-y-6">
                    <Field
                      label={f.namePlaceholder}
                      value={a.name}
                      onChange={(v) => setA((s) => ({ ...s, name: v }))}
                      placeholder={f.namePlaceholder}
                      autoComplete="name"
                    />
                    <Field
                      label={f.emailPlaceholder}
                      value={a.email}
                      onChange={(v) => setA((s) => ({ ...s, email: v }))}
                      placeholder={f.emailPlaceholder}
                      type="email"
                      autoComplete="email"
                    />
                    <Field
                      label={f.phonePlaceholder}
                      value={a.phone}
                      onChange={(v) => setA((s) => ({ ...s, phone: v }))}
                      placeholder={f.phonePlaceholder}
                      type="tel"
                      autoComplete="tel"
                    />
                    <label className="block">
                      <span className="label-micro block text-white/45">{f.messageLabel}</span>
                      <textarea
                        value={a.message}
                        onChange={(e) => setA((s) => ({ ...s, message: e.target.value }))}
                        placeholder={f.messagePlaceholder}
                        rows={3}
                        className="mt-3 w-full resize-none border-b border-white/15 bg-transparent pb-2 text-[0.95rem] leading-relaxed text-white outline-none transition-colors placeholder:text-white/25 focus:border-primary"
                      />
                    </label>
                  </div>
                )}
              </div>

              {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

              <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
                {step > 0 && (
                  <button
                    type="button"
                    onClick={() => setStep((s) => Math.max(0, s - 1))}
                    className="inline-flex items-center gap-2 text-sm font-medium text-white/55 underline-offset-8 transition-colors hover:text-white hover:underline"
                  >
                    <ArrowLeft className="size-4" aria-hidden />
                    {f.back}
                  </button>
                )}
                {step < last ? (
                  <button
                    type="button"
                    disabled={!canAdvance}
                    onClick={() => setStep((s) => Math.min(last, s + 1))}
                    className="btn-primary text-sm disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {f.next}
                    <ArrowRight className="size-4" aria-hidden />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={!canSubmit || sending}
                    onClick={onSubmit}
                    className="btn-primary text-sm disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {sending ? f.sending : f.submit}
                    {sending ? (
                      <Loader2 className="size-4 animate-spin" aria-hidden />
                    ) : (
                      <ArrowRight className="size-4" aria-hidden />
                    )}
                  </button>
                )}
                <span className="label-micro text-white/30">{f.noSpam}</span>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </section>
  );
}

/**
 * Options as a list with hairlines, never as a grid of boxes. Same argument the
 * manifesto's three positions settled: equal-sized bordered tiles are the lazy
 * container, and here they would also turn a conversation into a pricing table.
 */
function OptionList({
  options,
  selected,
  onPick,
  reduced,
  multi = false,
}: {
  options: readonly string[];
  selected: number[];
  onPick: (i: number) => void;
  reduced: boolean;
  multi?: boolean;
}) {
  return (
    <ul role={multi ? "group" : "radiogroup"}>
      {options.map((label, i) => {
        const on = selected.includes(i);
        return (
          <li key={label} className="border-t border-white/10 last:border-b">
            <button
              type="button"
              role={multi ? "checkbox" : "radio"}
              aria-checked={on}
              onClick={() => onPick(i)}
              className="group flex w-full items-center gap-4 py-3.5 text-left focus-visible:outline-none"
            >
              <span
                aria-hidden
                className={`flex size-4 shrink-0 items-center justify-center rounded-full border transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  on
                    ? "border-primary bg-primary shadow-[0_0_0_4px_oklch(0.65_0.18_255/0.18)]"
                    : "border-white/25 group-hover:border-primary/70 group-focus-visible:border-primary"
                }`}
              >
                {on && <Check className="size-2.5 text-[#0A0D13]" aria-hidden />}
              </span>
              <motion.span
                initial={false}
                animate={{ x: on && !reduced ? 4 : 0 }}
                transition={{ duration: 0.4, ease: EASE }}
                className={`text-[0.95rem] transition-colors duration-400 ${
                  on ? "text-white" : "text-white/50 group-hover:text-white/80"
                }`}
              >
                {label}
              </motion.span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="sr-only">{label}</span>
      <input
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border-b border-white/15 bg-transparent pb-2 text-[0.95rem] text-white outline-none transition-colors placeholder:text-white/25 focus:border-primary"
      />
    </label>
  );
}

export default ProjectBuilder;
