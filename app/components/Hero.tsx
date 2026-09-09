"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import Widget, { type Tier } from "./Widget";
import { useCanAnimate } from "../lib/useCanAnimate";
import { DOWNLOAD_URL, SIZE, VERSION } from "../lib/site";

/* The loop STARTS on the money shot.

   The previous version began on `idle` — a dim grey dot — and did not open the
   pill for 6.4 seconds. A visitor who bounces at five seconds saw a grey dot
   and the word IDLE, which is the opposite of a demo. So the first frame is
   the blocked state with the pill already open, and it holds there longest. */
const LOOP: (Tier & { ms: number; line: string })[] = [
  { colour: "var(--destr)", label: "destructive", open: true, danger: true,
    project: "api-server", detail: "git push --force origin main",
    ms: 5000, line: "⚠ wants to run git push --force origin main" },
  { colour: "var(--done)", label: "approved", open: false,
    ms: 900, line: "✓ approved from Vigil — pushing" },
  { colour: "var(--block)", label: "blocked", open: true,
    project: "web-client", detail: "npm run build",
    ms: 4200, line: "⚠ wants to run npm run build" },
  { colour: "var(--work)", label: "working", open: false,
    ms: 1100, line: "● Ran npm test — 42 passed" },
];

export default function Hero() {
  const canAnimate = useCanAnimate();
  const [i, setI] = useState(0);
  const s = LOOP[i];

  useEffect(() => {
    if (!canAnimate) return;
    const t = setTimeout(() => setI((n) => (n + 1) % LOOP.length), s.ms);
    return () => clearTimeout(t);
  }, [i, canAnimate, s.ms]);

  const rise = (d: number) =>
    canAnimate
      ? {
          initial: { opacity: 0, y: 14, filter: "blur(6px)" },
          animate: { opacity: 1, y: 0, filter: "blur(0px)" },
          transition: { duration: 0.7, delay: d, ease: [0.22, 1, 0.36, 1] as const },
        }
      : {};

  return (
    <section className="marks relative overflow-hidden border-b border-line">
      <div className="relative mx-auto grid max-w-[1180px] gap-12 px-6 pt-14 pb-16 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-16 lg:pt-20 lg:pb-24">
        <div>
          <motion.h1
            {...rise(0)}
            className="text-[clamp(2.2rem,7vw,4.4rem)] font-medium leading-[0.98] tracking-[-0.045em]"
          >
            Your agent is
            <br />
            waiting on you.
          </motion.h1>

          {/* The definition line. A stranger must not have to scroll or infer
              to learn what this actually is. */}
          <motion.p
            {...rise(0.08)}
            className="mt-7 max-w-[48ch] text-[15px] leading-relaxed text-ink2"
          >
            Vigil is a Windows widget for Claude&nbsp;Code. A dot in the corner
            of your screen that stays silent while the agent works — and opens
            the moment it needs an answer.
          </motion.p>

          <motion.p
            {...rise(0.14)}
            className="mt-4 max-w-[48ch] text-[15px] leading-relaxed text-ink"
          >
            You answer it from there. Without leaving what you&rsquo;re doing.
          </motion.p>

          <motion.div {...rise(0.2)} className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href={DOWNLOAD_URL}
              className="group flex items-center gap-6 bg-accent px-6 py-4 text-[13px] uppercase tracking-[0.18em] text-[color:var(--accent-ink)] transition-transform hover:-translate-y-0.5"
            >
              Download
              <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
            </a>
            <p className="text-[11px] leading-relaxed tracking-wider text-ink3">
              free · {SIZE} · no account
              <br />
              {VERSION} · Windows 10 &amp; 11
            </p>
          </motion.div>

          {/* The most persuasive fact on the page. It used to sit at the fold
              edge in the faintest ink on the page. */}
          <motion.p
            {...rise(0.26)}
            className="mt-10 border-t border-line pt-6 text-[13px] text-ink2"
          >
            <span className="tnum text-[22px] font-medium text-ink">500</span> agent
            events across five sessions produced{" "}
            <span className="tnum text-[22px] font-medium text-accent">0</span> pop-ups.
          </motion.p>
        </div>

        {/* The product, on screen from the first frame, at every width. */}
        <motion.div {...rise(0.16)} className="relative">
          <div className="relative aspect-[5/4] overflow-hidden border border-line bg-[#0A0C10]">
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(#FFFFFF09 1px,transparent 1px),linear-gradient(90deg,#FFFFFF09 1px,transparent 1px)",
                backgroundSize: "30px 30px",
              }}
            />
            {/* an editor behind it, so the corner reads as a desktop */}
            <div
              aria-hidden
              className="absolute left-4 top-4 h-[46%] w-[52%] border border-line/80 bg-panel/70"
            >
              <div className="flex gap-1.5 border-b border-line/80 px-2.5 py-2">
                {[0, 1, 2].map((k) => (
                  <span key={k} className="size-1 rounded-full bg-ink3/50" />
                ))}
              </div>
              <div className="space-y-1.5 p-2.5">
                {[70, 44, 82, 36].map((w, k) => (
                  <div key={k} className="h-[3px] bg-ink3/20" style={{ width: `${w}%` }} />
                ))}
              </div>
            </div>

            {/* the agent's last line, so cause and effect are visible together */}
            <p
              className="absolute left-4 top-[62%] max-w-[70%] truncate text-[11px] transition-colors duration-300"
              style={{ color: s.colour }}
            >
              {s.line}
            </p>

            <div aria-hidden className="absolute inset-x-0 bottom-0 h-6 border-t border-line/80 bg-panel/80" />

            <div className="absolute bottom-9 right-4 flex justify-end">
              <Widget tier={s} idPrefix="hero" />
            </div>
          </div>

          <p className="mt-3 text-center text-[10.5px] tracking-wider text-ink3">
            bottom-right of your screen · actual size
          </p>
        </motion.div>
      </div>
    </section>
  );
}
