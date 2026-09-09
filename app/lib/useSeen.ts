"use client";

import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";

// useLayoutEffect warns during SSR; there is no layout to measure there anyway.
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* "Should this be revealed yet?" — inverted so it can never fail closed.

   The obvious shape (start at opacity 0, let IntersectionObserver reveal) has
   one catastrophic failure: if the observer never runs, the content is
   invisible forever. Two things break together in a hidden document — a
   background tab, a print, a headless capture, a crawler: IntersectionObserver
   reports nothing, AND requestAnimationFrame is suspended, so Motion applies
   `initial` and never animates away from it. That combination has silently
   shipped blank sections here twice.

   So the default is VISIBLE. We only hide an element after proving, in the same
   effect, that an observer is live and the element is below the fold — i.e.
   only once we know we can bring it back. The worst case degrades to "no
   entrance animation", never to "no content". */
export function useSeen(ref: RefObject<HTMLElement | null>) {
  // true = show it. Starts true on purpose.
  const [shown, setShown] = useState(true);
  const settled = useRef(false);

  // Layout effect, not effect: the decision to hide must land BEFORE paint,
  // or below-the-fold content flashes in and then disappears.
  useIsoLayoutEffect(() => {
    if (settled.current) return;
    const el = ref.current;

    const reveal = () => {
      settled.current = true;
      setShown(true);
    };

    // Anything that means "we cannot reliably observe" → just show it.
    if (!el || document.hidden || !("IntersectionObserver" in window)) {
      return reveal();
    }

    // Already on screen? Nothing to animate in; leave it alone.
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) return reveal();

    // Below the fold AND we have a working observer: now it is safe to hide.
    setShown(false);

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          reveal();
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    io.observe(el);

    // Belt and braces: if the tab is hidden later, the observer stops. Show.
    const onVis = () => {
      if (document.hidden) {
        reveal();
        io.disconnect();
      }
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [ref]);

  return shown;
}
