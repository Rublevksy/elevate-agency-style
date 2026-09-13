/**
 * Step 05 while the model works — and, if it fails, the honest account of it.
 *
 * Nothing here pretends to measure progress. The four activities are what the
 * request is doing, all at once, each with the same indeterminate "working"
 * line; nothing ticks off, nothing counts to 100. In THE WINDOW, five page
 * outlines keep being drafted, labelled with the visitor's own words. When the
 * answer arrives the step simply becomes the concepts; when it fails, this
 * becomes the error, the retry, and the brief left intact.
 */
import { Link } from "@tanstack/react-router";
import { AlertTriangle, ArrowRight, RotateCcw } from "lucide-react";
import { BrowserWindow } from "@/components/home/BrowserWindow";
import type { BriefDraft } from "@/lib/builder/brief";
import type { BuilderCopy } from "@/lib/builder/copy";

const line = "border border-dashed border-[oklch(0.72_0.16_250/0.5)]";

export function AnalysisStage({
  brief,
  copy,
  error,
  onRetry,
  onEdit,
}: {
  brief: BriefDraft;
  copy: BuilderCopy;
  /** Error message, when the request failed. */
  error: string | null;
  onRetry: () => void;
  onEdit: () => void;
}) {
  const a = copy.analysis;
  const words = [
    brief.project.company,
    brief.project.industry,
    brief.project.audience,
    brief.project.goal,
  ].filter(Boolean);

  return (
    <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16">
      <div>
        {error ? (
          <div role="alert">
            <p className="label-micro flex items-center gap-3 text-[oklch(0.72_0.19_27)]">
              <AlertTriangle className="size-4" aria-hidden />
              {a.eyebrow}
            </p>
            <h1
              tabIndex={-1}
              data-step-heading
              className="heading-scene mt-5 text-[clamp(2rem,1.4rem+2.2vw,3.25rem)] text-white outline-none"
            >
              {copy.failure.title}
            </h1>
            <p className="mt-5 max-w-[46ch] leading-relaxed text-white/75">{error}</p>
            <p className="mt-2 text-sm text-white/50">{copy.failure.kept}</p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <button type="button" onClick={onRetry} className="btn-primary">
                <RotateCcw className="size-4" aria-hidden />
                {copy.failure.retry}
              </button>
              <button
                type="button"
                onClick={onEdit}
                className="inline-flex min-h-11 items-center text-sm font-medium text-white/80 underline-offset-8 hover:text-white hover:underline focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
              >
                {copy.failure.editBrief}
              </button>
              <Link
                to="/contact"
                className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-white/60 underline-offset-8 hover:text-white hover:underline"
              >
                {copy.failure.direct}
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
          </div>
        ) : (
          <div aria-live="polite" aria-busy="true">
            <p className="label-micro flex items-center gap-3 text-white/60">
              <span aria-hidden className="h-px w-8 bg-primary" />
              {a.eyebrow}
            </p>
            <h1
              tabIndex={-1}
              data-step-heading
              className="heading-scene mt-5 text-[clamp(2rem,1.4rem+2.2vw,3.25rem)] text-white outline-none"
            >
              {a.title}
            </h1>
            <ul className="mt-9 space-y-5">
              {a.activities.map((activity) => (
                <li key={activity} className="grid grid-cols-[3rem_1fr] items-center gap-5">
                  <span aria-hidden className="builder-working block h-px bg-white/15" />
                  <span className="text-[0.9375rem] text-white/80">{activity}</span>
                </li>
              ))}
            </ul>
            <p className="mt-9 max-w-[44ch] text-sm leading-relaxed text-white/50">{a.note}</p>
          </div>
        )}
      </div>

      <div aria-hidden className={error ? "opacity-45 saturate-50" : undefined}>
        <BrowserWindow address="elevateit.cz/builder">
          <div className="relative aspect-[16/11] overflow-hidden bg-[#0a0f1b] [container-type:inline-size]">
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  "linear-gradient(oklch(0.72 0.16 250 / 0.08) 1px, transparent 1px), linear-gradient(90deg, oklch(0.72 0.16 250 / 0.08) 1px, transparent 1px)",
                backgroundSize: "4cqw 4cqw",
              }}
            />
            <div className="absolute inset-[5%] grid grid-cols-5 gap-[2.2cqw]">
              {[0, 1, 2, 3, 4].map((k) => (
                <div
                  key={k}
                  className={`flex flex-col gap-[1.6cqw] ${error ? "" : "builder-draft"}`}
                  style={{ animationDelay: `${k * 0.45}s` }}
                >
                  <div className={`h-[3cqw] rounded-[0.6cqw] ${line}`} />
                  <div
                    className={`flex-[1.2] rounded-[0.6cqw] ${line} bg-[oklch(0.72_0.16_250/0.08)]`}
                  />
                  <div className="space-y-[0.9cqw]">
                    <div className="h-[0.9cqw] w-[85%] rounded-full bg-white/25" />
                    <div className="h-[0.9cqw] w-[60%] rounded-full bg-white/15" />
                  </div>
                  <div className={`flex-1 rounded-[0.6cqw] ${line}`} />
                  <div
                    className={`h-[2.4cqw] w-[55%] rounded-[0.5cqw] ${k % 2 ? line : "bg-primary/50"}`}
                  />
                </div>
              ))}
            </div>
            {words.length > 0 && (
              <div className="absolute inset-x-[5%] bottom-[4%] flex flex-wrap gap-[1cqw]">
                {words.slice(0, 4).map((w) => (
                  <span
                    key={w}
                    className="max-w-[40%] truncate rounded-full border border-white/15 bg-[#0a0f1b]/90 px-[1.4cqw] py-[0.5cqw] text-[1.5cqw] text-white/70"
                  >
                    {w}
                  </span>
                ))}
              </div>
            )}
          </div>
        </BrowserWindow>
      </div>
    </div>
  );
}
