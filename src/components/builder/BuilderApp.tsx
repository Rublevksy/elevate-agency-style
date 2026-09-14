/**
 * ELEVATE AI Project Builder — the flow.
 *
 *   01 Typ · 02 Projekt · 03 Vizuál · 04 Reference   the brief (BriefSteps)
 *   05 Koncepty                                       analysis → five concepts (AnalysisStage, ConceptGallery, ConceptViewer)
 *   06 Kontakt                                        only after a direction is selected (ContactStep)
 *   ✓                                                 only after the server accepted the submission
 *
 * Persistence (docs/builder/ARCHITECTURE.md § Persistence):
 *
 *   The server is the record. `builder.functions.ts` stores the brief, the
 *   concepts, the selection, every revision and the final contact in Supabase;
 *   this browser owns its lead through an httpOnly session cookie it cannot read.
 *   The browser keeps a validated cache (`storage.ts`) so typing is never lost:
 *   brief edits are autosaved (debounced) and retried with backoff when the
 *   network or database is down; a reload shows the server's copy, or the cache
 *   while offline. Nothing is shown as generated unless the server returned it
 *   validated, and nothing is shown as sent unless the database accepted it.
 */
import { ArrowLeft, ArrowRight, Check, CloudOff, Loader2, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useReducedScene } from "@/components/cinematic";
import { BrowserWindow } from "@/components/home/BrowserWindow";
import {
  generateBuilderConcepts,
  getBuilderLead,
  refineBuilderConcept,
  resetBuilderSession,
  restoreBuilderRevision,
  resyncBuilderConcepts,
  saveBuilderBrief,
  selectBuilderConcept,
  submitBuilderLead,
} from "@/lib/builder/builder.functions";
import { EMPTY_BRIEF, type BriefDraft, type Contact, type Lead } from "@/lib/builder/brief";
import { BUILDER_COPY, type BuilderCopy } from "@/lib/builder/copy";
import { errorCodeOf } from "@/lib/builder/errors";
import { parseDraft, toSpec, type DesignSpec, type DesignSpecDraft } from "@/lib/builder/spec";
import {
  briefHasContent,
  clearBuilder,
  loadBuilder,
  parseLead,
  saveBuilder,
} from "@/lib/builder/storage";
import { useT, type Lang } from "@/lib/i18n";
import { AnalysisStage } from "./AnalysisStage";
import { BriefSheet } from "./BriefSheet";
import { BriefSteps, validateBriefStep, type FieldRefs } from "./BriefSteps";
import { ConceptGallery } from "./ConceptGallery";
import { ConceptViewer } from "./ConceptViewer";
import { ConfirmDialog } from "./ConfirmDialog";
import { ContactStep, type ContactDraft } from "./ContactStep";
import { ScaledPreview } from "./renderer/ScaledPreview";
import { StepRail } from "./StepRail";

const STEP_CONCEPTS = 4;
const STEP_CONTACT = 5;
const STEP_DONE = 6;

/** Autosave debounce, and the retry schedule when a save fails (ms). */
const AUTOSAVE_MS = 1000;
const RETRY_MS = [3000, 8000, 20000, 45000, 60000];

const EMPTY_CONTACT: ContactDraft = {
  name: "",
  email: "",
  company: "",
  budgetIndex: null,
  deadline: null,
  message: "",
};

type Sync = "idle" | "saving" | "saved" | "error";

const now = () => new Date().toISOString();

/** A lead that exists only in this browser until its first save. */
function localLead(lang: Lang): Lead {
  return {
    id: "local",
    schemaVersion: 2,
    lifecycle: "draft",
    lang,
    createdAt: now(),
    updatedAt: now(),
    brief: EMPTY_BRIEF,
    concepts: [],
    selectedConceptId: null,
    generationCount: 0,
    revisions: [],
    submittedAt: null,
  };
}

const stripSpec = ({
  id: _id,
  revision: _revision,
  mode: _mode,
  ...draft
}: DesignSpec): DesignSpecDraft => draft;

function messageFor(err: unknown, copy: BuilderCopy): string {
  return copy.errors[errorCodeOf(err)];
}

export function BuilderApp() {
  const { lang } = useT();
  const copy = BUILDER_COPY[lang];
  const reduced = useReducedScene();

  const [hydrated, setHydrated] = useState(false);
  const [lead, setLead] = useState<Lead>(() => localLead(lang));
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
  const [confirm, setConfirm] = useState<"regenerate" | "startOver" | null>(null);
  const [sync, setSync] = useState<Sync>("idle");
  const [notice, setNotice] = useState<string | null>(null);
  const [unsavedDrafts, setUnsavedDrafts] = useState<DesignSpecDraft[] | null>(null);
  const [savingConcepts, setSavingConcepts] = useState(false);
  const [serverLeadId, setServerLeadId] = useState<string | null>(null);

  const refs = useRef<FieldRefs>({});
  const request = useRef(0);
  const firstRender = useRef(true);
  const briefDirty = useRef(false);
  const latestBrief = useRef<BriefDraft>(EMPTY_BRIEF);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const retryIndex = useRef(0);
  const saving = useRef<Promise<boolean> | null>(null);

  latestBrief.current = lead.brief;

  /** The server's copy wins, except for words typed since the last confirmed save. */
  const applyServerLead = useCallback((server: Lead) => {
    setServerLeadId(server.id);
    setLead((prev) => ({ ...server, brief: briefDirty.current ? prev.brief : server.brief }));
  }, []);

  /* ---- autosave ------------------------------------------------------------- */
  const flushBrief = useCallback(async (): Promise<boolean> => {
    if (fixture) return true;
    if (saving.current) await saving.current;
    if (!briefDirty.current) return true;
    const brief = latestBrief.current;
    if (!briefHasContent(brief)) return true;
    const run = (async () => {
      setSync("saving");
      try {
        const res = await saveBuilderBrief({ data: { lang, brief } });
        const server = parseLead(res?.lead);
        if (!server) throw new Error("PERSISTENCE_UNAVAILABLE");
        if (latestBrief.current === brief) briefDirty.current = false;
        applyServerLead(server);
        retryIndex.current = 0;
        setSync(briefDirty.current ? "idle" : "saved");
        return true;
      } catch (err) {
        const code = errorCodeOf(err);
        setSync("error");
        if (code === "LEAD_LOCKED") {
          briefDirty.current = false;
          setNotice(copy.errors.LEAD_LOCKED);
          return false;
        }
        if (code === "RATE_LIMITED" || code === "INVALID_INPUT") setNotice(copy.errors[code]);
        const delay = RETRY_MS[Math.min(retryIndex.current, RETRY_MS.length - 1)];
        retryIndex.current += 1;
        if (saveTimer.current) clearTimeout(saveTimer.current);
        saveTimer.current = setTimeout(() => void flushBrief(), delay);
        return false;
      }
    })();
    saving.current = run;
    try {
      return await run;
    } finally {
      saving.current = null;
    }
  }, [fixture, lang, applyServerLead, copy]);

  const scheduleSave = useCallback(() => {
    if (fixture) return;
    briefDirty.current = true;
    setSync("idle");
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => void flushBrief(), AUTOSAVE_MS);
  }, [fixture, flushBrief]);

  // Back online: save what is pending right away.
  useEffect(() => {
    const onOnline = () => {
      if (briefDirty.current) void flushBrief();
    };
    window.addEventListener("online", onOnline);
    return () => window.removeEventListener("online", onOnline);
  }, [flushBrief]);

  useEffect(
    () => () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    },
    [],
  );

  /* ---- load --------------------------------------------------------------- */
  useEffect(() => {
    let cancelled = false;
    const clampStep = (s: number, l: Lead) => {
      if (s === STEP_DONE && l.lifecycle !== "submitted") s = STEP_CONTACT;
      if (s === STEP_CONTACT && !l.selectedConceptId) s = l.concepts.length ? STEP_CONCEPTS : 3;
      if (s === STEP_CONCEPTS && l.concepts.length === 0) s = 3;
      if (l.lifecycle === "submitted") s = STEP_DONE;
      return s;
    };
    (async () => {
      if (import.meta.env.DEV && new URLSearchParams(window.location.search).has("fixture")) {
        const fx = await import("@/lib/builder/fixtures.dev");
        const setB = new URLSearchParams(window.location.search).get("fixture") === "b";
        const FIXTURE_BRIEF = setB ? fx.FIXTURE_BRIEF_B : fx.FIXTURE_BRIEF;
        const FIXTURE_DRAFTS = setB ? fx.FIXTURE_DRAFTS_B : fx.FIXTURE_DRAFTS;
        const concepts = FIXTURE_DRAFTS.map((d, i) => {
          const r = parseDraft(d);
          if (!r.ok) throw new Error(`fixture ${i} invalid`);
          return toSpec(r.draft, `c-fixture-${setB ? "b" : "a"}${i + 1}`);
        });
        if (cancelled) return;
        setFixture(true);
        setLead((l) => ({ ...l, brief: FIXTURE_BRIEF, concepts, lifecycle: "concepts_ready" }));
        setStep(STEP_CONCEPTS);
        setHydrated(true);
        return;
      }

      // 1. The cache, immediately — the page is usable before the network answers.
      const cached = loadBuilder();
      if (cancelled) return;
      if (cached) {
        briefDirty.current = cached.briefDirty;
        setLead(cached.lead);
        setServerLeadId(cached.serverLeadId);
        setUnsavedDrafts(cached.unsavedDrafts);
        if (cached.contact) setContact(cached.contact);
        setStep(clampStep(cached.step, cached.lead));
        setRestored(briefHasContent(cached.lead.brief) || cached.lead.concepts.length > 0);
      }
      setHydrated(true);

      // 2. The record. The server wins; unconfirmed typing is kept and saved.
      try {
        const res = await getBuilderLead();
        if (cancelled) return;
        const server = res?.lead ? parseLead(res.lead) : null;
        if (server) {
          if (cached?.serverLeadId !== server.id) briefDirty.current = false;
          applyServerLead(server);
          // Without a cache (storage cleared), reopen where the record says the work is.
          setStep((s) =>
            clampStep(cached ? cached.step : server.concepts.length ? STEP_CONCEPTS : s, server),
          );
          setRestored(true);
          setSync("saved");
          if (briefDirty.current) void flushBrief();
        } else if (cached) {
          // No server lead for this browser (first visit after an outage, or the
          // cookie is gone): the cached work is saved as a new lead, and cached
          // concepts are offered for saving instead of silently dropped.
          if (cached.serverLeadId) {
            setServerLeadId(null);
            if (cached.lead.concepts.length === 5 && !cached.unsavedDrafts) {
              setUnsavedDrafts(cached.lead.concepts.map(stripSpec));
            }
          }
          if (briefHasContent(cached.lead.brief)) {
            briefDirty.current = true;
            void flushBrief();
          }
        }
      } catch {
        if (!cancelled) setSync(cached ? "error" : "idle");
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---- cache -------------------------------------------------------------- */
  useEffect(() => {
    if (!hydrated || fixture) return;
    saveBuilder({
      lead,
      serverLeadId,
      briefDirty: briefDirty.current,
      unsavedDrafts,
      step,
      contact,
    });
  }, [hydrated, fixture, lead, serverLeadId, unsavedDrafts, step, contact, sync]);

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

  const selected = useMemo(
    () => lead.concepts.find((c) => c.id === lead.selectedConceptId) ?? null,
    [lead.concepts, lead.selectedConceptId],
  );

  const reachable = useMemo(() => {
    if (lead.lifecycle === "submitted") return STEP_DONE;
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

  /** Concepts the model produced while the database was unreachable, shown until saved. */
  const showUnsaved = (drafts: DesignSpecDraft[]) => {
    const specs = drafts.map((d, i) => {
      const parsed = parseDraft(d);
      return parsed.ok ? toSpec(parsed.draft, `unsaved-${i + 1}`) : null;
    });
    if (specs.some((x) => !x)) throw new Error("AI_INVALID");
    setUnsavedDrafts(drafts);
    setLead((l) => ({
      ...l,
      concepts: specs as DesignSpec[],
      selectedConceptId: null,
      revisions: [],
      lifecycle: "concepts_ready",
    }));
  };

  const generate = useCallback(async () => {
    for (const s of [0, 1, 3]) {
      const errs = validateBriefStep(s, lead.brief, copy);
      if (Object.keys(errs).length > 0) {
        setStep(s);
        setErrors(errs);
        focusFirstError(errs);
        return;
      }
    }
    const brief = {
      ...lead.brief,
      references: {
        ...lead.brief.references,
        urls: lead.brief.references.urls.map((u) => u.trim()).filter(Boolean),
      },
    };
    const token = ++request.current;
    const hadConcepts = lead.concepts.length > 0;
    setStep(STEP_CONCEPTS);
    setGenError(null);
    setNotice(null);
    setGenerating(true);
    try {
      // The brief is on record before the model is asked (the server saves it again, atomically).
      const res = await generateBuilderConcepts({ data: { lang, brief } });
      if (token !== request.current) return;
      briefDirty.current = false;
      if (res && "saved" in res && res.saved) {
        const server = parseLead(res.lead);
        if (!server || server.concepts.length !== 5) throw new Error("AI_INVALID");
        setUnsavedDrafts(null);
        applyServerLead(server);
        setSync("saved");
      } else if (res && "drafts" in res) {
        showUnsaved(res.drafts);
        setSync("error");
      } else {
        throw new Error("AI_INVALID");
      }
    } catch (err) {
      if (token !== request.current) return;
      // A failed regeneration changes nothing on the server: the concepts already
      // there stay on screen, with the failure stated above them.
      if (hadConcepts) setNotice(messageFor(err, copy));
      else setGenError(messageFor(err, copy));
    } finally {
      if (token === request.current) setGenerating(false);
    }
  }, [lead.brief, lead.concepts.length, lang, copy, applyServerLead]);

  const saveUnsavedConcepts = async () => {
    if (!unsavedDrafts) return;
    setSavingConcepts(true);
    setNotice(null);
    try {
      if (!(await flushBrief())) throw new Error("PERSISTENCE_UNAVAILABLE");
      const res = await resyncBuilderConcepts({ data: { drafts: unsavedDrafts } });
      const server = parseLead(res?.lead);
      if (!server) throw new Error("PERSISTENCE_UNAVAILABLE");
      setUnsavedDrafts(null);
      applyServerLead(server);
      setSync("saved");
    } catch (err) {
      // The banner already says what is unsaved; the generic persistence message is about the brief.
      setNotice(
        errorCodeOf(err) === "PERSISTENCE_UNAVAILABLE"
          ? copy.sync.actionFailed
          : messageFor(err, copy),
      );
    } finally {
      setSavingConcepts(false);
    }
  };

  const next = () => {
    const errs = validateBriefStep(step, lead.brief, copy);
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      focusFirstError(errs);
      return;
    }
    if (step === 3) {
      if (lead.concepts.length > 0) setConfirm("regenerate");
      else void generate();
      return;
    }
    void flushBrief();
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
  const refreshFromServer = async () => {
    try {
      const res = await getBuilderLead();
      const server = res?.lead ? parseLead(res.lead) : null;
      if (server) applyServerLead(server);
    } catch {
      /* the notice already explains what happened */
    }
  };

  const select = async (id: string) => {
    if (fixture || unsavedDrafts) {
      setLead((l) => {
        const nextId = l.selectedConceptId === id ? null : id;
        return {
          ...l,
          selectedConceptId: nextId,
          lifecycle: nextId ? "direction_selected" : "concepts_ready",
        };
      });
      return;
    }
    const previous = lead.selectedConceptId;
    const nextId = previous === id ? null : id;
    setLead((l) => ({
      ...l,
      selectedConceptId: nextId,
      lifecycle: nextId ? "direction_selected" : "concepts_ready",
    }));
    setNotice(null);
    try {
      const res = await selectBuilderConcept({ data: { conceptId: nextId } });
      const server = parseLead(res?.lead);
      if (server) applyServerLead(server);
    } catch (err) {
      setLead((l) => ({
        ...l,
        selectedConceptId: previous,
        lifecycle: previous ? "direction_selected" : "concepts_ready",
      }));
      setNotice(`${copy.sync.actionFailed} ${messageFor(err, copy)}`);
    }
  };

  const refine = async (id: string, feedback: string) => {
    if (unsavedDrafts) throw new Error(copy.sync.refineNeedsSave);
    const current = lead.concepts.find((c) => c.id === id);
    if (!current) throw new Error(copy.errors.CONCEPT_NOT_FOUND);
    try {
      const res = await refineBuilderConcept({
        data: { lang, conceptId: id, feedback, expectedRevision: current.revision },
      });
      const server = parseLead(res?.lead);
      if (!server) throw new Error("AI_INVALID");
      applyServerLead(server);
      return server.concepts.find((c) => c.id === id)?.revision ?? current.revision + 1;
    } catch (err) {
      if (errorCodeOf(err) === "REVISION_CONFLICT") await refreshFromServer();
      throw new Error(messageFor(err, copy));
    }
  };

  const restore = async (id: string, version: DesignSpec) => {
    if (unsavedDrafts) return;
    setNotice(null);
    try {
      const res = await restoreBuilderRevision({
        data: { conceptId: id, target: version.revision },
      });
      const server = parseLead(res?.lead);
      if (server) applyServerLead(server);
    } catch (err) {
      setNotice(`${copy.sync.actionFailed} ${messageFor(err, copy)}`);
    }
  };

  const regenerate = () => setConfirm("regenerate");

  const toContact = () => {
    if (!selected) return;
    if (!contact.company) setContact((c) => ({ ...c, company: lead.brief.project.company }));
    setStep(STEP_CONTACT);
  };

  /* ---- submit --------------------------------------------------------------- */
  const submit = async (c: Contact) => {
    if (!selected) throw new Error("NO_SELECTION");
    if (unsavedDrafts) throw new Error("PERSISTENCE_UNAVAILABLE");
    if (!(await flushBrief())) throw new Error("PERSISTENCE_UNAVAILABLE");
    const res = await submitBuilderLead({ data: { conceptId: selected.id, contact: c } });
    const server = parseLead(res?.lead);
    if (!server || server.lifecycle !== "submitted") throw new Error("PERSISTENCE_UNAVAILABLE");
    // Only reached once the database accepted the submission.
    applyServerLead(server);
    setStep(STEP_DONE);
  };

  const startOver = async () => {
    setNotice(null);
    if (!fixture && serverLeadId) {
      try {
        await resetBuilderSession();
      } catch (err) {
        // Without the reset, new typing would land in the old lead — so do not pretend.
        setNotice(`${copy.sync.actionFailed} ${messageFor(err, copy)}`);
        return;
      }
    }
    request.current++;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    briefDirty.current = false;
    clearBuilder();
    setLead(localLead(lang));
    setServerLeadId(null);
    setUnsavedDrafts(null);
    setContact(EMPTY_CONTACT);
    setErrors({});
    setGenError(null);
    setGenerating(false);
    setViewer(null);
    setRestored(false);
    setFixture(false);
    setSync("idle");
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
            <span aria-hidden className="hidden h-px w-8 bg-white/30 sm:inline-block" />
            {copy.intro.eyebrow}
          </p>
          <div className="flex min-w-0 items-center gap-x-5">
            {!fixture && sync !== "idle" && step !== STEP_DONE && (
              <SyncStatus
                sync={sync}
                copy={copy}
                onRetry={() => void (unsavedDrafts ? saveUnsavedConcepts() : flushBrief())}
              />
            )}
            {dirty && step !== STEP_DONE && (
              <button
                type="button"
                onClick={() => setConfirm("startOver")}
                className="inline-flex min-h-11 shrink-0 items-center gap-2 text-sm whitespace-nowrap text-white/55 underline-offset-8 hover:text-white hover:underline focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
              >
                <RotateCcw className="size-3.5" aria-hidden />
                {copy.startOver}
              </button>
            )}
          </div>
        </div>

        {notice && (
          <p
            role="alert"
            className="mt-5 rounded-xl border border-[oklch(0.62_0.22_27/0.45)] bg-[oklch(0.62_0.22_27/0.08)] px-4 py-3 text-sm text-white/90"
          >
            {notice}
          </p>
        )}

        {unsavedDrafts && step === STEP_CONCEPTS && !generating && (
          <div
            role="alert"
            className="mt-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 rounded-xl border border-amber-300/35 bg-amber-300/[0.07] px-4 py-3"
          >
            <p className="flex items-center gap-2.5 text-sm text-white/90">
              <CloudOff className="size-4 shrink-0 text-amber-200" aria-hidden />
              {copy.sync.unsavedConcepts}
            </p>
            <button
              type="button"
              onClick={() => void saveUnsavedConcepts()}
              disabled={savingConcepts}
              className="btn-primary text-sm disabled:opacity-70"
            >
              {savingConcepts ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
              {savingConcepts ? copy.sync.savingConcepts : copy.sync.saveConcepts}
            </button>
          </div>
        )}

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
                    latestBrief.current = brief;
                    setLead((l) => ({ ...l, brief, updatedAt: now() }));
                    scheduleSave();
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
                languageNote={lead.lang !== lang ? copy.languageNote(lead.lang) : null}
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
              onAgain={() => void startOver()}
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
      <ConfirmDialog
        open={confirm !== null}
        title={confirm === "startOver" ? copy.startOver : copy.concepts.regenerate}
        description={
          confirm === "startOver" ? copy.startOverConfirm : copy.concepts.regenerateConfirm
        }
        confirmLabel={confirm === "startOver" ? copy.startOver : copy.concepts.regenerate}
        cancelLabel={copy.cancel}
        onCancel={() => setConfirm(null)}
        onConfirm={() => {
          const action = confirm;
          setConfirm(null);
          if (action === "startOver") void startOver();
          if (action === "regenerate") void generate();
        }}
      />
    </section>
  );
}

function SyncStatus({
  sync,
  copy,
  onRetry,
}: {
  sync: Sync;
  copy: BuilderCopy;
  onRetry: () => void;
}) {
  return (
    <p
      aria-live="polite"
      className={`items-center gap-2 text-xs text-white/50 ${sync === "error" ? "flex" : "hidden sm:flex"}`}
    >
      {sync === "saving" && (
        <>
          <Loader2 className="size-3.5 animate-spin" aria-hidden />
          {copy.sync.saving}
        </>
      )}
      {sync === "saved" && (
        <>
          <Check className="size-3.5 text-primary" aria-hidden />
          {copy.sync.saved}
        </>
      )}
      {sync === "error" && (
        <>
          <CloudOff className="size-3.5 text-amber-200" aria-hidden />
          <span className="text-white/70">{copy.sync.unsaved}</span>
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex min-h-11 items-center text-xs font-medium text-white underline underline-offset-4 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          >
            {copy.sync.retry}
          </button>
        </>
      )}
    </p>
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
