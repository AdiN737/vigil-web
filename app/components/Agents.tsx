"use client";

import { useRef } from "react";
import Frame from "./Frame";
import { useThrough } from "../lib/useTrack";
import { useCanAnimate } from "../lib/useCanAnimate";

/* Rows arrive in the order the widget ranks them — most urgent first, which is
   the claim the section makes. Tier colours are the real ones from
   vigil_widget.py, so the red-orange-yellow ramp reads as a ranking rather
   than three near-identical oranges. */
const Q: [string, string, string, string][] = [
  ["api-server",    "git push --force origin main",   "14m", "var(--destr)"],
  ["web-client",    "npm run build",                  "6m",  "var(--block)"],
  ["data-pipeline", "which schema should I migrate?", "2m",  "var(--ask)"],
];

export default function Agents() {
  const ref = useRef<HTMLDivElement>(null);
  const canAnimate = useCanAnimate();
  const p = useThrough(ref);

  // If we cannot animate, render the finished state outright. Relying on the
  // progress hook to fail open is not enough: it only rests at 1 when it
  // DETECTS a hidden document, and visibilitychange does not always arrive.
  // Gating the computation itself has no such dependency.
  const landed = canAnimate
    ? Math.min(Q.length + 1, Math.floor(Math.max(0, p - 0.05) * 7))
    : Q.length + 1;

  return (
    <Frame n="05" label="Every session">
      <div ref={ref} className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <p className="max-w-[34ch] text-[14px] leading-relaxed text-ink2">
          Run five at once. Ranked by urgency, not by which shouted last.
          Click a row to jump to that window.
        </p>

        <div className="overflow-hidden border border-line">
          {Q.map(([proj, detail, age, colour], i) => {
            const on = i < landed;
            return (
              // Visibility here is STATE, not decoration: a row that fails to
              // animate is a row nobody can read. CSS transition, so the style
              // attribute always carries the target even with rAF suspended.
              <div
                key={proj}
                className={`flex items-center gap-4 px-5 py-4 transition-[opacity,transform] duration-500 ease-out hover:bg-panel ${
                  i ? "border-t border-line" : ""
                }`}
                style={{
                  opacity: on ? 1 : 0,
                  transform: on ? "translateX(0)" : "translateX(28px)",
                  transitionDelay: on ? `${i * 90}ms` : "0ms",
                }}
              >
                <span className="size-2 shrink-0 rounded-full" style={{ background: colour }} />
                <span className="w-[7.5rem] shrink-0 text-[13px] text-ink">{proj}</span>
                <span className="hidden flex-1 truncate text-[12px] text-ink3 sm:block">
                  {detail}
                </span>
                <span className="tnum ml-auto text-[12px] sm:ml-0" style={{ color: colour }}>
                  {age}
                </span>
              </div>
            );
          })}

          {/* the collapsed state belongs in the same object as the queue, not
              in a sentence about it */}
          <div
            className="flex items-center gap-4 border-t border-line bg-panel px-5 py-4 transition-opacity duration-500"
            style={{ opacity: landed > Q.length ? 1 : 0 }}
          >
            <span className="relative flex size-2 shrink-0">
              <span className="size-2 rounded-full bg-[color:var(--destr)]" />
              <span className="absolute -right-1.5 -top-1.5 grid size-3 place-items-center rounded-full bg-ink text-[7px] font-bold text-ground">
                3
              </span>
            </span>
            <span className="text-[12px] text-ink3">
              collapsed — three waiting, nothing on screen
            </span>
          </div>
        </div>
      </div>
    </Frame>
  );
}
