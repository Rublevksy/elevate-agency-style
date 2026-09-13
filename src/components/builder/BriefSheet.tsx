/**
 * The brief, as it is being written — a document, not a dashboard card. Every
 * row is the visitor's own words, so they can see exactly what ELEVATE (and
 * the model) will receive before they send it.
 */
import { AnimatePresence, motion } from "framer-motion";
import { EASE } from "@/components/cinematic";
import type { BriefDraft } from "@/lib/builder/brief";
import type { BuilderCopy } from "@/lib/builder/copy";

export function BriefSheet({
  brief,
  copy,
  reduced,
}: {
  brief: BriefDraft;
  copy: BuilderCopy;
  reduced: boolean;
}) {
  const s = copy.sheet;
  const v = brief.visual;
  const hosts = brief.references.urls
    .map((u) => {
      try {
        return new URL(u).hostname.replace(/^www\./, "");
      } catch {
        return "";
      }
    })
    .filter(Boolean);
  const rows = [
    {
      key: "type",
      label: s.type,
      value: brief.projectType ? copy.type.options[brief.projectType].label : "",
    },
    {
      key: "company",
      label: s.company,
      value: [brief.project.company, brief.project.industry].filter(Boolean).join(" — "),
    },
    { key: "audience", label: s.audience, value: brief.project.audience },
    { key: "goal", label: s.goal, value: brief.project.goal },
    {
      key: "visual",
      label: s.visual,
      value: [v.style, v.mood, v.colors, v.typography].filter(Boolean).join(" · "),
    },
    {
      key: "references",
      label: s.references,
      value: [hosts.join(", "), brief.references.notes].filter(Boolean).join(" · "),
    },
  ].filter((r) => r.value.trim());

  return (
    <aside aria-label={s.title} className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">
      <p className="label-micro flex items-center gap-3 text-white/60">
        <span aria-hidden className="h-px w-6 bg-white/30" />
        {s.title}
      </p>
      {rows.length === 0 ? (
        <p className="mt-6 text-sm leading-relaxed text-white/45">{s.empty}</p>
      ) : (
        <dl className="mt-5 divide-y divide-white/8">
          <AnimatePresence initial={false}>
            {rows.map((r) => (
              <motion.div
                key={r.key}
                layout={!reduced}
                initial={reduced ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0 }}
                transition={{ duration: 0.45, ease: EASE }}
                className="grid grid-cols-[6.5rem_1fr] gap-4 py-3"
              >
                <dt className="text-xs text-white/45">{r.label}</dt>
                <dd className="m-0 line-clamp-3 text-sm leading-relaxed break-words text-white/85">
                  {r.value}
                </dd>
              </motion.div>
            ))}
          </AnimatePresence>
        </dl>
      )}
    </aside>
  );
}
