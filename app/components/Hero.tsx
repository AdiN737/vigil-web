"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Widget, { type Tier } from "./Widget";
import { useCanAnimate } from "../lib/useCanAnimate";
import { DOWNLOAD_URL, SIZE, VERSION } from "../lib/site";

type Beat = Tier & { ms: number; line: string; step: 0 | 1 | 2; caption: string };

const LOOP: Beat[] = [
  { colour: "var(--work)", label: "working", open: false, provider: "Claude",
    ms: 1800, line: "Editing auth/session.ts", step: 0,
    caption: "The agent works. Vigil stays a dot." },
  { colour: "var(--destr)", label: "destructive", open: true, danger: true,
    provider: "Claude", project: "api-server", detail: "git push --force origin main",
    ms: 4400, line: "Permission required", step: 1,
    caption: "A real decision appears above your taskbar." },
  { colour: "var(--done)", label: "approved", open: false, provider: "Claude",
    ms: 1500, line: "Approved from Vigil · agent resumed", step: 2,
    caption: "One click answers it. Work resumes." },
];

const STEPS = ["Agent works", "Vigil filters", "You answer"];

export default function Hero() {
  const canAnimate = useCanAnimate();
  const [i, setI] = useState(0);
  const s = LOOP[i];

  useEffect(() => {
    if (!canAnimate) return;
    const timer = setTimeout(() => setI((n) => (n + 1) % LOOP.length), s.ms);
    return () => clearTimeout(timer);
  }, [canAnimate, i, s.ms]);

  const rise = (delay: number) => canAnimate ? {
    initial: { opacity: 0, y: 16, filter: "blur(8px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0)" },
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
  } : {};

  return (
    <section className="marks relative overflow-hidden border-b border-line">
      <div className="hero-glow" aria-hidden />
      <div className="relative mx-auto grid max-w-[1180px] gap-12 px-6 pb-16 pt-14 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-16 lg:pb-24 lg:pt-20">
        <div>
          <motion.div {...rise(0)} className="flex flex-wrap gap-2">
            <span className="signal-tag">Windows</span>
            <span className="signal-tag signal-live">Claude Code · live</span>
            <span className="signal-tag">Codex · in source</span>
          </motion.div>
          <motion.h1 {...rise(0.05)}
            className="mt-7 max-w-[11ch] text-[clamp(2.8rem,7vw,5rem)] font-medium leading-[0.92] tracking-[-0.055em]">
            Know when your agent needs you.
          </motion.h1>
          <motion.p {...rise(0.12)}
            className="mt-7 max-w-[42ch] text-[16px] leading-relaxed text-ink2">
            Vigil lives quietly above your taskbar. It ignores the work and
            opens only for a decision you can answer there.
          </motion.p>
          <motion.div {...rise(0.19)} className="mt-9 flex flex-wrap items-center gap-4">
            <a href={DOWNLOAD_URL} className="cta-primary group">
              Download free
              <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
            </a>
            <a href="/demo" className="cta-ghost">Try the live demo</a>
          </motion.div>
          <motion.p {...rise(0.24)} className="mt-5 text-[11px] tracking-wider text-ink3">
            {VERSION} · {SIZE} · no account · no telemetry
          </motion.p>
        </div>

        <motion.div {...rise(0.12)} className="relative">
          <div className="screen-shell">
            <div className="screen-bar"><span /><span /><span /><p>your desktop</p></div>
            <div className="screen-grid" aria-hidden />
            <div className="agent-window agent-one">
              <div><span className="provider-dot claude-dot" /> Claude Code</div>
              <p>api-server</p>
              <AnimatePresence mode="wait">
                <motion.code key={s.line} initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                  style={{ color: s.colour }}>{s.line}</motion.code>
              </AnimatePresence>
            </div>
            <div className="agent-window agent-two">
              <div><span className="provider-dot codex-dot" /> Codex</div>
              <p>web-client</p>
              <code>Running tests · 42 passed</code>
            </div>
            <div className="absolute bottom-10 right-4 flex justify-end">
              <Widget tier={s} idPrefix="hero"
                onApprove={s.open ? () => setI(2) : undefined}
                onDeny={s.open ? () => setI(2) : undefined} />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 border border-line">
            {STEPS.map((step, n) => (
              <div key={step} className={`relative px-3 py-3 ${n ? "border-l border-line" : ""}`}>
                <motion.span className="mb-2 block h-0.5 origin-left bg-accent"
                  animate={{ scaleX: n <= s.step ? 1 : 0 }} transition={{ duration: 0.32 }} />
                <p className="text-[10px] uppercase tracking-[0.14em]"
                  style={{ color: n === s.step ? "var(--ink)" : "var(--ink-3)" }}>{step}</p>
              </div>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.p key={s.caption} initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
              className="mt-3 text-center text-[11px] text-ink3">{s.caption}</motion.p>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
