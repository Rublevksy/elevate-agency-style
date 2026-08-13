import { useSyncExternalStore } from "react";

/**
 * Tiny global flag: is the homepage cinematic (laptop) sequence currently
 * occupying the viewport? While true, the standard site chrome stays hidden.
 */
let active = false;
const subs = new Set<() => void>();

export function setCinematicActive(next: boolean) {
  if (next === active) return;
  active = next;
  subs.forEach((fn) => fn());
}

function subscribe(fn: () => void) {
  subs.add(fn);
  return () => subs.delete(fn);
}

export function useCinematicActive() {
  return useSyncExternalStore(
    subscribe,
    () => active,
    () => false,
  );
}
