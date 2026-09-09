"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useCanAnimate } from "../lib/useCanAnimate";
import { DOWNLOAD_URL, SIZE, VERSION } from "../lib/site";

/* The real state machine, on a loop, above the fold. It spends most of the
   cycle silent — which is the argument — and pops the pill exactly once, on
   the one event that earns it. */
type Step = {
  colour: string;
  say: string;
  ms: number;
  pill?: { project: string; detail: string; danger?: boolean };
};

const LOOP: Step[] = [
  { colour: "var(--idle)",  say: "idle",        ms: 1600 },
  { colour: "var(--work)",  say: "working",     ms: 2600 },
  { colour: "var(--work)",  say: "working",     ms: 2200 },
  { colour: "var(--block)", say: "blocked",     ms: 3400,
    pill: { project: "web-client", detail: "npm run build" } },
  { colour: "var(--destr)", say: "destructive", ms: 4200,
    pill: { project: "api-server", detail: "git push --force origin main", danger: true } },
  { colour: "var(--done)",  say: "done",        ms: 2200 },
];

export default function Hero() {
  const canAnimate = useCanAnimate();
  const [i, setI] = useState(0);
  const s = LOOP[i];

  useEffect(() => {
    if (!canAnimate) return; // a frozen loop in a hidden tab helps nobody
    const t = setTimeout(() => setI((n) => (n + 1) % LOOP.length), s.ms);
    return () => clearTimeout(t);
  }, [i, canAnimate, s.ms]);

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

        {/* the loop: a status line on the left, and the pill it pops on the
            right — the whole product in one row */}
        <div className="mt-16 grid items-center gap-6 border-t border-line pt-8 md:grid-cols-[auto_1fr_auto]">
          <div className="flex items-center gap-3.5">
            {/* colour is state, so CSS transition, never a Motion animation */}
            <span
              className="size-3 rounded-full transition-colors duration-300"
              style={{ background: s.colour }}
            />
            <span
              className="text-[12px] uppercase tracking-[0.2em] transition-colors duration-300"
              style={{ color: s.colour }}
            >
              {s.say}
            </span>
          </div>

          <div className="hidden min-h-[104px] justify-end md:flex">
            <AnimatePresence mode="wait">
              {s.pill && (
                <motion.div
                  key={s.pill.project}
                  initial={canAnimate ? { opacity: 0, scale: 0.86, y: 12 } : false}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={canAnimate ? { opacity: 0, scale: 0.92, y: -6 } : undefined}
                  transition={{ type: "spring", stiffness: 520, damping: 34 }}
                  className="w-[292px] border-2 px-4 py-3"
                  style={{ borderColor: s.colour, background: "var(--panel)" }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="tnum text-[11px]" style={{ color: s.colour }}>14m</span>
                    <span className="text-[13px] font-medium text-ink">{s.pill.project}</span>
                    <span className="size-2 rounded-full" style={{ background: s.colour }} />
                  </div>
                  <p className="mt-1 truncate text-right text-[11.5px] text-ink2">
                    {s.pill.detail}
                  </p>
                  <div className="mt-3 flex justify-end gap-2">
                    <span
                      className="px-3 py-1 text-[11px] font-medium"
                      style={
                        s.pill.danger
                          ? { background: "var(--accent)", color: "var(--ground)" }
                          : { border: "1px solid var(--done)", color: "var(--done)" }
                      }
                    >
                      {s.pill.danger ? "Approve anyway" : "Approve"}
                    </span>
                    <span className="border border-ink3 px-3 py-1 text-[11px] text-ink3">Deny</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <span className="text-[11px] tracking-wider text-ink3">
            500 events → 0 pop-ups
          </span>
        </div>
      </div>
    </header>
  );
}
