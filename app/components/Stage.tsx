"use client";

import { useCallback, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useTrack } from "../lib/useTrack";

/* Scroll drives a real agent run. Six phases, each with the terminal line that
   caused it and the state the widget takes — so the thing being demonstrated is
   the product's behaviour, not the page's taste in easing.

   Transitions are stiff and heavily damped on purpose. Vigil is an instrument;
   a bouncy pill would undercut the whole claim that it stays out of your way. */
type Phase = {
  tier: 1 | 2 | 5 | 7 | 3;
  colour: string;
  name: string;
  line: string;
  open: boolean;
  detail?: string;
  note: string;
};

const PHASES: Phase[] = [
  { tier: 1, colour: "var(--idle)", name: "idle", open: false,
    line: "$ claude", note: "Nothing running. A dot you would have to look for." },
  { tier: 2, colour: "var(--work)", name: "working", open: false,
    line: "● Reading routes/deploy.ts", note: "It starts. The dot turns blue and says nothing." },
  { tier: 2, colour: "var(--work)", name: "working", open: false,
    line: "● Ran npm test — 42 passed", note: "Still working. Still silent. This is most of a session." },
  { tier: 7, colour: "var(--destr)", name: "destructive", open: true,
    detail: "git push --force origin main",
    line: "⚠ wants to run git push --force origin main",
    note: "Irreversible. The pill opens — this is the one moment it interrupts." },
  { tier: 3, colour: "var(--done)", name: "approved", open: false,
    line: "✓ approved from Vigil — pushing",
    note: "You answered without touching the terminal. It folds away." },
  { tier: 3, colour: "var(--done)", name: "done", open: false,
    line: "● Done in 4m 12s", note: "Finished. A green dot, not an interruption." },
];

export default function Stage() {
  const still = useReducedMotion();
  const track = useRef<HTMLDivElement>(null);
  const barEl = useRef<HTMLDivElement>(null);

  // The bar is written straight to the DOM so a 60fps scroll does not
  // re-render the whole scene; only a phase change does.
  const onProgress = useCallback((v: number) => {
    if (barEl.current) barEl.current.style.width = `${Math.round(v * 100)}%`;
  }, []);

  const { phase: i } = useTrack(track, PHASES.length, onProgress);
  const p = PHASES[i];

  /* Reduced motion gets the same story as a static list — no scroll hijack. */
  if (still) {
    return (
      <section className="border-t border-line">
        <div className="mx-auto max-w-[1180px] px-6 py-20">
          <p className="idx"><b>01</b><span>Vigil at work</span></p>
          <ol className="mt-10 border-t border-line">
            {PHASES.map((ph, n) => (
              <li key={n} className="grid grid-cols-[auto_1fr] gap-4 border-b border-line py-4">
                <span className="mt-1.5 size-2 rounded-full" style={{ background: ph.colour }} />
                <div>
                  <p className="text-[13px]" style={{ color: ph.colour }}>{ph.line}</p>
                  <p className="mt-1 text-[12px] text-ink3">{ph.note}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    );
  }

  return (
    <section className="border-t border-line">
      <div ref={track} className="relative h-[460vh]">
        <div className="sticky top-0 flex h-screen items-center overflow-hidden">
          <div className="mx-auto w-full max-w-[1180px] px-6">
            <p className="idx"><b>01</b><span>Vigil at work</span></p>

            <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-stretch">
              {/* the agent's terminal — lines accumulate as you scroll */}
              <div className="border border-line bg-panel">
                <div className="flex items-center gap-2 border-b border-line px-4 py-2.5">
                  <span className="size-1.5 rounded-full bg-ink3" />
                  <span className="text-[11px] uppercase tracking-[0.16em] text-ink3">
                    api-server
                  </span>
                </div>
                <div className="h-[248px] space-y-1.5 p-4 text-[12.5px] leading-relaxed">
                  {PHASES.slice(0, i + 1).map((ph, n) => (
                    <motion.p
                      key={n}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: n === i ? 1 : 0.42, x: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      style={{ color: n === i ? ph.colour : "var(--ink-3)" }}
                    >
                      {ph.line}
                    </motion.p>
                  ))}
                </div>
              </div>

              {/* the corner of your screen */}
              <div className="relative h-[292px] overflow-hidden border border-line bg-[#0A0C10]">
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      "linear-gradient(#FFFFFF09 1px,transparent 1px),linear-gradient(90deg,#FFFFFF09 1px,transparent 1px)",
                    backgroundSize: "32px 32px",
                  }}
                />
                {/* a window and a taskbar, so the corner reads as a desktop and
                    the pill has a sense of scale against it */}
                <div
                  aria-hidden
                  className="absolute left-5 top-5 h-[58%] w-[56%] border border-line/80 bg-panel/70"
                >
                  <div className="flex gap-1.5 border-b border-line/80 px-2.5 py-2">
                    {[0, 1, 2].map((k) => (
                      <span key={k} className="size-1 rounded-full bg-ink3/50" />
                    ))}
                  </div>
                  <div className="space-y-1.5 p-2.5">
                    {[72, 46, 84, 38, 60].map((w, k) => (
                      <div key={k} className="h-[3px] bg-ink3/20" style={{ width: `${w}%` }} />
                    ))}
                  </div>
                </div>
                <div aria-hidden className="absolute inset-x-0 bottom-0 h-7 border-t border-line/80 bg-panel/80" />
                <div className="absolute bottom-11 right-5">
                  <AnimatePresence mode="popLayout" initial={false}>
                    {p.open ? (
                      <motion.div
                        key="pill"
                        initial={{ opacity: 0, scale: 0.82, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 520, damping: 34 }}
                        className="w-[292px] border-2 px-4 py-3"
                        style={{ borderColor: p.colour, background: "#0F1217" }}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="tnum text-[11px]" style={{ color: p.colour }}>14m</span>
                          <span className="text-[13px] font-medium text-ink">api-server</span>
                          <span className="size-2 rounded-full" style={{ background: p.colour }} />
                        </div>
                        <p className="mt-1 truncate text-right text-[11.5px] text-ink2">{p.detail}</p>
                        <div className="mt-3 flex justify-end gap-2">
                          <span className="border border-accent bg-accent px-3 py-1 text-[11px] font-medium text-ground">
                            Approve anyway
                          </span>
                          <span className="border border-ink3 px-3 py-1 text-[11px] text-ink3">Deny</span>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.span
                        key="dot"
                        initial={{ opacity: 0, scale: 0.4 }}
                        animate={{
                          opacity: p.tier === 1 ? 0.55 : 1,
                          scale: 1,
                          boxShadow:
                            p.tier === 1
                              ? "0 0 0 0px transparent"
                              : `0 0 0 6px color-mix(in srgb, ${p.colour} 14%, transparent)`,
                        }}
                        exit={{ opacity: 0, scale: 0.4 }}
                        transition={{ type: "spring", stiffness: 520, damping: 30 }}
                        className="block size-[26px] rounded-full"
                        style={{ background: p.colour }}
                      />
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* what just happened, and how far through */}
            <div className="mt-8 border-t border-line pt-5">
              <AnimatePresence mode="wait">
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.26 }}
                  className="min-h-[2.5rem] max-w-[54ch] text-[14px] leading-relaxed text-ink2"
                >
                  {p.note}
                </motion.p>
              </AnimatePresence>

              <div className="mt-4 flex items-center gap-4">
                <div className="h-px flex-1 bg-line">
                  <div ref={barEl} className="h-px bg-accent" style={{ width: "0%" }} />
                </div>
                <span className="tnum text-[11px] text-ink3">
                  {String(i + 1).padStart(2, "0")} / {String(PHASES.length).padStart(2, "0")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
