/**
 * Steps 01–04: the brief. Each step asks one question in real type, with the
 * visitor's own words as the only content. Validation runs on "Continue",
 * never while typing; errors sit under their fields and the first invalid
 * field takes focus.
 */
import { Plus, Trash2 } from "lucide-react";
import type { ReactNode } from "react";
import {
  BriefSchema,
  PROJECT_TYPES,
  referenceUrl,
  type BriefDraft,
  type ProjectType,
} from "@/lib/builder/brief";
import type { BuilderCopy } from "@/lib/builder/copy";
import { ChoiceGroup, SuggestionChips, TextField } from "./fields";

export type FieldErrors = Record<string, string>;
export type FieldRefs = Record<string, HTMLElement | null>;

const MAX_URLS = 5;

/** Errors for one brief step, keyed by field path ("project.company", "references.urls.2"). */
export function validateBriefStep(step: number, brief: BriefDraft, copy: BuilderCopy): FieldErrors {
  const v = copy.validation;
  const errors: FieldErrors = {};
  if (step === 0 && !brief.projectType) errors.projectType = v.required;
  if (step === 1) {
    const parsed = BriefSchema.shape.project.safeParse(brief.project);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const key = `project.${issue.path[0] as string}`;
        if (errors[key]) continue;
        const value = brief.project[issue.path[0] as keyof BriefDraft["project"]].trim();
        errors[key] = issue.code === "too_big" ? v.tooLong : value ? v.tooShort : v.required;
      }
    }
  }
  if (step === 3) {
    brief.references.urls.forEach((url, i) => {
      if (!url.trim()) return;
      const parsed = referenceUrl.safeParse(url);
      if (!parsed.success) errors[`references.urls.${i}`] = v.invalidUrl;
    });
  }
  return errors;
}

function TypeGlyph({ type }: { type: ProjectType }) {
  const line = "border border-current";
  return (
    <span
      aria-hidden
      className="relative block h-14 w-20 text-white/35 transition-colors duration-300 group-has-[:checked]:text-primary"
    >
      {type === "web" && (
        <span className={`absolute inset-0 rounded-[5px] ${line}`}>
          <span className="absolute inset-x-0 top-[22%] h-px bg-current" />
          <span className="absolute top-[38%] left-[12%] h-[12%] w-[46%] rounded-[2px] bg-current" />
          <span className="absolute top-[58%] left-[12%] h-[8%] w-[30%] rounded-[2px] bg-current opacity-60" />
        </span>
      )}
      {type === "eshop" && (
        <span className="absolute inset-0 grid grid-cols-3 gap-1.5">
          {[0, 1, 2, 3, 4, 5].map((k) => (
            <span key={k} className={`rounded-[3px] ${line} ${k === 1 ? "bg-current/30" : ""}`} />
          ))}
        </span>
      )}
      {type === "app" && (
        <>
          <span className={`absolute top-0 left-[30%] h-full w-[40%] rounded-[7px] ${line}`} />
          <span className="absolute top-[26%] left-[38%] h-[10%] w-[24%] rounded-[2px] bg-current" />
          <span className="absolute top-[44%] left-[38%] h-[26%] w-[24%] rounded-[2px] bg-current opacity-50" />
        </>
      )}
      {type === "branding" && (
        <>
          <span className={`absolute top-[8%] left-[6%] size-11 rounded-full ${line}`} />
          <span className="absolute top-[30%] left-[62%] h-[10%] w-[36%] rounded-[2px] bg-current" />
          <span className="absolute top-[52%] left-[62%] h-[8%] w-[26%] rounded-[2px] bg-current opacity-60" />
        </>
      )}
    </span>
  );
}

function StepHeading({
  as: Tag = "h1",
  title,
  lead,
}: {
  as?: "h1" | "h2";
  title: string;
  lead?: string;
}) {
  return (
    <div>
      <Tag
        tabIndex={-1}
        data-step-heading
        className="heading-scene max-w-[22ch] text-[clamp(1.9rem,1.3rem+2vw,3rem)] text-white outline-none"
      >
        {title}
      </Tag>
      {lead && (
        <p className="mt-4 max-w-[54ch] text-[0.9375rem] leading-relaxed text-white/60">{lead}</p>
      )}
    </div>
  );
}

export function BriefSteps({
  step,
  brief,
  onChange,
  errors,
  refs,
  copy,
  restoredNote,
}: {
  step: number;
  brief: BriefDraft;
  onChange: (b: BriefDraft) => void;
  errors: FieldErrors;
  refs: React.MutableRefObject<FieldRefs>;
  copy: BuilderCopy;
  restoredNote?: ReactNode;
}) {
  const reg = (key: string) => (el: HTMLElement | null) => {
    refs.current[key] = el;
  };
  const project = (k: keyof BriefDraft["project"], v: string) =>
    onChange({ ...brief, project: { ...brief.project, [k]: v } });
  const visual = (k: keyof BriefDraft["visual"], v: string) =>
    onChange({ ...brief, visual: { ...brief.visual, [k]: v } });

  if (step === 0) {
    return (
      <div>
        <h1
          tabIndex={-1}
          data-step-heading
          className="heading-scene max-w-[16ch] text-[clamp(2.25rem,1.4rem+3.4vw,4.25rem)] text-white outline-none"
        >
          {copy.intro.title}
        </h1>
        <p className="mt-5 max-w-[52ch] text-base leading-relaxed text-white/65">
          {copy.intro.lead}
        </p>
        {restoredNote}
        <div
          className="mt-12"
          ref={(el) => {
            refs.current.projectType = el?.querySelector("input") ?? null;
          }}
        >
          <h2 className="text-lg font-semibold text-white">{copy.type.title}</h2>
          <div className="mt-5">
            <ChoiceGroup<ProjectType>
              legend={copy.type.title}
              name="projectType"
              options={PROJECT_TYPES.map((p) => ({ value: p, label: copy.type.options[p].label }))}
              value={brief.projectType}
              onChange={(p) => onChange({ ...brief, projectType: p })}
              error={errors.projectType}
              render={(o, selected, i) => (
                <span className="flex w-full items-center gap-5 p-5">
                  <TypeGlyph type={o.value} />
                  <span className="min-w-0">
                    <span className="label-micro block text-white/40 tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`font-display mt-1 block text-xl font-extrabold tracking-tight ${selected ? "text-white" : "text-white/90"}`}
                    >
                      {o.label}
                    </span>
                    <span className="mt-1 block text-sm text-white/55">
                      {copy.type.options[o.value].hint}
                    </span>
                  </span>
                </span>
              )}
            />
          </div>
        </div>
      </div>
    );
  }

  if (step === 1) {
    const p = copy.project;
    return (
      <div>
        <StepHeading title={p.title} lead={p.lead} />
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <TextField
            label={p.company.label}
            placeholder={p.company.placeholder}
            value={brief.project.company}
            onChange={(v) => project("company", v)}
            max={80}
            autoComplete="organization"
            error={errors["project.company"]}
            inputRef={reg("project.company")}
          />
          <TextField
            label={p.industry.label}
            placeholder={p.industry.placeholder}
            value={brief.project.industry}
            onChange={(v) => project("industry", v)}
            max={80}
            error={errors["project.industry"]}
            inputRef={reg("project.industry")}
          />
          <div className="sm:col-span-2">
            <TextField
              label={p.offering.label}
              placeholder={p.offering.placeholder}
              value={brief.project.offering}
              onChange={(v) => project("offering", v)}
              rows={4}
              max={600}
              error={errors["project.offering"]}
              inputRef={reg("project.offering")}
            />
          </div>
          <TextField
            label={p.audience.label}
            placeholder={p.audience.placeholder}
            value={brief.project.audience}
            onChange={(v) => project("audience", v)}
            rows={3}
            max={300}
            error={errors["project.audience"]}
            inputRef={reg("project.audience")}
          />
          <TextField
            label={p.goal.label}
            placeholder={p.goal.placeholder}
            value={brief.project.goal}
            onChange={(v) => project("goal", v)}
            rows={3}
            max={300}
            error={errors["project.goal"]}
            inputRef={reg("project.goal")}
          />
        </div>
      </div>
    );
  }

  if (step === 2) {
    const vs = copy.visual;
    return (
      <div>
        <StepHeading title={vs.title} lead={vs.lead} />
        <div className="mt-10 space-y-8">
          <div className="space-y-3">
            <TextField
              label={vs.style.label}
              optional={copy.optional}
              placeholder={vs.style.placeholder}
              value={brief.visual.style}
              onChange={(v) => visual("style", v)}
              max={300}
            />
            <SuggestionChips
              label={`${vs.chipsLabel}: ${vs.style.label}`}
              options={vs.styleChips}
              value={brief.visual.style}
              onChange={(v) => visual("style", v.slice(0, 300))}
            />
          </div>
          <div className="space-y-3">
            <TextField
              label={vs.mood.label}
              optional={copy.optional}
              placeholder={vs.mood.placeholder}
              value={brief.visual.mood}
              onChange={(v) => visual("mood", v)}
              max={200}
            />
            <SuggestionChips
              label={`${vs.chipsLabel}: ${vs.mood.label}`}
              options={vs.moodChips}
              value={brief.visual.mood}
              onChange={(v) => visual("mood", v.slice(0, 200))}
            />
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <TextField
              label={vs.colors.label}
              optional={copy.optional}
              placeholder={vs.colors.placeholder}
              value={brief.visual.colors}
              onChange={(v) => visual("colors", v)}
              max={200}
            />
            <TextField
              label={vs.typography.label}
              optional={copy.optional}
              placeholder={vs.typography.placeholder}
              value={brief.visual.typography}
              onChange={(v) => visual("typography", v)}
              max={200}
            />
          </div>
          <TextField
            label={vs.notes.label}
            optional={copy.optional}
            placeholder={vs.notes.placeholder}
            value={brief.visual.notes}
            onChange={(v) => visual("notes", v)}
            rows={4}
            max={800}
          />
        </div>
      </div>
    );
  }

  // step 3 — references
  const r = copy.references;
  const urls = brief.references.urls.length > 0 ? brief.references.urls : [""];
  const setUrls = (next: string[]) =>
    onChange({ ...brief, references: { ...brief.references, urls: next } });
  return (
    <div>
      <StepHeading title={r.title} lead={r.lead} />
      <div className="mt-10 space-y-8">
        <div className="space-y-4">
          {urls.map((url, i) => (
            <div key={i} className="flex items-end gap-3">
              <div className="min-w-0 flex-1">
                <TextField
                  label={urls.length > 1 ? `${r.url.label} ${i + 1}` : r.url.label}
                  optional={copy.optional}
                  type="url"
                  placeholder={r.url.placeholder}
                  value={url}
                  max={200}
                  onChange={(v) => setUrls(urls.map((u, k) => (k === i ? v : u)))}
                  error={errors[`references.urls.${i}`]}
                  inputRef={reg(`references.urls.${i}`)}
                />
              </div>
              {urls.length > 1 && (
                <button
                  type="button"
                  onClick={() => setUrls(urls.filter((_, k) => k !== i))}
                  aria-label={`${r.remove} ${i + 1}`}
                  className={`grid size-12 shrink-0 place-items-center rounded-xl border border-white/12 text-white/60 hover:text-white focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none ${errors[`references.urls.${i}`] ? "mb-7" : ""}`}
                >
                  <Trash2 className="size-4" aria-hidden />
                </button>
              )}
            </div>
          ))}
          {urls.length < MAX_URLS && (
            <button
              type="button"
              onClick={() => setUrls([...urls, ""])}
              className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-white/75 underline-offset-8 hover:text-white hover:underline focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
            >
              <Plus className="size-4" aria-hidden />
              {r.add}
            </button>
          )}
          <p className="text-xs leading-relaxed text-white/50">{r.urlNote}</p>
        </div>
        <TextField
          label={r.notes.label}
          optional={copy.optional}
          placeholder={r.notes.placeholder}
          value={brief.references.notes}
          onChange={(v) => onChange({ ...brief, references: { ...brief.references, notes: v } })}
          rows={4}
          max={800}
        />
        <p className="text-xs leading-relaxed text-white/50">{r.imagesNote}</p>
      </div>
    </div>
  );
}
