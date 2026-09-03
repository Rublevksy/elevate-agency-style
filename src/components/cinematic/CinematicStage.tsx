/**
 * The stage — the page's one scroll reading and its register of acts.
 *
 * It renders nothing visible. Its whole job is that there is a single place
 * that knows where the page is scrolled and which acts exist, so a section can
 * ask about its NEIGHBOUR instead of guessing at it with a magic number. The
 * hero handing the frame to the services room with `lg:-mt-[42vh]` is that
 * guess; a register makes the same hand-off a function of what the two acts
 * actually declared.
 *
 * What the stage deliberately does NOT do is lay anything out. It sets no
 * heights and imposes no track: a section stays the owner of its own markup and
 * simply declares, through `useAct`, how many viewports it occupies and how
 * much of that length its scene is pinned for.
 */
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useSyncExternalStore,
} from "react";
import { useScroll, type MotionValue } from "framer-motion";
import { useDetectedCapability, type MotionCapability } from "./useMotionCapability";

/** What an act tells the stage about itself. */
export interface ActRegistration {
  /** Scroll length of the whole act, in viewports. */
  viewports: number;
  /** Fraction of that length for which the act's scene is pinned. */
  pin: number;
}

/** What the stage knows about a registered act. */
export interface ActRecord extends ActRegistration {
  /** Registration order — mount order, which on a page is document order. */
  order: number;
}

interface CinematicStageValue {
  /** Scroll position of the document, in pixels. */
  scrollY: MotionValue<number>;
  /** Scroll position of the document, 0…1. */
  scrollYProgress: MotionValue<number>;
  /** One reading of what this machine carries, for the whole page. */
  capability: MotionCapability;
  registerAct: (id: string, registration: ActRegistration) => () => void;
  getAct: (id: string) => ActRecord | undefined;
  /** Notification of register/unregister, for `useStageAct`. */
  subscribe: (listener: () => void) => () => void;
}

const CinematicStageContext = createContext<CinematicStageValue | null>(null);

export function CinematicStage({ children }: { children: React.ReactNode }) {
  const { scrollY, scrollYProgress } = useScroll();
  const capability = useDetectedCapability();

  // The register lives in a ref, not in state. An act registers from an effect,
  // and a state write there would re-render every section on the page just to
  // record a fact none of them read during that render. Subscribers are woken
  // explicitly instead, so only the code that actually asks about a neighbour
  // re-renders.
  const acts = useRef(new Map<string, ActRecord>());
  const order = useRef(0);
  const listeners = useRef(new Set<() => void>());

  const notify = useCallback(() => {
    for (const listener of listeners.current) listener();
  }, []);

  const registerAct = useCallback(
    (id: string, registration: ActRegistration) => {
      const record: ActRecord = { ...registration, order: order.current++ };
      acts.current.set(id, record);
      notify();
      return () => {
        // Only retract the registration still on file: a remount can land the
        // new record before the old one's cleanup runs.
        if (acts.current.get(id) === record) {
          acts.current.delete(id);
          notify();
        }
      };
    },
    [notify],
  );

  const getAct = useCallback((id: string) => acts.current.get(id), []);

  const subscribe = useCallback((listener: () => void) => {
    listeners.current.add(listener);
    return () => listeners.current.delete(listener);
  }, []);

  const value = useMemo<CinematicStageValue>(
    () => ({ scrollY, scrollYProgress, capability, registerAct, getAct, subscribe }),
    [scrollY, scrollYProgress, capability, registerAct, getAct, subscribe],
  );

  // `display: contents` on purpose: the stage is a context boundary, not a box.
  // A real element here would insert itself into the page's layout — between
  // <main> and the sections it lays out — and this task is not allowed to move
  // a single pixel.
  return (
    <CinematicStageContext.Provider value={value}>
      <div style={{ display: "contents" }}>{children}</div>
    </CinematicStageContext.Provider>
  );
}

/** The stage, or `null` on a page that has none. */
export function useOptionalStage(): CinematicStageValue | null {
  return useContext(CinematicStageContext);
}

/** The stage. Throws where there is none, because a missing one is a wiring bug. */
export function useStage(): CinematicStageValue {
  const stage = useContext(CinematicStageContext);
  if (!stage) {
    throw new Error("useStage must be used inside <CinematicStage>. It is mounted in __root.tsx.");
  }
  return stage;
}

/** Document scroll progress, 0…1 — the stage's single reading. */
export function useStageProgress(): MotionValue<number> {
  return useStage().scrollYProgress;
}

/**
 * What a neighbouring act declared, or `undefined` while it is not mounted.
 *
 * This is the reason the register exists: an overlap between two sections is a
 * function of what both of them declared, and a section that can read its
 * neighbour never has to be told the answer in `vh`.
 */
export function useStageAct(id: string): ActRecord | undefined {
  const stage = useOptionalStage();
  const subscribe = useCallback(
    (listener: () => void) => (stage ? stage.subscribe(listener) : () => {}),
    [stage],
  );
  const read = useCallback(() => stage?.getAct(id), [stage, id]);
  return useSyncExternalStore(subscribe, read, read);
}
