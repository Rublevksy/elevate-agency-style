/**
 * "Open concept" — one direction at full size, with refinement beside it.
 *
 * A real modal dialog (Radix: focus is trapped, Escape closes, focus returns to
 * the control that opened it). The preview is the whole concept page, at a
 * laptop width scaled to fit, or at a true 390px phone width where the
 * renderer switches to its phone layout by container query.
 *
 * Refinement sends natural-language feedback with the current DesignSpec to
 * the server, which returns a revised, re-validated spec; the renderer draws
 * that. Every accepted version is kept, and any earlier one can be restored.
 */
import * as Dialog from "@radix-ui/react-dialog";
import { Check, Loader2, Monitor, RotateCcw, Smartphone, Wand2, X } from "lucide-react";
import { useRef, useState } from "react";
import { BrowserWindow } from "@/components/home/BrowserWindow";
import type { BriefDraft, Revision } from "@/lib/builder/brief";
import type { BuilderCopy } from "@/lib/builder/copy";
import type { DesignSpec } from "@/lib/builder/spec";
import { ConceptRenderer } from "./renderer/ConceptRenderer";
import { ScaledPreview } from "./renderer/ScaledPreview";
import { HeroGlyph, Swatches, TypeSample } from "./SpecSummary";

export function ConceptViewer({
  spec,
  index,
  total,
  brief,
  copy,
  revisions,
  selected,
  focusRefine,
  reduced,
  onClose,
  onSelect,
  onRefine,
  onRestore,
  returnFocus,
}: {
  spec: DesignSpec;
  index: number;
  total: number;
  brief: BriefDraft;
  copy: BuilderCopy;
  revisions: Revision[];
  selected: boolean;
  focusRefine: boolean;
  reduced: boolean;
  onClose: () => void;
  onSelect: () => void;
  /** Resolves when the revised spec is in place; rejects with a user-facing message. */
  onRefine: (feedback: string) => Promise<number>;
  onRestore: (version: DesignSpec) => void;
  /** Where focus goes back to when the dialog closes (the control that opened it). */
  returnFocus?: HTMLElement | null;
}) {
  const v = copy.viewer;
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [feedback, setFeedback] = useState("");
  const [refining, setRefining] = useState(false);
  const [error, setError] = useState<{ kind: "invalid" | "failed"; message: string } | null>(null);
  const [announce, setAnnounce] = useState("");
  const refineRef = useRef<HTMLTextAreaElement>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = feedback.trim();
    if (text.length < 3 || refining) {
      if (text.length < 3) setError({ kind: "invalid", message: copy.validation.tooShort });
      return;
    }
    setError(null);
    setRefining(true);
    try {
      const revision = await onRefine(text);
      setFeedback("");
      setAnnounce(v.revision(revision));
    } catch (err) {
      setError({ kind: "failed", message: (err as Error).message });
    } finally {
      setRefining(false);
    }
  };

  // Versions of this concept, oldest first: the original, then each accepted revision.
  const versions: { spec: DesignSpec; label: string; feedback: string }[] =
    revisions.length > 0
      ? [
          { spec: revisions[0].before, label: v.original, feedback: "" },
          ...revisions.map((r) => ({
            spec: r.after,
            label: r.feedback ? v.revision(r.after.revision) : v.reverted,
            feedback: r.feedback,
          })),
        ]
      : [];

  const n = String(index + 1).padStart(2, "0");

  return (
    <Dialog.Root open onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[80] bg-black/70" />
        <Dialog.Content
          onOpenAutoFocus={(e) => {
            if (focusRefine) {
              e.preventDefault();
              refineRef.current?.focus();
            }
          }}
          onCloseAutoFocus={(e) => {
            if (returnFocus?.isConnected) {
              e.preventDefault();
              returnFocus.focus();
            }
          }}
          className="fixed inset-0 z-[80] flex flex-col bg-[#0A0D13] text-white outline-none"
        >
          <div className="flex h-16 shrink-0 items-center gap-4 border-b border-white/10 px-4 md:px-8">
            <p className="label-micro hidden text-white/50 tabular-nums sm:block">
              <span className="text-primary">{n}</span> / {String(total).padStart(2, "0")}
            </p>
            <Dialog.Title className="heading-scene min-w-0 truncate text-lg text-white md:text-xl">
              {spec.name}
            </Dialog.Title>
            <Dialog.Description className="sr-only">{spec.positioning}</Dialog.Description>

            <div
              role="radiogroup"
              aria-label={`${v.desktop} / ${v.mobile}`}
              className="ml-auto flex rounded-full border border-white/12 p-1"
            >
              {(["desktop", "mobile"] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  role="radio"
                  aria-checked={device === d}
                  onClick={() => setDevice(d)}
                  className={`inline-flex min-h-9 items-center gap-2 rounded-full px-3 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none ${
                    device === d ? "bg-white/12 text-white" : "text-white/60 hover:text-white"
                  }`}
                >
                  {d === "desktop" ? (
                    <Monitor className="size-4" aria-hidden />
                  ) : (
                    <Smartphone className="size-4" aria-hidden />
                  )}
                  <span className="sr-only sm:not-sr-only">
                    {d === "desktop" ? v.desktop : v.mobile}
                  </span>
                </button>
              ))}
            </div>
            <Dialog.Close
              aria-label={v.close}
              className="grid size-11 shrink-0 place-items-center rounded-full text-white/70 hover:bg-white/8 hover:text-white focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
            >
              <X className="size-5" aria-hidden />
            </Dialog.Close>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto lg:grid lg:grid-cols-[minmax(0,1fr)_26rem] lg:overflow-hidden">
            {/* Preview */}
            {/* Scrollable on its own at lg, so it is a keyboard stop — named, not anonymous. */}
            <div
              role="region"
              aria-label={`${spec.name} — ${v.placeholderNote}`}
              tabIndex={0}
              className="bg-[#070a10] px-4 py-6 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset md:px-8 md:py-8 lg:overflow-y-auto"
            >
              {device === "desktop" ? (
                <BrowserWindow address="elevateit.cz/builder">
                  <ScaledPreview
                    key={`${spec.id}-${spec.revision}`}
                    spec={spec}
                    brand={brief.project.company}
                    tagline={brief.project.industry}
                    copy={copy.renderer}
                    width={1280}
                    animate={!reduced}
                  />
                </BrowserWindow>
              ) : (
                <div className="mx-auto w-full max-w-[390px] overflow-hidden rounded-[2.4rem] border-[6px] border-[#1a1f2b] bg-black shadow-[0_40px_90px_-30px_oklch(0_0_0/0.9)]">
                  <div
                    aria-hidden
                    className="h-[min(76svh,780px)] overflow-y-auto overscroll-contain"
                  >
                    <ConceptRenderer
                      key={`${spec.id}-${spec.revision}`}
                      spec={spec}
                      brand={brief.project.company}
                      tagline={brief.project.industry}
                      copy={copy.renderer}
                      animate={!reduced}
                    />
                  </div>
                </div>
              )}
              <p className="mt-4 text-center text-xs text-white/45">{v.placeholderNote}</p>
            </div>

            {/* Panel */}
            <div className="border-t border-white/10 px-5 py-7 md:px-8 lg:overflow-y-auto lg:border-t-0 lg:border-l">
              <section>
                <h2 className="label-micro text-white/50">{v.positioning}</h2>
                <p className="mt-3 text-base leading-relaxed text-white/90">{spec.positioning}</p>
              </section>
              <section className="mt-7">
                <h2 className="label-micro text-white/50">{v.rationale}</h2>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-white/70">
                  {spec.rationale}
                </p>
              </section>

              <section className="mt-7 border-t border-white/10 pt-6">
                <h2 className="label-micro text-white/50">{v.system}</h2>
                <dl className="mt-4 space-y-4">
                  <div className="grid grid-cols-[6.5rem_1fr] items-center gap-3">
                    <dt className="text-xs text-white/50">{v.palette}</dt>
                    <dd className="m-0 flex flex-wrap items-center gap-3">
                      <Swatches spec={spec} size="lg" />
                      <span className="font-mono text-xs text-white/50">
                        {spec.palette.background} · {spec.palette.accent}
                      </span>
                    </dd>
                  </div>
                  <div className="grid grid-cols-[6.5rem_1fr] items-center gap-3">
                    <dt className="text-xs text-white/50">{v.typography}</dt>
                    <dd className="m-0">
                      <TypeSample spec={spec} />
                    </dd>
                  </div>
                  <div className="grid grid-cols-[6.5rem_1fr] items-center gap-3">
                    <dt className="text-xs text-white/50">{v.layout}</dt>
                    <dd className="m-0 flex flex-wrap items-center gap-2">
                      <HeroGlyph hero={spec.layout.hero} />
                      {spec.keywords.map((k) => (
                        <span
                          key={k}
                          className="rounded-full border border-white/12 px-2.5 py-0.5 text-xs text-white/65"
                        >
                          {k}
                        </span>
                      ))}
                    </dd>
                  </div>
                </dl>
              </section>

              <section className="mt-7 border-t border-white/10 pt-6">
                <h2 className="label-micro flex items-center gap-2 text-white/50">
                  <Wand2 className="size-3.5 text-primary" aria-hidden />
                  {v.refineTitle}
                </h2>
                <form onSubmit={submit} className="mt-4" aria-busy={refining}>
                  <label htmlFor="refine-feedback" className="text-sm font-medium text-white/85">
                    {v.refineLabel}
                  </label>
                  <textarea
                    id="refine-feedback"
                    ref={refineRef}
                    rows={3}
                    maxLength={600}
                    value={feedback}
                    disabled={refining}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder={v.refinePlaceholder}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? "refine-error" : undefined}
                    className="mt-2 w-full resize-y rounded-xl border border-white/12 bg-white/[0.035] px-4 py-3 text-[0.9375rem] leading-relaxed text-white outline-none placeholder:text-white/35 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/40 disabled:opacity-60"
                  />
                  {error && (
                    <p
                      id="refine-error"
                      role="alert"
                      className="mt-2 text-sm text-[oklch(0.72_0.19_27)]"
                    >
                      {error.kind === "failed"
                        ? `${v.refineError}: ${error.message}`
                        : error.message}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={refining}
                    className="btn-primary mt-3 text-sm disabled:opacity-70"
                  >
                    {refining ? (
                      <Loader2 className="size-4 animate-spin" aria-hidden />
                    ) : (
                      <Wand2 className="size-4" aria-hidden />
                    )}
                    {refining ? v.refining : v.refineSubmit}
                  </button>
                  <p aria-live="polite" className="sr-only">
                    {announce}
                  </p>
                </form>
              </section>

              {versions.length > 0 && (
                <section className="mt-7 border-t border-white/10 pt-6">
                  <h2 className="label-micro text-white/50">{v.revisions}</h2>
                  <ol className="mt-4 space-y-3">
                    {versions.map((ver, k) => {
                      const current = k === versions.length - 1;
                      return (
                        <li
                          key={`${ver.spec.revision}-${k}`}
                          className="flex items-start gap-3 rounded-xl border border-white/8 p-3"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="text-sm text-white/85">{ver.label}</p>
                            {ver.feedback && (
                              <p className="mt-1 line-clamp-2 text-xs text-white/50">
                                “{ver.feedback}”
                              </p>
                            )}
                          </div>
                          {current ? (
                            <span className="label-micro shrink-0 text-primary">{v.current}</span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => onRestore(ver.spec)}
                              disabled={refining}
                              className="inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-full border border-white/12 px-3 text-xs text-white/75 hover:text-white focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none disabled:opacity-50"
                            >
                              <RotateCcw className="size-3.5" aria-hidden />
                              {v.revert}
                            </button>
                          )}
                        </li>
                      );
                    })}
                  </ol>
                </section>
              )}

              <div className="sticky bottom-0 -mx-5 mt-8 border-t border-white/10 bg-[#0A0D13]/95 px-5 py-4 backdrop-blur md:-mx-8 md:px-8">
                <button
                  type="button"
                  aria-pressed={selected}
                  onClick={onSelect}
                  className={
                    selected
                      ? "inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-[0.625rem] border border-primary bg-primary/15 px-5 text-sm font-semibold text-white focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                      : "btn-primary w-full justify-center text-sm"
                  }
                >
                  {selected && <Check className="size-4" aria-hidden />}
                  {selected ? copy.concepts.selected : copy.concepts.select}
                </button>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
