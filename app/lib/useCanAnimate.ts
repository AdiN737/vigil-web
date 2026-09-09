"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

/* "Is it safe to give this element a hidden `initial`?"

   Motion drives animations on requestAnimationFrame, which is suspended while
   a document is hidden — a background tab, a print, a headless capture, a
   crawler. An element with initial={{opacity:0}} then has that applied and
   never animates away from it: permanently invisible, no error, no warning.

   So: entrance animations are opt-in, and only when we know frames are being
   served. Everywhere this returns false, callers must pass initial={false} so
   the element renders at its target state instead.

   The rule this encodes, learned the hard way three times on this page:
   Motion for entrances (harmless if skipped), CSS transitions for anything
   state-driven (must be correct even when never animated). */
export function useCanAnimate() {
  const still = useReducedMotion();
  // Assume NOT animatable until proven otherwise — the safe direction, and it
  // also matches the server render, so there is no hydration mismatch.
  const [live, setLive] = useState(false);

  useEffect(() => {
    const sync = () => setLive(!document.hidden);
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, []);

  return live && !still;
}
