/**
 * The Builder's form vocabulary. Native controls only — inputs, textareas and
 * radio inputs — so keyboard behaviour (Tab, arrow keys inside a radio group,
 * Space/Enter) is the browser's own, and every control has a real <label>,
 * an optional hint and an error wired through `aria-describedby`.
 */
import { useId, type ReactNode } from "react";
import { Check } from "lucide-react";

const control =
  "w-full rounded-xl border bg-white/[0.035] px-4 py-3 text-[0.9375rem] leading-relaxed text-white placeholder:text-white/35 outline-none transition-colors duration-300 focus-visible:border-primary focus-visible:bg-white/[0.06] focus-visible:ring-2 focus-visible:ring-primary/40";

export function FieldShell({
  id,
  label,
  optional,
  hint,
  error,
  children,
  counter,
}: {
  id: string;
  label: string;
  optional?: string;
  hint?: string;
  error?: string;
  counter?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-sm font-medium text-white/85">
          {label}
          {optional && <span className="ml-2 text-xs font-normal text-white/45">{optional}</span>}
        </label>
        {counter && <span className="text-xs tabular-nums text-white/40">{counter}</span>}
      </div>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-xs leading-relaxed text-white/50">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-sm text-[oklch(0.72_0.19_27)]">
          {error}
        </p>
      )}
    </div>
  );
}

type TextProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  optional?: string;
  hint?: string;
  error?: string;
  max?: number;
  rows?: number;
  type?: "text" | "email" | "url";
  autoComplete?: string;
  inputRef?: (el: HTMLInputElement | HTMLTextAreaElement | null) => void;
  name?: string;
};

export function TextField(props: TextProps) {
  const id = useId();
  const describedBy = props.error ? `${id}-error` : props.hint ? `${id}-hint` : undefined;
  const counter =
    props.max && props.rows && props.value.length > props.max * 0.7
      ? `${props.value.length} / ${props.max}`
      : undefined;
  const border = props.error
    ? "border-[oklch(0.62_0.22_27)]"
    : "border-white/12 hover:border-white/25";
  return (
    <FieldShell
      id={id}
      label={props.label}
      optional={props.optional}
      hint={props.hint}
      error={props.error}
      counter={counter}
    >
      {props.rows ? (
        <textarea
          id={id}
          name={props.name}
          ref={props.inputRef}
          rows={props.rows}
          value={props.value}
          maxLength={props.max}
          placeholder={props.placeholder}
          aria-invalid={props.error ? true : undefined}
          aria-describedby={describedBy}
          onChange={(e) => props.onChange(e.target.value)}
          className={`${control} ${border} resize-y`}
        />
      ) : (
        <input
          id={id}
          name={props.name}
          ref={props.inputRef}
          type={props.type ?? "text"}
          value={props.value}
          maxLength={props.max}
          placeholder={props.placeholder}
          autoComplete={props.autoComplete}
          aria-invalid={props.error ? true : undefined}
          aria-describedby={describedBy}
          onChange={(e) => props.onChange(e.target.value)}
          className={`${control} ${border}`}
        />
      )}
    </FieldShell>
  );
}

/** Suggestions that append to a free-text field — a vocabulary for visitors who are not designers. */
export function SuggestionChips({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  const parts = value
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);
  const has = (o: string) => parts.some((p) => p.toLocaleLowerCase() === o.toLocaleLowerCase());
  const toggle = (o: string) => {
    const next = has(o)
      ? parts.filter((p) => p.toLocaleLowerCase() !== o.toLocaleLowerCase())
      : [...parts, o];
    onChange(next.join(", "));
  };
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = has(o);
        return (
          <button
            key={o}
            type="button"
            aria-pressed={on}
            onClick={() => toggle(o)}
            className={`inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3.5 text-sm transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0D13] focus-visible:outline-none ${
              on
                ? "border-primary/70 bg-primary/15 text-white"
                : "border-white/12 text-white/65 hover:border-white/30 hover:text-white"
            }`}
          >
            {on && <Check className="size-3.5" aria-hidden />}
            {o}
          </button>
        );
      })}
    </div>
  );
}

/**
 * A radio group drawn as choices. The radio inputs are real (visually hidden,
 * not display:none), so arrow keys move the selection and screen readers
 * announce "radio, 2 of 4".
 */
export function ChoiceGroup<T extends string>({
  legend,
  legendClassName = "sr-only",
  name,
  options,
  value,
  onChange,
  error,
  columns = "sm:grid-cols-2",
  render,
}: {
  legend: string;
  legendClassName?: string;
  name: string;
  options: readonly { value: T; label: string }[];
  value: T | null;
  onChange: (v: T) => void;
  error?: string;
  columns?: string;
  render?: (option: { value: T; label: string }, selected: boolean, index: number) => ReactNode;
}) {
  const id = useId();
  return (
    <fieldset
      aria-describedby={error ? `${id}-error` : undefined}
      className="m-0 min-w-0 border-0 p-0"
    >
      <legend className={legendClassName}>{legend}</legend>
      <div className={`grid gap-3 ${columns}`}>
        {options.map((o, i) => {
          const selected = value === o.value;
          return (
            <label
              key={o.value}
              className={`group relative flex cursor-pointer rounded-2xl border transition-colors duration-300 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-[#0A0D13] ${
                selected
                  ? "border-primary/70 bg-primary/[0.09]"
                  : "border-white/10 bg-white/[0.02] hover:border-white/25 hover:bg-white/[0.04]"
              }`}
            >
              <input
                type="radio"
                name={name}
                value={o.value}
                checked={selected}
                onChange={() => onChange(o.value)}
                className="sr-only"
              />
              {render ? (
                render(o, selected, i)
              ) : (
                <span className="px-4 py-3 text-sm">{o.label}</span>
              )}
            </label>
          );
        })}
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-3 text-sm text-[oklch(0.72_0.19_27)]">
          {error}
        </p>
      )}
    </fieldset>
  );
}
