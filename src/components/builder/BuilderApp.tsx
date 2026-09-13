/**
 * ELEVATE AI Project Builder — the flow.
 *
 *   01 Typ · 02 Projekt · 03 Vizuál · 04 Reference   the brief (BriefSteps)
 *   05 Koncepty                                       analysis → five concepts (AnalysisStage, ConceptGallery, ConceptViewer)
 *   06 Kontakt                                        only after a direction is selected (ContactStep)
 *   ✓                                                 only after the real send succeeds
 *
 * Architecture (docs/builder/ARCHITECTURE.md):
 *
 *   brief ──generateConcepts()──▶ model ──tool JSON──▶ spec.ts (validate, sanitise, repair, distinctness)
 *        ◀── DesignSpec[5] ──────────────────────────────────────────────────────────────────────┘
 *   DesignSpec ──ConceptRenderer──▶ website preview          (the model never writes markup)
 *   feedback + DesignSpec ──refineConcept()──▶ revised DesignSpec
 *   Lead ──toContactPayload()──▶ sendContactToTelegram()     (existing, protected pipeline)
 *
 * State is one Lead (brief, concepts, selection, revisions) persisted to
 * localStorage on every change and re-validated on load (`storage.ts`), so a
 * reload, a failed generation or a failed send never costs the visitor their
 * work. Nothing is ever shown as generated unless the server returned it and
 * it passed validation, and nothing is shown as sent unless the send resolved.
 */
import { ArrowLeft, ArrowRight, Check, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useReducedScene } from "@/components/cinematic";
import { BrowserWindow } from "@/components/home/BrowserWindow";
import { generateConcepts, refineConcept } from "@/lib/builder/ai.functions";
import {
  BriefSchema,
  EMPTY_BRIEF,
  type Brief,
  type BriefDraft,
  type Contact,
  type Lead,
  type Revision,
} from "@/lib/builder/brief";
import { BUILDER_COPY, type BuilderCopy } from "@/lib/builder/copy";
import { parseStoredSpec, type DesignSpec } from "@/lib/builder/spec";
import { clearBuilder, loadBuilder, saveBuilder } from "@/lib/builder/storage";
import { toContactPayload } from "@/lib/builder/submission";
import { useT, type Lang } from "@/lib/i18n";
import { sendContactToTelegram } from "@/lib/telegram.functions";
import { AnalysisStage } from "./AnalysisStage";
import { BriefSheet } from "./BriefSheet";
import { BriefSteps, validateBriefStep, type FieldRefs } from "./BriefSteps";
import { ConceptGallery } from "./ConceptGallery";
import { ConceptViewer } from "./ConceptViewer";
import { ContactStep, type ContactDraft } from "./ContactStep";
import { ScaledPreview } from "./renderer/ScaledPreview";
import { StepRail } from "./StepRail";

const STEP_CONCEPTS = 4;
const STEP_CONTACT = 5;
const STEP_DONE = 6;

const EMPTY_CONTACT: ContactDraft = {
  name: "",
  email: "",
  company: "",
  budgetIndex: null,
  deadline: null,
  message: "",
};

const now = () => new Date().toISOString();

function newLead(lang: Lang): Lead {
  return {
    id: crypto.randomUUID(),
    schemaVersion: 1,
    status: "draft",
    lang,
    createdAt: now(),
    updatedAt: now(),
    brief: EMPTY_BRIEF,
    concepts: [],
    selectedConceptId: null,
    revisions: [],
    contact: null,
    submittedAt: null,
  };
}

/** The brief as the server requires it, or null. Empty reference rows are dropped first. */
function strictBrief(draft: BriefDraft): Brief | null {
  const parsed = BriefSchema.safeParse({
    ...draft,
    references: {
      ...draft.references,
      urls: draft.references.urls.map((u) => u.trim()).filter(Boolean),
    },
  });
  return parsed.success ? parsed.data : null;
}

const ERROR_CODES = [
  "AI_UNAVAILABLE",
  "AI_BUSY",
  "AI_TIMEOUT",
  "AI_INVALID",
  "RATE_LIMITED",
  "INVALID_INPUT",
] as const;
function errorMessage(err: unknown, copy: BuilderCopy): string {
  const code = (err as Error)?.message;
  return (ERROR_CODES as readonly string[]).includes(code)
    ? copy.errors[code as (typeof ERROR_CODES)[number]]
    : copy.errors.UNKNOWN;
}

export function BuilderApp() {
  const { lang } = useT();
  const copy = BUILDER_COPY[lang];
  const reduced = useReducedScene();

  const [hydrated, setHydrated] = useState(false);
  const [lead, setLead] = useState<Lead>(() => newLead(lang));
  const [step, setStep] = useState(0);
  const [contact, setContact] = useState<ContactDraft>(EMPTY_CONTACT);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);
  const [viewer, setViewer] = useState<{
    id: string;
    focusRefine: boolean;
    opener: HTMLElement | null;
  } | null>(null);
  const [restored, setRestored] = useState(false);
  const [fixture, setFixture] = useState(false);
  const refs = useRef<FieldRefs>({});
  const request = useRef(0);
  const firstRender = useRef(true);

  /* ---- load --------------------------------------------------------------- */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (import.meta.env.DEV && new URLSearchParams(window.location.search).has("fixture")) {
        const { FIXTURE_BRIEF, FIXTURE_DRAFTS } = await import("@/lib/builder/fixtures.dev");
        const { parseDraft, toSpec } = await import("@/lib/builder/spec");
        const concepts = FIXTURE_DRAFTS.map((d, i) => {
          const r = parseDraft(d);
          if (!r.ok) throw new Error(`fixture ${i} invalid`);
          return toSpec(r.draft, `c-fixture-0${i + 1}`);
        });
        if (cancelled) return;
        setLead((l) => ({ ...l, brief: FIXTURE_BRIEF, concepts, status: "concepts_ready" }));
        setStep(STEP_CONCEPTS);
        setFixture(true);
        setHydrated(true);
        return;
      }
      const stored = loadBuilder();
      if (cancelled) return;
      if (stored) {
        let s = stored.step;
        if (s === STEP_CONCEPTS && stored.lead.concepts.length === 0) s = 3;
        if (s === STEP_CONTACT && !stored.lead.selectedConceptId)
          s = stored.lead.concepts.length ? STEP_CONCEPTS : 3;
        if (s === STEP_DONE && stored.lead.status !== "submitted") s = STEP_CONTACT;
        setLead(stored.lead);
        setStep(s);
        if (stored.contact) setContact(stored.contact);
        const b = stored.lead.brief;
        setRestored(Boolean(b.projectType || b.project.company || stored.lead.concepts.length));
      }
      setHydrated(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  /* ---- save --------------------------------------------------------------- */
  useEffect(() => {
    if (!hydrated || fixture) return;
    saveBuilder({ lead, step, contact });
  }, [hydrated, fixture, lead, step, contact]);

  /* ---- focus and scroll on step change ------------------------------------- */
  const stageKey = `${step}-${generating}-${genError ? 1 : 0}`;
  useEffect(() => {
    if (!hydrated) return;
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
    const heading = document.querySelector<HTMLElement>("[data-step-heading]");
    heading?.focus({ preventScroll: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stageKey, hydrated]);

  const update = useCallback((patch: Partial<Lead> | ((l: Lead) => Partial<Lead>)) => {
    setLead((l) => ({
      ...l,
      ...(typeof patch === "function" ? patch(l) : patch),
      updatedAt: now(),
    }));
  }, []);

  const selected = useMemo(
    () => lead.concepts.find((c) => c.id === lead.selectedConceptId) ?? null,
    [lead.concepts, lead.selectedConceptId],
  );

  const reachable = useMemo(() => {
    if (lead.status === "submitted") return STEP_DONE;
    if (selected) return STEP_CONTACT;
    if (lead.concepts.length > 0 || generating || genError) return STEP_CONCEPTS;
    const b = lead.brief;
    if (!b.projectType) return 0;
    if (Object.keys(validateBriefStep(1, b, copy)).length > 0) return 1;
    return 3;
  }, [lead, selected, generating, genError, copy]);

  /* ---- brief navigation ----------------------------------------------------- */
  const focusFirstError = (errs: Record<string, string>) => {
    const key = Object.keys(errs)[0];
    requestAnimationFrame(() => refs.current[key]?.focus());
  };

  const generate = useCallback(async () => {
    const brief = strictBrief(lead.brief);
    if (!brief) {
      for (const s of [0, 1, 3]) {
        const errs = validateBriefStep(s, lead.brief, copy);
        if (Object.keys(errs).length > 0) {
          setStep(s);
          setErrors(errs);
          focusFirstError(errs);
          return;
        }
      }
      setGenError(copy.errors.INVALID_INPUT);
      return;
    }
    const token = ++request.current;
    setStep(STEP_CONCEPTS);
    setGenError(null);
    setGenerating(true);
    try {
      const res = await generateConcepts({ data: { lang, brief } });
      if (token !== request.current) return;
      // Defence in depth: the server already validated; the browser checks again before rendering.
      const concepts = (res?.concepts ?? []).map(parseStoredSpec);
      if (concepts.length !== 5 || concepts.some((c) => !c)) throw new Error("AI_INVALID");
      update({
        lang,
        brief,
        concepts: concepts as DesignSpec[],
        selectedConceptId: null,
        revisions: [],
        status: "concepts_ready",
      });
    } catch (err) {
      if (token !== request.current) return;
      setGenError(errorMessage(err, copy));
    } finally {
      if (token === request.current) setGenerating(false);
    }
  }, [lead.brief, lang, copy, update]);

  const next = () => {
    const errs = validateBriefStep(step, lead.brief, copy);
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      focusFirstError(errs);
      return;
    }
    if (step === 3) {
      if (lead.concepts.length > 0 && !window.confirm(copy.concepts.regenerateConfirm)) return;
      void generate();
      return;
    }
    setStep((s) => s + 1);
  };

  const back = () => {
    setErrors({});
    setStep((s) => Math.max(0, s - 1));
  };

  const jump = (i: number) => {
    if (i > reachable) return;
    setErrors({});
    if (i === STEP_CONTACT && !contact.company)
      setContact((c) => ({ ...c, company: lead.brief.project.company }));
    setStep(i);
  };

  /* ---- concepts ------------------------------------------------------------- */
  const select = (id: string) =>
    update((l) => {
      const nextId = l.selectedConceptId === id ? null : id;
      return {
        selectedConceptId: nextId,
        status: nextId ? "direction_selected" : "concepts_ready",
      };
    });

  const refine = async (id: string, feedback: string) => {
    const brief = strictBrief(lead.brief);
    const current = lead.concepts.find((c) => c.id === id);
    if (!brief || !current) throw new Error(copy.errors.INVALID_INPUT);
    let revised: DesignSpec | null = null;
    try {
      const res = await refineConcept({ data: { lang, brief, spec: current, feedback } });
      revised = parseStoredSpec(res?.spec);
      if (!revised || revised.id !== id) throw new Error("AI_INVALID");
    } catch (err) {
      throw new Error(errorMessage(err, copy));
    }
    const after = revised;
    const revision: Revision = {
      id: crypto.randomUUID(),
      conceptId: id,
      feedback,
      before: current,
      after,
      createdAt: now(),
    };
    update((l) => ({
      concepts: l.concepts.map((c) => (c.id === id ? after : c)),
      revisions: [...l.revisions, revision].slice(-60),
    }));
  };

  const restore = (id: string, version: DesignSpec) =>
    update((l) => {
      const current = l.concepts.find((c) => c.id === id);
      if (!current) return {};
      const after: DesignSpec = { ...version, id, revision: current.revision + 1 };
      const revision: Revision = {
        id: crypto.randomUUID(),
        conceptId: id,
        feedback: "",
        before: current,
        after,
        createdAt: now(),
      };
      return {
        concepts: l.concepts.map((c) => (c.id === id ? after : c)),
        revisions: [...l.revisions, revision].slice(-60),
      };
    });

  const regenerate = () => {
    if (!window.confirm(copy.concepts.regenerateConfirm)) return;
    void generate();
  };

  const toContact = () => {
    if (!selected) return;
    if (!contact.company) setContact((c) => ({ ...c, company: lead.brief.project.company }));
    setStep(STEP_CONTACT);
  };

  /* ---- submit --------------------------------------------------------------- */
  const { t } = useT();
  const submit = async (c: Contact) => {
    if (!selected) throw new Error("NO_SELECTION");
    const payload = toContactPayload(
      lead,
      selected,
      c,
      t.contact.form.budgets[c.budgetIndex] ?? "",
    );
    await sendContactToTelegram({ data: payload });
    // Only reached if the pipeline accepted the message.
    update({ contact: c, status: "submitted", submittedAt: now() });
    setStep(STEP_DONE);
  };

  const startOver = () => {
    if (!window.confirm(copy.startOverConfirm)) return;
    request.current++;
    clearBuilder();
    setLead(newLead(lang));
    setContact(EMPTY_CONTACT);
    setErrors({});
    setGenError(null);
    setGenerating(false);
    setViewer(null);
    setRestored(false);
    setFixture(false);
    setStep(0);
  };

  const dirty = Boolean(
    lead.brief.projectType || lead.brief.project.company || lead.concepts.length,
  );
  const viewerSpec = viewer ? lead.concepts.find((c) => c.id === viewer.id) : undefined;
  const railStep = Math.min(step, STEP_CONTACT);

  return (
    <section className="relative isolate min-h-[100svh] overflow-x-clip bg-[#0A0D13] text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-48 right-[-14%] -z-10 aspect-square w-[44rem] max-w-[120vw] rounded-full bg-[radial-gradient(circle,oklch(0.65_0.18_255/0.13),transparent_64%)]"
      />
      <div className="container-luxe relative pt-28 pb-24 md:pt-36">
        <div className="flex items-center justify-between gap-6">
          <p className="label-micro flex items-center gap-3 text-white/60">
            <span aria-hidden className="h-px w-8 bg-white/30" />
            {copy.intro.eyebrow}
          </p>
          {dirty && step !== STEP_DONE && (
            <button
              type="button"
              onClick={startOver}
              className="inline-flex min-h-11 items-center gap-2 text-sm text-white/55 underline-offset-8 hover:text-white hover:underline focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
            >
              <RotateCcw className="size-3.5" aria-hidden />
              {copy.startOver}
            </button>
          )}
        </div>

        {step !== STEP_DONE && (
          <div className="mt-6">
            <StepRail
              labels={copy.steps}
              current={railStep}
              reachable={reachable}
              onJump={jump}
              stepOf={copy.stepOf}
            />
          </div>
        )}

        <div className="mt-12 md:mt-16">
          {!hydrated ? (
            <div className="h-[60svh]" aria-busy="true" />
          ) : step <= 3 ? (
            <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-20">
              <form
                noValidate
                onSubmit={(e) => {
                  e.preventDefault();
                  next();
                }}
              >
                <BriefSteps
                  step={step}
                  brief={lead.brief}
                  onChange={(brief) => {
                    update({ brief });
                    if (Object.keys(errors).length) setErrors({});
                  }}
                  errors={errors}
                  refs={refs}
                  copy={copy}
                  restoredNote={
                    restored ? (
                      <p role="status" className="mt-6 text-sm text-white/55">
                        {copy.restored}
                      </p>
                    ) : null
                  }
                />
                {step === 3 && (
                  <div className="mt-10 lg:hidden">
                    <BriefSheet brief={lead.brief} copy={copy} reduced={reduced} />
                  </div>
                )}
                {Object.keys(errors).length > 0 && (
                  <p role="alert" className="mt-8 text-sm text-[oklch(0.72_0.19_27)]">
                    {copy.validation.fix}
                  </p>
                )}
                <div className="sticky bottom-0 z-20 -mx-6 mt-10 flex items-center justify-between gap-4 border-t border-white/10 bg-[#0A0D13]/92 px-6 py-4 backdrop-blur md:static md:mx-0 md:mt-12 md:bg-transparent md:px-0 md:backdrop-blur-none">
                  {step > 0 ? (
                    <button
                      type="button"
                      onClick={back}
                      className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-white/70 underline-offset-8 hover:text-white hover:underline focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                    >
                      <ArrowLeft className="size-4" aria-hidden />
                      {copy.back}
                    </button>
                  ) : (
                    <span />
                  )}
                  <button type="submit" className="btn-primary">
                    {step === 3 ? copy.references.generate : copy.next}
                    <ArrowRight className="size-4" aria-hidden />
                  </button>
                </div>
              </form>
              <div className="hidden lg:block">
                <div className="sticky top-32">
                  <BriefSheet brief={lead.brief} copy={copy} reduced={reduced} />
                </div>
              </div>
            </div>
          ) : step === STEP_CONCEPTS ? (
            generating || genError || lead.concepts.length === 0 ? (
              <AnalysisStage
                brief={lead.brief}
                copy={copy}
                error={generating ? null : (genError ?? copy.errors.UNKNOWN)}
                onRetry={() => void generate()}
                onEdit={() => {
                  setGenError(null);
                  setStep(1);
                }}
              />
            ) : (
              <ConceptGallery
                concepts={lead.concepts}
                brief={lead.brief}
                copy={copy}
                selectedId={lead.selectedConceptId}
                reduced={reduced}
                fixture={fixture}
                onOpen={(id, focusRefine = false) =>
                  setViewer({
                    id,
                    focusRefine,
                    opener: document.activeElement as HTMLElement | null,
                  })
                }
                onSelect={select}
                onRegenerate={regenerate}
              />
            )
          ) : step === STEP_CONTACT && selected ? (
            <ContactStep
              brief={lead.brief}
              spec={selected}
              copy={copy}
              draft={contact}
              onDraft={setContact}
              onChangeDirection={() => setStep(STEP_CONCEPTS)}
              onSubmit={submit}
            />
          ) : step === STEP_DONE && selected ? (
            <Success
              copy={copy}
              brief={lead.brief}
              spec={selected}
              onAgain={() => {
                request.current++;
                clearBuilder();
                setLead(newLead(lang));
                setContact(EMPTY_CONTACT);
                setRestored(false);
                setStep(0);
              }}
            />
          ) : null}
        </div>
      </div>

      {/* Selected direction: the way forward stays in reach while comparing. */}
      {hydrated && step === STEP_CONCEPTS && !generating && !genError && selected && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#0A0D13]/92 backdrop-blur">
          <div className="container-luxe flex flex-wrap items-center justify-between gap-3 py-3">
            <p className="flex min-w-0 items-center gap-2 text-sm text-white/70">
              <Check className="size-4 shrink-0 text-primary" aria-hidden />
              <span className="hidden sm:inline">{copy.concepts.selected}:</span>
              <span className="truncate font-semibold text-white">{selected.name}</span>
            </p>
            <button type="button" onClick={toContact} className="btn-primary text-sm">
              {copy.concepts.continue}
              <ArrowRight className="size-4" aria-hidden />
            </button>
          </div>
        </div>
      )}

      {viewer && viewerSpec && (
        <ConceptViewer
          spec={viewerSpec}
          index={lead.concepts.findIndex((c) => c.id === viewerSpec.id)}
          total={lead.concepts.length}
          brief={lead.brief}
          copy={copy}
          revisions={lead.revisions.filter((r) => r.conceptId === viewerSpec.id)}
          selected={lead.selectedConceptId === viewerSpec.id}
          focusRefine={viewer.focusRefine}
          reduced={reduced}
          onClose={() => setViewer(null)}
          onSelect={() => select(viewerSpec.id)}
          onRefine={(feedback) => refine(viewerSpec.id, feedback)}
          onRestore={(version) => restore(viewerSpec.id, version)}
          returnFocus={viewer.opener}
        />
      )}
    </section>
  );
}

function Success({
  copy,
  brief,
  spec,
  onAgain,
}: {
  copy: BuilderCopy;
  brief: BriefDraft;
  spec: DesignSpec;
  onAgain: () => void;
}) {
  return (
    <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
      <div role="status">
        <span className="grid size-12 place-items-center rounded-full bg-primary/15 text-primary">
          <Check className="size-6" aria-hidden />
        </span>
        <h1
          tabIndex={-1}
          data-step-heading
          className="heading-scene mt-6 text-[clamp(2.25rem,1.4rem+3vw,4rem)] text-white outline-none"
        >
          {copy.success.title}
        </h1>
        <p className="mt-5 max-w-[46ch] text-base leading-relaxed text-white/70">
          {copy.success.body}
        </p>
        <button
          type="button"
          onClick={onAgain}
          className="mt-8 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-white/75 underline-offset-8 hover:text-white hover:underline focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
        >
          <RotateCcw className="size-4" aria-hidden />
          {copy.success.again}
        </button>
      </div>
      <div>
        <BrowserWindow address="elevateit.cz/builder">
          <ScaledPreview
            spec={spec}
            brand={brief.project.company}
            tagline={brief.project.industry}
            copy={copy.renderer}
            width={1280}
            crop={800}
            variant="thumbnail"
          />
        </BrowserWindow>
        <p className="heading-scene mt-5 text-2xl text-white">{spec.name}</p>
      </div>
    </div>
  );
}
