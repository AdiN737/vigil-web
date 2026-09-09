"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import Frame from "./Frame";

const SHOTS = [
  { src: "/shots/desk-quiet.jpg", k: "working", c: "var(--work)",
    cap: "Agent mid-build. A 26px dot.",
    alt: "A monitor on a desk at dusk. Claude Code is mid-build and Vigil is a single small blue dot in the corner of the screen, magnified in an inset." },
  { src: "/shots/desk-approve.jpg", k: "blocked", c: "var(--destr)",
    cap: "Blocked on a force-push. Answer it here.",
    alt: "The same desk. The terminal is blocked on git push --force, and Vigil has opened into a red pill with Approve anyway and Deny." },
];

export default function SeeIt() {
  const still = useReducedMotion();
  const [i, setI] = useState(0);

  return (
    <Frame n="02" label="On a real screen">
      <div className="flex items-center justify-between gap-6 border-b border-line pb-4">
        <p className="max-w-[42ch] text-[14px] leading-relaxed text-ink2">
          Same desk, minutes apart. The only thing that changes is one corner.
        </p>
        <div className="flex shrink-0 gap-px bg-line">
          {SHOTS.map((s, n) => (
            <button
              key={s.k}
              onClick={() => setI(n)}
              aria-pressed={n === i}
              className="bg-ground px-4 py-2 text-[11px] uppercase tracking-[0.16em] transition-colors"
              style={{ color: n === i ? s.c : "var(--ink-3)" }}
            >
              {s.k}
            </button>
          ))}
        </div>
      </div>

      <div className="relative mt-6 overflow-hidden border border-line">
        {SHOTS.map((s, n) => (
          <motion.div
            key={s.src}
            initial={false}
            animate={{ opacity: n === i ? 1 : 0 }}
            transition={{ duration: still ? 0 : 0.4 }}
            className={n === 0 ? "relative" : "absolute inset-0"}
          >
            <Image src={s.src} alt={s.alt} width={1920} height={1071}
                   sizes="(max-width:1024px) 94vw, 1130px" priority={n === 0}
                   className="w-full" />
          </motion.div>
        ))}
      </div>

      <p className="mt-4 flex items-center gap-3 text-[12px] tracking-wider text-ink3">
        <span className="size-1.5 rounded-full" style={{ background: SHOTS[i].c }} />
        {SHOTS[i].cap}
      </p>
    </Frame>
  );
}
