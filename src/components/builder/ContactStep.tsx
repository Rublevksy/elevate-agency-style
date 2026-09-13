/**
 * Step 06 — contact, only once a direction has been chosen.
 *
 * Contact labels, placeholders and budget ranges are the site's existing
 * `t.contact.form` strings. The submit goes through the existing contact
 * pipeline (see `lib/builder/submission.ts`); the success state is rendered by
 * the parent only after that call resolves.
 */
import { ArrowRight, Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { BrowserWindow } from "@/components/home/BrowserWindow";
import { useT } from "@/lib/i18n";
import {
  ContactSchema,
  DEADLINES,
  type BriefDraft,
  type Contact,
  type Deadline,
} from "@/lib/builder/brief";
import type { BuilderCopy } from "@/lib/builder/copy";
import type { DesignSpec } from "@/lib/builder/spec";
import { ChoiceGroup, TextField } from "./fields";
import { ScaledPreview } from "./renderer/ScaledPreview";

export type ContactDraft = {
  name: string;
  email: string;
  company: string;
  budgetIndex: number | null;
  deadline: Deadline | null;
  message: string;
};

export function ContactStep({
  brief,
  spec,
  copy,
  draft,
  onDraft,
  onChangeDirection,
  onSubmit,
}: {
  brief: BriefDraft;
  spec: DesignSpec;
  copy: BuilderCopy;
  draft: ContactDraft;
  onDraft: (d: ContactDraft) => void;
  onChangeDirection: () => void;
  /** Resolves on real success; rejects otherwise. */
  onSubmit: (contact: Contact) => Promise<void>;
}) {
  const { t } = useT();
  const f = t.contact.form;
  const c = copy.contact;
  const [errors, setErrors] = useState<Partial<Record<keyof ContactDraft, string>>>({});
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const fieldRefs = useRef<Partial<Record<keyof ContactDraft, HTMLElement | null>>>({});

  const set = <K extends keyof ContactDraft>(k: K, value: ContactDraft[K]) => {
    onDraft({ ...draft, [k]: value });
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;
    const parsed = ContactSchema.safeParse({
      ...draft,
      budgetIndex: draft.budgetIndex ?? -1,
      deadline: draft.deadline ?? "",
    });
    if (!parsed.success) {
      const next: Partial<Record<keyof ContactDraft, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof ContactDraft;
        if (next[key]) continue;
        next[key] =
          key === "email" && draft.email.trim()
            ? copy.validation.invalidEmail
            : issue.code === "too_big"
              ? copy.validation.tooLong
              : copy.validation.required;
      }
      setErrors(next);
      const first = (
        ["name", "email", "company", "budgetIndex", "deadline", "message"] as const
      ).find((k) => next[k]);
      if (first) fieldRefs.current[first]?.focus();
      return;
    }
    setSendError(null);
    setSending(true);
    try {
      await onSubmit(parsed.data);
    } catch {
      setSendError(c.sendError);
    } finally {
      setSending(false);
    }
  };

  const budgetOptions = f.budgets.map((label, i) => ({ value: String(i), label }));
  const deadlineOptions = DEADLINES.map((d) => ({ value: d, label: c.deadlines[d] }));

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-16">
      <form onSubmit={submit} noValidate aria-busy={sending}>
        <p className="label-micro flex items-center gap-3 text-white/60">
          <span aria-hidden className="h-px w-8 bg-primary" />
          {c.eyebrow}
        </p>
        <h1
          tabIndex={-1}
          data-step-heading
          className="heading-scene mt-5 max-w-[20ch] text-[clamp(2rem,1.4rem+2.2vw,3.25rem)] text-white outline-none"
        >
          {c.title}
        </h1>
        <p className="mt-4 max-w-[52ch] text-[0.9375rem] leading-relaxed text-white/65">{c.lead}</p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <TextField
            label={t.contact.name}
            value={draft.name}
            onChange={(v) => set("name", v)}
            placeholder={f.namePlaceholder}
            autoComplete="name"
            max={100}
            error={errors.name}
            inputRef={(el) => {
              fieldRefs.current.name = el;
            }}
          />
          <TextField
            label={t.contact.email}
            type="email"
            value={draft.email}
            onChange={(v) => set("email", v)}
            placeholder={f.emailPlaceholder}
            autoComplete="email"
            max={255}
            error={errors.email}
            inputRef={(el) => {
              fieldRefs.current.email = el;
            }}
          />
          <div className="sm:col-span-2">
            <TextField
              label={c.company}
              value={draft.company}
              onChange={(v) => set("company", v)}
              autoComplete="organization"
              max={80}
              error={errors.company}
              inputRef={(el) => {
                fieldRefs.current.company = el;
              }}
            />
          </div>
        </div>

        <div
          className="mt-8"
          ref={(el) => {
            fieldRefs.current.budgetIndex = el?.querySelector("input") ?? null;
          }}
        >
          <ChoiceGroup
            legend={c.budget}
            legendClassName="mb-3 text-sm font-medium text-white/85"
            name="budget"
            columns="grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
            options={budgetOptions}
            value={draft.budgetIndex === null ? null : String(draft.budgetIndex)}
            onChange={(v) => set("budgetIndex", Number(v))}
            error={errors.budgetIndex}
            render={(o, sel) => (
              <span
                className={`flex min-h-12 w-full items-center px-4 text-sm ${sel ? "text-white" : "text-white/75"}`}
              >
                {o.label}
              </span>
            )}
          />
        </div>

        <div
          className="mt-8"
          ref={(el) => {
            fieldRefs.current.deadline = el?.querySelector("input") ?? null;
          }}
        >
          <ChoiceGroup
            legend={c.deadline}
            legendClassName="mb-3 text-sm font-medium text-white/85"
            name="deadline"
            columns="grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
            options={deadlineOptions}
            value={draft.deadline}
            onChange={(v) => set("deadline", v)}
            error={errors.deadline}
            render={(o, sel) => (
              <span
                className={`flex min-h-12 w-full items-center px-4 text-sm ${sel ? "text-white" : "text-white/75"}`}
              >
                {o.label}
              </span>
            )}
          />
        </div>

        <div className="mt-8">
          <TextField
            label={c.message.label}
            optional={copy.optional}
            rows={4}
            max={1200}
            value={draft.message}
            onChange={(v) => set("message", v)}
            placeholder={c.message.placeholder}
            error={errors.message}
          />
        </div>

        {sendError && (
          <p
            role="alert"
            className="mt-6 rounded-xl border border-[oklch(0.62_0.22_27/0.5)] bg-[oklch(0.62_0.22_27/0.08)] px-4 py-3 text-sm text-white/90"
          >
            {sendError}
          </p>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
          <button type="submit" disabled={sending} className="btn-primary disabled:opacity-70">
            {sending ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <ArrowRight className="size-4" aria-hidden />
            )}
            {sending ? c.sending : c.submit}
          </button>
          <p className="text-xs text-white/50">{c.note}</p>
        </div>
      </form>

      <aside aria-label={c.selected} className="lg:sticky lg:top-32 lg:self-start">
        <p className="label-micro text-white/50">{c.selected}</p>
        <div className="mt-4">
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
        </div>
        <p className="heading-scene mt-5 text-2xl text-white">{spec.name}</p>
        <p className="mt-2 text-sm leading-relaxed text-white/60">{spec.positioning}</p>
        <button
          type="button"
          onClick={onChangeDirection}
          className="mt-4 inline-flex min-h-11 items-center text-sm font-medium text-white/75 underline-offset-8 hover:text-white hover:underline focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
        >
          {c.change}
        </button>
      </aside>
    </div>
  );
}
