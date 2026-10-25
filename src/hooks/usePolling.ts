import { useEffect, useRef } from "react";

export interface PollingOptions {
  /** Delay between successful runs, in ms. */
  interval: number;
  /** Stop polling entirely (e.g. logged out, nothing to watch). */
  enabled?: boolean;
  /** Run once as soon as polling starts, instead of waiting a full interval. */
  immediate?: boolean;
  /** Upper bound for the error backoff, in ms. */
  maxBackoff?: number;
}

/**
 * Stand-in for websockets: runs `task` on a timer, but only while it's useful.
 *
 * - Pauses while the tab is hidden (no battery or data spent on a pocketed
 *   phone) and runs immediately when the guest comes back.
 * - Runs immediately when the device comes back online.
 * - Backs off exponentially while `task` keeps failing, then resets.
 * - Never overlaps runs: the next one is scheduled after the current settles.
 */
export function usePolling(task: () => unknown, options: PollingOptions) {
  const { interval, enabled = true, immediate = false, maxBackoff = 5 * 60_000 } = options;
  const taskRef = useRef(task);
  taskRef.current = task;

  useEffect(() => {
    if (!enabled) return;

    let timer: ReturnType<typeof setTimeout> | null = null;
    let running = false;
    let failures = 0;
    let stopped = false;

    const schedule = () => {
      if (stopped) return;
      if (timer) clearTimeout(timer);
      const delay = failures ? Math.min(interval * 2 ** failures, maxBackoff) : interval;
      timer = setTimeout(run, delay);
    };

    const run = async () => {
      if (stopped || running) return;
      if (document.visibilityState === "hidden") return; // resumed by the visibility listener
      running = true;
      try {
        await taskRef.current();
        failures = 0;
      } catch {
        failures = Math.min(failures + 1, 10);
      } finally {
        running = false;
        schedule();
      }
    };

    const wake = () => {
      if (document.visibilityState === "visible") run();
    };

    document.addEventListener("visibilitychange", wake);
    window.addEventListener("online", wake);
    if (immediate) run();
    else schedule();

    return () => {
      stopped = true;
      if (timer) clearTimeout(timer);
      document.removeEventListener("visibilitychange", wake);
      window.removeEventListener("online", wake);
    };
  }, [enabled, interval, immediate, maxBackoff]);
}
