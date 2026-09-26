import { motion, useTransform, type MotionValue } from "framer-motion";
import { PROJECT_MAP_POINTS } from "@/lib/project-map";
import type { ProjectSlug } from "@/lib/projects";

const BLOCKS = [
  [8, 19, 8, 16], [18, 12, 10, 22], [31, 18, 7, 13], [43, 10, 12, 26],
  [60, 15, 8, 18], [74, 11, 11, 24], [86, 22, 6, 12], [12, 45, 12, 22],
  [29, 48, 8, 16], [43, 39, 10, 28], [58, 48, 13, 20], [79, 43, 8, 18],
  [8, 72, 9, 15], [22, 78, 13, 19], [43, 70, 8, 17], [58, 77, 10, 13],
  [71, 72, 7, 23], [86, 67, 7, 16],
] as const;

export function PragueMapScene({
  progress,
  activeSlug,
  interactive = false,
  onSelect,
  label,
}: {
  progress?: MotionValue<number>;
  activeSlug?: ProjectSlug;
  interactive?: boolean;
  onSelect?: (slug: ProjectSlug) => void;
  label: string;
}) {
  const cameraX = useTransform(progress ?? STATIC_PROGRESS, [0, 0.25, 0.5, 0.75, 1], ["0%", "4%", "-3%", "3%", "0%"]);
  const cameraY = useTransform(progress ?? STATIC_PROGRESS, [0, 0.25, 0.5, 0.75, 1], ["0%", "2%", "-2%", "1%", "0%"]);
  const cameraScale = useTransform(progress ?? STATIC_PROGRESS, [0, 0.18, 0.48, 0.78, 1], [0.96, 1.04, 1.08, 1.05, 0.98]);

  return (
    <div className="prague-scene" role={interactive ? "group" : undefined} aria-label={interactive ? label : undefined} aria-hidden={interactive ? undefined : true}>
      <div className="prague-scene__haze" />
      <motion.div className="prague-scene__camera" style={{ x: cameraX, y: cameraY, scale: cameraScale }}>
        <div className="prague-scene__map">
          <div className="prague-scene__river" />
          <div className="prague-scene__roads" />
          <div className="prague-scene__route" />
          {BLOCKS.map(([x, y, w, h], index) => (
            <span
              key={`${x}-${y}`}
              className="prague-scene__building"
              style={{ left: `${x}%`, top: `${y}%`, width: `${w}%`, height: `${h}%`, "--building-order": index } as React.CSSProperties}
            />
          ))}
          {PROJECT_MAP_POINTS.map((point, index) => {
            const selected = activeSlug === point.slug;
            const marker = (
              <>
                <span className="prague-marker__pulse" />
                <span className="prague-marker__core">{String(index + 1).padStart(2, "0")}</span>
              </>
            );
            return interactive ? (
              <button
                key={point.slug}
                type="button"
                className="prague-marker"
                style={{ left: `${point.scene.x}%`, top: `${point.scene.y}%` }}
                aria-label={`${label}: ${String(index + 1).padStart(2, "0")}`}
                aria-pressed={selected}
                data-active={selected ? "true" : "false"}
                onClick={() => onSelect?.(point.slug)}
              >
                {marker}
              </button>
            ) : (
              <span
                key={point.slug}
                className="prague-marker"
                style={{ left: `${point.scene.x}%`, top: `${point.scene.y}%` }}
                data-active="true"
              >
                {marker}
              </span>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

const STATIC_PROGRESS = { get: () => 0, on: () => () => {} } as unknown as MotionValue<number>;
