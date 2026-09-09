"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { DOWNLOAD_URL, SIZE, VERSION } from "../lib/site";

/* Six steps of the real state machine, on a loop. This is the only moving
   thing above the fold; everything else holds still so it reads as a document
   rather than a slideshow. */
const LOOP = [
  { c: "var(--work)",  t: "working",     ms: 2600, say: "agent working" },
  { c: "var(--work)",  t: "working",     ms: 2000, say: "still working" },
  { c: "var(--block)", t: "blocked",     ms: 3000, say: "needs you" },
  { c: "var(--destr)", t: "destructive", ms: 3000, say: "force-push" },
  { c: "var(--done)",  t: "done",        ms: 2200, say: "finished" },
  { c: "var(--idle)",  t: "idle",        ms: 1800, say: "idle" },
];

export default function Hero() {
  const still = useReducedMotion();
  const [i, setI] = useState(0);
  const s = LOOP[i];

  useEffect(() => {
    if (still) return;
    const t = setTimeout(() => setI((n) => (n + 1) % LOOP.length), s.ms);
    return () => clearTimeout(t);
  }, [i, still, s.ms]);

  return (
    <header className="border-t border-line">
      <div className="mx-auto max-w-[1180px] px-6 pt-16 pb-20 lg:pt-24 lg:pb-28">
        <div className="flex items-center justify-between gap-6 text-[11px] uppercase tracking-[0.22em] text-ink3">
          <span className="text-ink2">Vigil</span>
          <span>{VERSION} · windows</span>
        </div>

        <h1 className="mt-14 text-[clamp(2.6rem,8.5vw,6.5rem)] font-medium leading-[0.94] tracking-[-0.045em]">
          Stop babysitting
          <br />
          <span className="text-ink3">your agent.</span>
        </h1>

        <div className="mt-14 grid gap-10 border-t border-line pt-8 md:grid-cols-[1fr_auto] md:items-end">
          <p className="max-w-[46ch] text-[15px] leading-relaxed text-ink2">
            A dot in the corner of your screen. Silent while Claude Code works
            — and when it&rsquo;s genuinely stuck, you approve from the dot
            without leaving what you&rsquo;re doing.
          </p>

          <div className="flex flex-col gap-3">
            <a
              href={DOWNLOAD_URL}
              className="group flex items-center justify-between gap-8 border border-accent px-6 py-4 text-[13px] uppercase tracking-[0.18em] text-accent transition-colors hover:bg-accent hover:text-ground"
            >
              Download
              <span aria-hidden className="transition-transform group-hover:translate-x-1">
                &rarr;
              </span>
            </a>
            <p className="text-[11px] tracking-wider text-ink3">
              free · {SIZE} · no account
            </p>
          </div>
        </div>

        {/* the state machine, ticking */}
        <div className="mt-16 flex items-center gap-4 border-t border-line pt-8">
          <span className="relative flex size-3 items-center justify-center">
            <motion.span
              key={s.t}
              className="absolute inset-0 rounded-full"
              style={{ background: s.c }}
              initial={still ? false : { scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.28 }}
            />
          </span>
          <motion.span
            key={s.say}
            initial={still ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28 }}
            className="text-[12px] uppercase tracking-[0.2em]"
            style={{ color: s.c }}
          >
            {s.say}
          </motion.span>
          <span className="ml-auto text-[11px] tracking-wider text-ink3">
            500 events → 0 pop-ups
          </span>
        </div>
      </div>
    </header>
  );
}
