"use client";

import { useRef } from "react";
import Frame from "./Frame";
import { useThrough } from "../lib/useTrack";
import { useCanAnimate } from "../lib/useCanAnimate";

const GATES: [string, string][] = [
  ["actionable?",    "working, done and idle never open the pill"],
  ["told you yet?",  "one ping per session, not one per event"],
  ["looking at it?", "focused window gets silence"],
  ["too soon?",      "each ping doubles the quiet period, to 15 min"],
  ["batch it?",      "simultaneous prompts become one notice"],
];

/* The counter falls between the two numbers that were actually measured: 500
   events in, 0 pop-ups out. Deliberately no figure beside any individual gate —
   per-gate survivor counts were never measured, and inventing five
   plausible-looking ones would be the only dishonest thing on this page. */
export default function Quiet() {
  const canAnimate = useCanAnimate();
  const ref = useRef<HTMLDivElement>(null);
  const p = useThrough(ref);

  // Hold at 500 briefly, fall through the gates, land on 0 and stay there.
  // When we cannot animate, skip straight to the resting state: 0 and all lit.
  const fall = canAnimate ? Math.min(1, Math.max(0, (p - 0.12) / 0.68)) : 1;
  const eased = 1 - Math.pow(1 - fall, 3);
  const count = Math.round(500 * (1 - eased));
  const lit = Math.min(GATES.length, Math.floor(fall * GATES.length * 1.15));
  const done = count === 0;

  return (
    <Frame n="03" label="Why it stays quiet">
      <div ref={ref} className="grid gap-12 lg:grid-cols-[1fr_auto] lg:items-start">
        <div>
          <p className="max-w-[46ch] text-[14px] leading-relaxed text-ink2">
            Five gates stand between an event and your attention. Most events
            die at the first one.
          </p>

          <ol className="mt-8 border-t border-line">
            {GATES.map(([q, d], i) => {
              const on = i < lit;
              return (
                <li
                  key={q}
                  className="grid grid-cols-[2.5rem_1fr] gap-4 border-b border-line py-3.5"
                >
                  <span
                    className="tnum text-[12px] transition-colors duration-300"
                    style={{ color: on ? "var(--accent)" : "var(--ink-3)" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className="text-[13px] transition-opacity duration-300"
                    style={{ opacity: on ? 1 : 0.42 }}
                  >
                    <span className="text-ink">{q}</span>
                    <span className="text-ink3"> — {d}</span>
                  </span>
                </li>
              );
            })}
          </ol>

          <p className="mt-6 text-[12px] leading-relaxed text-ink3">
            Except anything irreversible.{" "}
            <span className="text-[color:var(--destr)]">rm -rf</span>,{" "}
            <span className="text-[color:var(--destr)]">git push --force</span>{" "}
            skip every gate.
          </p>
        </div>

        {/* the measurement: 500 in at the top, 0 out at the bottom */}
        <div className="w-full border border-line p-8 lg:w-[300px]">
          <p className="text-[11px] uppercase tracking-[0.2em] text-ink3">measured</p>

          <p className="tnum mt-6 text-[3.4rem] font-medium leading-none tracking-tight tabular-nums"
             style={{ color: done ? "var(--accent)" : "var(--ink)" }}>
            {count}
          </p>
          <p className="mt-1 h-4 text-[12px] text-ink2">
            {done ? "pop-ups" : "agent events"}
          </p>

          {/* the fall itself, as a line draining top to bottom */}
          <div className="relative my-6 h-24">
            <div className="absolute left-0 top-0 h-full w-px bg-line" />
            <div
              className="absolute left-0 top-0 w-px bg-accent"
              style={{ height: `${Math.round(fall * 100)}%` }}
            />
            <div className="pl-5 text-[11px] leading-[1.9] text-ink3">
              {GATES.map(([q], i) => (
                <p
                  key={q}
                  className="transition-all duration-300"
                  style={{ opacity: i < lit ? 1 : 0.3, color: i < lit ? "var(--ink-2)" : "var(--ink-3)" }}
                >
                  {q}
                </p>
              ))}
            </div>
          </div>

          <p className="border-t border-line pt-4 text-[11px] leading-relaxed text-ink3">
            500 events across five concurrent sessions produced zero pop-ups.
          </p>
        </div>
      </div>
    </Frame>
  );
}
