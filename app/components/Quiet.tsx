import Frame from "./Frame";

const GATES: [string, string][] = [
  ["actionable?",   "working, done and idle never open the pill"],
  ["told you yet?", "one ping per session, not one per event"],
  ["looking at it?","focused window gets silence"],
  ["too soon?",     "each ping doubles the quiet period, to 15 min"],
  ["batch it?",     "simultaneous prompts become one notice"],
];

export default function Quiet() {
  return (
    <Frame n="03" label="Why it stays quiet">
      <div className="grid gap-12 lg:grid-cols-[1fr_auto] lg:items-start">
        <div>
          <p className="max-w-[46ch] text-[14px] leading-relaxed text-ink2">
            Five gates stand between an event and your attention. Most events
            die at the first one.
          </p>

          <ol className="mt-8 border-t border-line">
            {GATES.map(([q, d], i) => (
              <li key={q} className="grid grid-cols-[2.5rem_1fr] gap-4 border-b border-line py-3.5">
                <span className="tnum text-[12px] text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[13px]">
                  <span className="text-ink">{q}</span>
                  <span className="text-ink3"> — {d}</span>
                </span>
              </li>
            ))}
          </ol>

          <p className="mt-6 text-[12px] leading-relaxed text-ink3">
            Except anything irreversible. <span className="text-[color:var(--destr)]">rm -rf</span>,{" "}
            <span className="text-[color:var(--destr)]">git push --force</span> skip every gate.
          </p>
        </div>

        {/* the measurement, as the object it is */}
        <div className="w-full border border-line p-8 lg:w-[300px]">
          <p className="text-[11px] uppercase tracking-[0.2em] text-ink3">measured</p>
          <p className="tnum mt-6 text-[3.4rem] font-medium leading-none tracking-tight">500</p>
          <p className="mt-1 text-[12px] text-ink2">agent events</p>
          <div className="my-6 h-px bg-line" />
          <p className="tnum text-[3.4rem] font-medium leading-none tracking-tight text-accent">0</p>
          <p className="mt-1 text-[12px] text-ink2">pop-ups</p>
          <p className="mt-6 border-t border-line pt-4 text-[11px] leading-relaxed text-ink3">
            five concurrent sessions
          </p>
        </div>
      </div>
    </Frame>
  );
}
