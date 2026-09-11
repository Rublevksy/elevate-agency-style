/**
 * Project builder — BUILD YOUR PROJECT, the page's one interactive beat.
 *
 * Everything above this section is driven by scroll; here the visitor drives.
 * As they answer, THE WINDOW beside the form draws a live blueprint of what
 * they are describing (`ProjectBlueprint.tsx`): the project type sets the page
 * skeleton, each feature docks its module labelled with the visitor's own
 * choice, the budget pins to the footer, and the whole drawing assembles from
 * loose parts as the brief gets more defined. Describing a project is the act
 * of seeing it take shape — not filling in a contact form.
 *
 * WHAT IS REUSED, DELIBERATELY (unchanged from the previous builder):
 *
 *   - Every string comes from `t.contact.form.*`, which already exists in
 *     CZ/EN/RU/UA because the /contact stepper uses it. No key was added.
 *   - The submit payload is byte-for-byte the shape `Contact.tsx` sends:
 *     name / email / phone / service / budget / message, with the optional
 *     answers serialised into the tail of `message`. `telegram.functions.ts` is
 *     a protected system and its contract is untouched.
 *   - The step order (type, features, budget, contact) and `TITLE_FOR_STEP`.
 *
 * It is not scroll-driven: a form whose steps advance on scroll takes control
 * away exactly where the visitor needs it. The act supplies only the arrival.
 *
 * THE AI VISUAL-CONCEPT STAGE IS PROVISIONED, NOT BUILT (PRODUCT.md §15, §11):
 * `answers` is a plain record the serialiser walks in order; nothing here calls
 * a generator.
 */
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { motion, useTransform } from "framer-motion";
import { toast } from "sonner";
import { EASE, PERSPECTIVE, useAct, useMotionCapability } from "@/components/cinematic";
import { sendContactToTelegram } from "@/lib/telegram.functions";
import { useT } from "@/lib/i18n";
import { BrowserWindow } from "./BrowserWindow";
import { ProjectBlueprint } from "./ProjectBlueprint";

/**
 * Budget values in CZK, matching `Contact.tsx` exactly — the transport takes a
 * number and the label is what the visitor actually chose. Duplicated rather
 * than exported from the other component on purpose: that file is the /contact
 * route's own stepper and this section must not be able to break it.
 */
const BUDGET_VALUES = [20000, 50000, 100000, 150000, 0];

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
  // Arrival only: the form rises and the window swings round to face the
  // visitor; after that, everything is the visitor's to drive.
  const enterY = useTransform(enter, [0, 1], [reduced ? 0 : 40, 0]);
  const winRotateY = useTransform(enter, [0.2, 1], [reduced ? 0 : -16, 0]);
  const winX = useTransform(enter, [0.2, 1], [reduced ? 0 : 80, 0]);

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
   * How defined the brief is, continuously rather than per-option, so the
   * blueprint assembles as the project takes shape instead of jumping to a
   * lookup state — the difference between a drawing and a switch.
   */
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

  const typeLabel = a.type === null ? f.stepTitles[0] : f.projectTypes[a.type];

  return (
    <section
      ref={ref}
      id="builder"
      aria-label={f.stepTitles[0]}
      className="relative isolate z-10 overflow-hidden bg-[#0A0D13] py-24 lg:flex lg:min-h-[100svh] lg:items-center lg:py-32"
    >
      {/* The light answers the brief getting more definite. */}
      <motion.div
        aria-hidden
        animate={{ opacity: 0.35 + definition * 0.65 }}
        transition={{ duration: reduced ? 0 : 1.1, ease: EASE }}
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(50%_55%_at_72%_50%,oklch(0.65_0.18_255/0.2),transparent_70%)]"
      />

      <div className="container-luxe relative grid w-full grid-cols-1 gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start lg:gap-16">
        {/* ---- The blueprint window (first on phones: see what you build).
            Top-aligned with the brief and sticky, not centred against it: the
            form's height changes per step, and a centred window jumped up and
            down with every "Pokračovat". */}
        <div
          className="lg:sticky lg:top-32 lg:order-2 lg:pt-24"
          style={{ perspective: `${PERSPECTIVE}px` }}
        >
          <motion.div style={{ rotateY: winRotateY, x: winX }} className="origin-[0%_50%]">
            <BrowserWindow
              address={
                <span className="flex items-center">
                  <span className="text-white/45">{typeLabel}</span>
                  <motion.span
                    aria-hidden
                    animate={reduced ? undefined : { opacity: [1, 0, 1] }}
                    transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
                    className="ml-0.5 inline-block h-3.5 w-px bg-white/70"
                  />
                </span>
              }
              tab={typeLabel}
            >
              <ProjectBlueprint
                type={a.type}
                features={a.features}
                featureLabels={f.features}
                budgetLabel={a.budget === null ? null : f.budgets[a.budget]}
                definition={definition}
                reduced={reduced}
              />
            </BrowserWindow>
          </motion.div>
        </div>

        {/* ---- The brief --------------------------------------------------- */}
        <motion.div style={{ opacity: reduced ? 1 : enter, y: enterY }} className="lg:order-1">
          {/* The section's own voice: a conversation about a project, in the
              site's own words — "a few questions, no boring form". */}
          <p className="heading-scene text-[clamp(1.9rem,1.2rem+2.4vw,3.25rem)] text-white uppercase">
            {t.cta.title}
          </p>
          <p className="mt-4 max-w-[34rem] text-base leading-relaxed text-white/70">
            {t.cta.subtitle}
          </p>

          <div className="mt-10 flex items-baseline gap-4 border-t border-white/10 pt-8">
            <p className="label-micro flex items-center gap-3 text-white/60">
              <span aria-hidden className="size-[5px] rounded-full bg-primary" />
              {f.stepLabel} {Math.min(step + 1, steps.length)} / {steps.length}
            </p>
          </div>

          {sent ? (
            <div className="mt-10">
              <h2 className="heading-scene text-[clamp(1.6rem,1.1rem+1.5vw,2.4rem)] text-white">
                {f.successTitle}
              </h2>
              <p className="mt-4 max-w-[46ch] text-[0.9375rem] leading-relaxed text-white/65">
                {f.successBody}
              </p>
              <button
                type="button"
                onClick={() => {
                  setA(EMPTY);
                  setStep(0);
                  setSent(false);
                }}
                className="mt-8 text-sm font-medium text-white/65 underline-offset-8 transition-colors hover:text-white hover:underline"
              >
                {f.sendAgain}
              </button>
            </div>
          ) : (
            <>
              <h2 className="font-display mt-4 text-[clamp(1.6rem,1.1rem+1.5vw,2.4rem)] leading-[1.08] font-extrabold tracking-tight text-white">
                {steps[step]}
              </h2>

              {/* The steps as segments that fill — where you are in the brief. */}
              <div aria-hidden className="mt-7 grid grid-cols-4 gap-1.5">
                {steps.map((_, i) => (
                  <span
                    key={i}
                    className="relative h-[3px] overflow-hidden rounded-full bg-white/10"
                  >
                    <motion.span
                      animate={{
                        scaleX: i < step ? 1 : i === step ? Math.max(0.15, definition) : 0,
                      }}
                      transition={{ duration: reduced ? 0 : 0.6, ease: EASE }}
                      className="absolute inset-0 block origin-left bg-primary shadow-[0_0_10px_oklch(0.65_0.18_255/0.6)]"
                    />
                  </span>
                ))}
              </div>

              <div className="mt-8 min-h-[19rem]">
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
                      <span className="label-micro block text-white/55">{f.goalLabel}</span>
                      <input
                        value={a.goal}
                        onChange={(e) => setA((s) => ({ ...s, goal: e.target.value }))}
                        placeholder={f.goalPlaceholder}
                        className="mt-3 w-full border-b border-white/15 bg-transparent pb-2 text-[0.9375rem] text-white outline-none transition-colors placeholder:text-white/35 focus:border-primary"
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
                    <p className="mt-6 max-w-[42ch] text-[0.9375rem] leading-relaxed text-white/50">
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
                      <span className="label-micro block text-white/55">{f.messageLabel}</span>
                      <textarea
                        value={a.message}
                        onChange={(e) => setA((s) => ({ ...s, message: e.target.value }))}
                        placeholder={f.messagePlaceholder}
                        rows={3}
                        className="mt-3 w-full resize-none border-b border-white/15 bg-transparent pb-2 text-[0.9375rem] leading-relaxed text-white outline-none transition-colors placeholder:text-white/35 focus:border-primary"
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
                    className="inline-flex items-center gap-2 text-sm font-medium text-white/65 underline-offset-8 transition-colors hover:text-white hover:underline"
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
                <span className="label-micro text-white/40">{f.noSpam}</span>
              </div>
            </>
          )}
        </motion.div>
      </div>
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
                className={`text-[0.9375rem] transition-colors duration-400 ${
                  on ? "text-white" : "text-white/60 group-hover:text-white/85"
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
        className="w-full border-b border-white/15 bg-transparent pb-2 text-[0.9375rem] text-white outline-none transition-colors placeholder:text-white/35 focus:border-primary"
      />
    </label>
  );
}

export default ProjectBuilder;
