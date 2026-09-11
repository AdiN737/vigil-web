"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Widget, { type Tier } from "../components/Widget";
import Footer from "../components/Footer";
import { useCanAnimate } from "../lib/useCanAnimate";
import { DOWNLOAD_URL } from "../lib/site";

/* The sandbox. You trigger the events; Vigil reacts exactly as it would on
   your machine — including staying silent, which is the part a screenshot
   can never show.

   Every rule here is the shipped one: tiers 1-3 never open the pill, one ping
   per session, destructive skips the rate limit. */

type Kind = "build" | "test" | "question" | "force" | "deploy";

const EVENTS: { kind: Kind; label: string; detail: string; tier: number; colour: string; danger?: boolean }[] = [
  { kind: "test",     label: "run tests",   detail: "npm test",                    tier: 2, colour: "var(--work)" },
  { kind: "build",    label: "build",       detail: "npm run build",               tier: 5, colour: "var(--block)" },
  { kind: "question", label: "ask you",     detail: "which schema should I use?",  tier: 4, colour: "var(--ask)" },
  { kind: "force",    label: "force-push",  detail: "git push --force origin main", tier: 7, colour: "var(--destr)", danger: true },
  { kind: "deploy",   label: "deploy",      detail: "terraform apply",             tier: 7, colour: "var(--destr)", danger: true },
];

type Session = {
  id: number;
  name: string;
  provider: "Claude" | "Codex";
  tier: number;
  colour: string;
  detail: string;
  danger?: boolean;
  pinged: boolean;
};

type Log = { text: string; colour?: string };

const NAMES = ["api-server", "web-client", "data-pipeline", "auth-svc", "billing"];

export default function DemoPage() {
  const canAnimate = useCanAnimate();
  const [sessions, setSessions] = useState<Session[]>([
    { id: 0, name: "api-server", provider: "Claude", tier: 2, colour: "var(--work)", detail: "npm test", pinged: false },
  ]);
  const [log, setLog] = useState<Log[]>([
    { text: "● api-server — agent working", colour: "var(--work)" },
  ]);
  const [suppressed, setSuppressed] = useState(0);
  const [opened, setOpened] = useState(0);
  const [events, setEvents] = useState(1);
  const [active, setActive] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const say = useCallback((text: string, colour?: string) => {
    setLog((l) => [...l.slice(-7), { text, colour }]);
  }, []);

  const fire = (e: (typeof EVENTS)[number]) => {
    const s = sessions[active];
    if (!s) return;

    // Decide FIRST, outside any updater. Calling setOpened/setSuppressed/say
    // from inside a setSessions updater makes it impure — React invokes
    // updaters twice under StrictMode and may replay them in production, which
    // double-counted every event and double-wrote every log line.
    const needsYou = e.tier >= 4;
    // The shipped gates: tiers 1-3 never open the pill; one ping per session,
    // unless the command is destructive, which skips every limit.
    const willOpen = needsYou && (!s.pinged || e.tier === 7);

    setEvents((n) => n + 1);
    setSessions((prev) =>
      prev.map((x, n) =>
        n === active
          ? { ...x, tier: e.tier, colour: e.colour, detail: e.detail,
              danger: e.danger, pinged: x.pinged || willOpen }
          : x,
      ),
    );

    if (willOpen) {
      setOpened((n) => n + 1);
      say(`⚠ ${s.name} — ${e.detail}`, e.colour);
    } else {
      setSuppressed((n) => n + 1);
      say(
        needsYou
          ? `· ${s.name} — ${e.detail}  (already told you)`
          : `● ${s.name} — ${e.detail}`,
        needsYou ? "var(--ink-3)" : e.colour,
      );
    }
  };

  const decide = (id: number, ok: boolean) => {
    setSessions((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, tier: ok ? 3 : 1, colour: ok ? "var(--done)" : "var(--idle)",
              detail: ok ? "done" : "stopped", danger: false, pinged: false }
          : s,
      ),
    );
    const s = sessions.find((x) => x.id === id);
    say(ok ? `✓ ${s?.name} — approved from Vigil` : `✗ ${s?.name} — denied, nothing ran`,
        ok ? "var(--done)" : "var(--destr)");
  };

  const addSession = () => {
    // Same rule as fire(): no side effects inside an updater.
    if (sessions.length >= NAMES.length) return;
    const name = NAMES[sessions.length];
    setSessions((prev) => [
      ...prev,
      { id: Date.now(), name, provider: sessions.length % 2 ? "Codex" : "Claude", tier: 2, colour: "var(--work)", detail: "npm run dev", pinged: false },
    ]);
    say(`● ${name} — agent working`, "var(--work)");
  };

  const reset = () => {
    timers.current.forEach(clearTimeout);
    setSessions([{ id: 0, name: "api-server", provider: "Claude", tier: 2, colour: "var(--work)", detail: "npm test", pinged: false }]);
    setLog([{ text: "● api-server — agent working", colour: "var(--work)" }]);
    setSuppressed(0); setOpened(0); setEvents(1); setActive(0);
  };

  // Ranked the way the widget ranks: most urgent first, never most recent.
  const queue = [...sessions].filter((s) => s.tier >= 4).sort((a, b) => b.tier - a.tier);
  const top = queue[0];

  return (
    <>
      <main>
        <section className="marks relative overflow-hidden border-b border-line">
          <div className="mx-auto max-w-[1180px] px-6 py-14 lg:py-20">
            <p className="idx"><b>Demo</b><span>drive it yourself</span></p>
            <h1 className="mt-6 max-w-[18ch] text-[clamp(2rem,5.5vw,3.4rem)] font-medium leading-[1] tracking-[-0.04em]">
              Everything except installing it.
            </h1>
            <p className="mt-6 max-w-[56ch] text-[15px] leading-relaxed text-ink2">
              Fire events at the agent and watch Vigil decide whether you
              deserve to be interrupted. The gates below are the ones that
              ship — including the ones that keep it quiet.
            </p>
          </div>
        </section>

        <section className="border-b border-line">
          <div className="mx-auto grid max-w-[1180px] gap-8 px-6 py-12 lg:grid-cols-[1fr_1fr]">
            {/* controls + log */}
            <div className="flex flex-col gap-6">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-ink3">
                  make the agent do something
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {EVENTS.map((e) => (
                    <button
                      key={e.kind}
                      onClick={() => fire(e)}
                      className="border border-line px-3.5 py-2 text-[11px] uppercase tracking-[0.14em] text-ink2 transition-colors hover:border-line2 hover:text-ink"
                      style={{ borderColor: e.tier === 7 ? "color-mix(in srgb, var(--destr) 45%, transparent)" : undefined }}
                    >
                      {e.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-ink3">sessions</p>
                  <button
                    onClick={addSession}
                    className="text-[11px] uppercase tracking-[0.14em] text-ink3 transition-colors hover:text-accent"
                  >
                    + add session
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {sessions.map((s, n) => (
                    <button
                      key={s.id}
                      onClick={() => setActive(n)}
                      className="flex items-center gap-2 border px-3 py-1.5 text-[11px] transition-colors"
                      style={{
                        borderColor: n === active ? s.colour : "var(--line)",
                        color: n === active ? "var(--ink)" : "var(--ink-3)",
                      }}
                    >
                      <span className="size-1.5 rounded-full" style={{ background: s.colour }} />
                      {s.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 border border-line bg-panel">
                <div className="border-b border-line px-4 py-2.5 text-[11px] uppercase tracking-[0.16em] text-ink3">
                  what Vigil did
                </div>
                <div className="h-[210px] space-y-1.5 overflow-hidden p-4 text-[12px] leading-relaxed">
                  {log.map((l, n) => (
                    <p key={n} style={{ color: l.colour ?? "var(--ink-2)" }}>{l.text}</p>
                  ))}
                </div>
              </div>

              <button
                onClick={reset}
                className="self-start border border-line px-4 py-2 text-[11px] uppercase tracking-[0.16em] text-ink3 transition-colors hover:border-line2 hover:text-ink2"
              >
                reset
              </button>
            </div>

            {/* your screen */}
            <div>
              <div className="relative aspect-[4/3] overflow-hidden border border-line bg-[#0A0C10]">
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      "linear-gradient(#FFFFFF09 1px,transparent 1px),linear-gradient(90deg,#FFFFFF09 1px,transparent 1px)",
                    backgroundSize: "30px 30px",
                  }}
                />
                <div aria-hidden className="absolute inset-x-0 bottom-0 h-6 border-t border-line/80 bg-panel/80" />

                <div className="absolute bottom-9 right-4 flex flex-col items-end gap-2">
                  <AnimatePresence initial={false}>
                    {queue.slice(0, 3).map((s) => (
                      <motion.div
                        key={s.id}
                        initial={canAnimate ? { opacity: 0, x: 20 } : false}
                        animate={{ opacity: 1, x: 0 }}
                        exit={canAnimate ? { opacity: 0, x: 20 } : undefined}
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      >
                        <Widget
                          idPrefix={`s${s.id}`}
                          tier={{ colour: s.colour, label: "", open: true, project: s.name, provider: s.provider,
                                  detail: s.detail, danger: s.danger }}
                          onApprove={() => decide(s.id, true)}
                          onDeny={() => decide(s.id, false)}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {!top && (
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-ink3">nothing needs you</span>
                      <Widget
                        idPrefix="quiet"
                        tier={{ colour: sessions[active]?.colour ?? "var(--idle)", label: "", open: false }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* the scoreboard — the restraint, counted */}
              <dl className="mt-4 grid grid-cols-3 border border-line text-center">
                {[
                  ["events", events, "var(--ink)"],
                  ["suppressed", suppressed, "var(--ink-2)"],
                  ["interrupted you", opened, "var(--accent)"],
                ].map(([k, v, c], n) => (
                  <div key={k as string} className={n ? "border-l border-line py-4" : "py-4"}>
                    <dd className="tnum text-[26px] font-medium" style={{ color: c as string }}>{v as number}</dd>
                    <dt className="mt-1 text-[10.5px] uppercase tracking-[0.14em] text-ink3">{k as string}</dt>
                  </div>
                ))}
              </dl>

              <p className="mt-4 text-[12px] leading-relaxed text-ink3">
                Fire the same event twice. The second one is suppressed — one
                ping per session. Force-push always gets through.
              </p>
            </div>
          </div>
        </section>

        <section className="border-b border-line">
          <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-6 px-6 py-12">
            <p className="max-w-[46ch] text-[15px] leading-relaxed text-ink2">
              That is the whole product. The current download watches Claude Code
              instead of these buttons.
            </p>
            <a
              href={DOWNLOAD_URL}
              className="group flex items-center gap-6 bg-accent px-6 py-4 text-[13px] uppercase tracking-[0.18em] text-[color:var(--accent-ink)] transition-transform hover:-translate-y-0.5"
            >
              Download
              <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
