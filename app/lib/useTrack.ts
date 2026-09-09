"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

/* Scroll progress through a sticky track, 0 → 1.

   Deliberately NOT Motion's useScroll({target, offset}). When a target and a
   view-timeline-compatible offset are both passed, Motion hands the animation
   to the browser's native ViewTimeline — and the JS MotionValue then never
   updates, so useTransform and useMotionValueEvent both go silent. The symptom
   is a scroll scene frozen on its first frame, which is exactly what shipped
   here once already.

   This does the arithmetic itself: rAF-throttled, phase state only set when the
   index actually changes, and the continuous value handed back through a ref so
   a progress bar can be driven without re-rendering on every frame. */
export function useTrack(
  ref: RefObject<HTMLElement | null>,
  steps: number,
  onProgress?: (p: number) => void,
) {
  const [phase, setPhase] = useState(0);
  const progress = useRef(0);

  useEffect(() => {
    let raf = 0;
    let last = -1;

    // Read ref.current per call, never once up front. Bailing out of the effect
    // when the ref happens to be null attaches no listeners and never retries -
    // and useReducedMotion reports true on its first render, so the branch
    // without the track ref renders first and the scene silently freezes.
    const measure = () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const travel = r.height - window.innerHeight;
      const p = travel <= 0 ? 0 : Math.min(1, Math.max(0, -r.top / travel));

      progress.current = p;
      onProgress?.(p);

      // Head and tail are lead-in and lead-out, so the first and last phases
      // get a beat to be read rather than flicking past at the boundary.
      const eased = Math.min(1, Math.max(0, (p - 0.08) / 0.84));
      const n = Math.min(steps - 1, Math.floor(eased * steps));
      if (n !== last) {
        last = n;
        setPhase(n);
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ref, steps, onProgress]);

  return { phase, progress };
}
