import Frame from "./Frame";

/* Straight from TIERS in vigil_widget.py. Four of seven reach you. */
const ROWS: [string, string, string, string][] = [
  ["1", "idle",        "var(--idle)",  ""],
  ["2", "working",     "var(--work)",  ""],
  ["3", "done",        "var(--done)",  ""],
  ["4", "question",    "var(--ask)",   "opens"],
  ["5", "blocked",     "var(--block)", "opens"],
  ["6", "failed",      "var(--fail)",  "opens"],
  ["7", "destructive", "var(--destr)", "always"],
];

export default function States() {
  return (
    <Frame n="04" label="Seven states">
      <p className="max-w-[52ch] text-[14px] leading-relaxed text-ink2">
        Three never interrupt you — and those three are most of the day.
      </p>

      <div className="mt-8 border-t border-line">
        {ROWS.map(([n, name, c, act]) => (
          <div
            key={name}
            className="grid grid-cols-[2.5rem_1fr_auto] items-center gap-4 border-b border-line py-3.5 text-[13px] transition-colors hover:bg-panel"
          >
            <span className="tnum text-ink3">{n}</span>
            <span className="flex items-center gap-3" style={{ color: c }}>
              <span className="size-2 rounded-full" style={{ background: c }} />
              {name}
            </span>
            <span
              className="text-[11px] uppercase tracking-[0.16em]"
              style={{ color: act ? "var(--accent)" : "var(--ink-3)" }}
            >
              {act || "colour only"}
            </span>
          </div>
        ))}
      </div>
    </Frame>
  );
}
