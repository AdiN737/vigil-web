"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Frame from "./Frame";
import { useCanAnimate } from "../lib/useCanAnimate";

/* The demo you can drive. A video can show the pill opening; only this can let
   you press Approve and watch the agent unblock, which is the entire product.

   The run genuinely waits on you: it stops at the permission prompt and does
   not advance until a button is pressed. Deny actually aborts. */

type Line = { text: string; colour?: string };

const BEFORE: Line[] = [
  { text: "$ claude" },
  { text: "● Reading routes/deploy.ts" },
  { text: "● Updated routes/deploy.ts  +18 −4", colour: "var(--done)" },
  { text: "● Ran npm test — 42 passed", colour: "var(--done)" },
  { text: "● Release tagged v2.4.0" },
];

const APPROVED: Line[] = [
  { text: "✓ approved from Vigil", colour: "var(--done)" },
  { text: "● Pushing to origin/main…" },
  { text: "● Done in 4m 12s", colour: "var(--done)" },
];

const DENIED: Line[] = [
  { text: "✗ denied from Vigil", colour: "var(--destr)" },
  { text: "● Stopped. Nothing was pushed.", colour: "var(--ink-2)" },
];

type Stage = "idle" | "running" | "blocked" | "approved" | "denied";

export default function Try() {
  const canAnimate = useCanAnimate();
  const [stage, setStage] = useState<Stage>("idle");
  const [lines, setLines] = useState<Line[]>([]);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clear = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);
  useEffect(() => clear, [clear]);

  const play = useCallback(
    (queue: Line[], done?: () => void, step = 620) => {
      queue.forEach((l, n) => {
        timers.current.push(
          setTimeout(() => {
            setLines((prev) => [...prev, l]);
            if (n === queue.length - 1) done?.();
          }, step * (n + 1)),
        );
      });
    },
    [],
  );

  const run = () => {
    clear();
    setLines([]);
    setStage("running");
    play(BEFORE, () => setStage("blocked"));
  };

  const decide = (ok: boolean) => {
    clear();
    setLines((prev) => [...prev]);
    setStage(ok ? "approved" : "denied");
    play(ok ? APPROVED : DENIED);
  };

  const reset = () => {
    clear();
    setLines([]);
    setStage("idle");
  };

  const dot =
    stage === "idle" ? "var(--idle)"
    : stage === "running" ? "var(--work)"
    : stage === "blocked" ? "var(--destr)"
    : stage === "denied" ? "var(--ink-3)"
    : "var(--done)";

  const status =
    stage === "idle" ? "idle"
    : stage === "running" ? "working"
    : stage === "blocked" ? "needs you"
    : stage === "denied" ? "stopped"
    : "done";

  return (
    <Frame n="02" label="Try it">
      <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-stretch">
        {/* the agent */}
        <div className="flex flex-col border border-line bg-panel">
          <div className="flex items-center justify-between gap-2 border-b border-line px-4 py-2.5">
            <span className="text-[11px] uppercase tracking-[0.16em] text-ink3">api-server</span>
            <span
              className="text-[11px] uppercase tracking-[0.16em] transition-colors duration-300"
              style={{ color: dot }}
            >
              {status}
            </span>
          </div>

          <div className="h-[236px] space-y-1.5 overflow-hidden p-4 text-[12.5px] leading-relaxed">
            {lines.length === 0 && (
              <p className="text-ink3">Press run, then answer the prompt from the dot.</p>
            )}
            {lines.map((l, n) => (
              <p key={n} style={{ color: l.colour ?? "var(--ink-2)" }}>
                {l.text}
              </p>
            ))}
            {stage === "blocked" && (
              <p className="text-[color:var(--destr)]">
                ⚠ wants to run git push --force origin main
              </p>
            )}
          </div>

          <div className="mt-auto flex items-center gap-3 border-t border-line px-4 py-3">
            <button
              onClick={stage === "idle" ? run : reset}
              className="border border-line px-4 py-2 text-[11px] uppercase tracking-[0.16em] text-ink2 transition-colors hover:border-accent hover:text-accent"
            >
              {stage === "idle" ? "run the agent" : "reset"}
            </button>
            {stage === "blocked" && (
              <span className="text-[11px] text-ink3">waiting on you →</span>
            )}
          </div>
        </div>

        {/* your screen */}
        <div className="relative h-[324px] overflow-hidden border border-line bg-[#0A0C10]">
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(#FFFFFF09 1px,transparent 1px),linear-gradient(90deg,#FFFFFF09 1px,transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          <div aria-hidden className="absolute inset-x-0 bottom-0 h-7 border-t border-line/80 bg-panel/80" />

          <div className="absolute bottom-11 right-5">
            <AnimatePresence mode="popLayout" initial={false}>
              {stage === "blocked" ? (
                <motion.div
                  key="pill"
                  initial={canAnimate ? { opacity: 0, scale: 0.86, y: 10 } : false}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={canAnimate ? { opacity: 0, scale: 0.92 } : undefined}
                  transition={{ type: "spring", stiffness: 520, damping: 34 }}
                  className="w-[292px] border-2 px-4 py-3"
                  style={{ borderColor: "var(--destr)", background: "var(--panel)" }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="tnum text-[11px] text-[color:var(--destr)]">14m</span>
                    <span className="text-[13px] font-medium text-ink">api-server</span>
                    <span className="size-2 rounded-full bg-[color:var(--destr)]" />
                  </div>
                  <p className="mt-1 truncate text-right text-[11.5px] text-ink2">
                    git push --force origin main
                  </p>
                  <div className="mt-3 flex justify-end gap-2">
                    <button
                      onClick={() => decide(true)}
                      className="bg-accent px-3 py-1 text-[11px] font-medium text-ground transition-opacity hover:opacity-85"
                    >
                      Approve anyway
                    </button>
                    <button
                      onClick={() => decide(false)}
                      className="border border-ink3 px-3 py-1 text-[11px] text-ink3 transition-colors hover:border-ink2 hover:text-ink2"
                    >
                      Deny
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.span
                  key="dot"
                  initial={canAnimate ? { opacity: 0, scale: 0.4 } : false}
                  animate={{ opacity: stage === "idle" ? 0.55 : 1, scale: 1 }}
                  exit={canAnimate ? { opacity: 0, scale: 0.4 } : undefined}
                  transition={{ type: "spring", stiffness: 520, damping: 30 }}
                  className="block size-[26px] rounded-full transition-colors duration-300"
                  style={{ background: dot }}
                />
              )}
            </AnimatePresence>
          </div>

          <p className="absolute bottom-2 right-5 text-[10px] tracking-wider text-ink3">
            bottom-right of your screen
          </p>
        </div>
      </div>

      <p className="mt-5 text-[12px] leading-relaxed text-ink3">
        The run genuinely stops at the prompt. Deny aborts it — nothing gets pushed.
      </p>
    </Frame>
  );
}
