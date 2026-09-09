import Frame from "./Frame";

/* Four rows, not three: the collapsed dot is the point of the section, so it
   belongs in the same object as the queue rather than in a sentence about it. */
const Q: [string, string, string, string][] = [
  ["api-server",    "git push --force origin main",   "14m", "var(--destr)"],
  ["web-client",    "npm run build",                  "6m",  "var(--block)"],
  ["data-pipeline", "which schema should I migrate?", "2m",  "var(--ask)"],
];

export default function Agents() {
  return (
    <Frame n="05" label="Every session">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <p className="max-w-[34ch] text-[14px] leading-relaxed text-ink2">
          Run five at once. Ranked by urgency, not by which shouted last.
          Click a row to jump to that window.
        </p>

        <div>
          <div className="border border-line">
            {Q.map(([p, d, t, c], i) => (
              <div
                key={p}
                className={`flex items-center gap-4 px-5 py-4 transition-colors hover:bg-panel ${i ? "border-t border-line" : ""}`}
              >
                <span className="size-2 shrink-0 rounded-full" style={{ background: c }} />
                <span className="w-[7.5rem] shrink-0 text-[13px] text-ink">{p}</span>
                <span className="hidden flex-1 truncate text-[12px] text-ink3 sm:block">{d}</span>
                <span className="tnum ml-auto text-[12px] sm:ml-0" style={{ color: c }}>{t}</span>
              </div>
            ))}
            <div className="flex items-center gap-4 border-t border-line bg-panel px-5 py-4">
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
      </div>
    </Frame>
  );
}
