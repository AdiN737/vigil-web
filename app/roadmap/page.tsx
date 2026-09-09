import type { Metadata } from "next";
import Footer from "../components/Footer";
import { DOWNLOAD_URL, REPO_URL } from "../lib/site";

export const metadata: Metadata = {
  title: "Vigil — roadmap",
  description:
    "What ships today, what is being built, and where Vigil is headed. No promised dates.",
};

/* Obsidian's model, not Linear's: three buckets, no promised dates, and every
   shipped item tagged with the version that carried it. For a three-day-old
   free tool with no social proof, a live roadmap IS the social proof — it
   answers "is this abandoned?", which is the first thing anyone asks about a
   37 MB zip from a stranger.

   Rendered on the product's own state ladder: each item takes the colour of
   the tier it corresponds to. Shipped is `done` green, building is `working`
   blue, planned is `idle` grey. */
type Item = { title: string; note: string; tag?: string };

const SHIPPED: Item[] = [
  { title: "Approve and deny from the widget", tag: "v0.1.1",
    note: "The pill carries the buttons. Your answer goes straight back to the agent — no window switch, no terminal." },
  { title: "The five gates", tag: "v0.1.1",
    note: "Actionable, already-told-you, already-looking, too-soon, batching. 500 events across five sessions produced zero pop-ups." },
  { title: "Destructive detection", tag: "v0.1.1",
    note: "rm -rf, git push --force, drop table, terraform apply. Bypasses every rate limit and gets its own colour and its own button." },
  { title: "Unlimited concurrent sessions", tag: "v0.1",
    note: "Each tracked separately and ranked by urgency, not recency. Collapsed, the dot carries a count." },
  { title: "0.33s overhead per turn", tag: "v0.1",
    note: "Down from 7 seconds. The hook is a separate 750 KB binary with no UI framework linked into it." },
];

const BUILDING: Item[] = [
  { title: "macOS build",
    note: "Every OS-specific call is ported and the source is cross-platform. PyInstaller cannot cross-compile, so it needs building and testing on a Mac — that is the whole remaining gap." },
  { title: "Code signing",
    note: "SmartScreen warns on first run because the build is not signed. A certificate costs money the project has not spent." },
];

const PLANNED: Item[] = [
  { title: "Every agent, not just Claude Code",
    note: "ChatGPT, Gemini, Cursor. A browser extension for the web-based ones, bridged to the desktop widget so the tab and the desktop share one queue." },
  { title: "Answer from your phone",
    note: "The decision file the widget writes today is the same file a phone would write. The hard part — knowing when a human is genuinely needed — is already solved." },
  { title: "The desk device",
    note: "ESP32-S3, a 16-LED ring behind a diffuser, a round display, and a knurled dial you press to approve. A screen widget can only reach you while you are looking at a screen." },
];

function Bucket({
  label, colour, items, last,
}: { label: string; colour: string; items: Item[]; last?: boolean }) {
  return (
    <section className={last ? "" : "border-b border-line"}>
      <div className="mx-auto max-w-[1180px] px-6 py-14">
        <div className="flex items-center gap-3">
          <span className="size-2.5 rounded-full" style={{ background: colour }} />
          <h2 className="text-[11px] uppercase tracking-[0.22em]" style={{ color: colour }}>
            {label}
          </h2>
          <span className="tnum ml-auto text-[11px] text-ink3">{items.length}</span>
        </div>

        {/* the spine */}
        <ol className="relative mt-8 pl-8">
          <span
            aria-hidden
            className="absolute left-[3px] top-2 h-[calc(100%-1rem)] w-px"
            style={{ background: "var(--line)" }}
          />
          {items.map((it) => (
            <li key={it.title} className="relative pb-8 last:pb-0">
              <span
                aria-hidden
                className="absolute -left-8 top-[7px] size-[7px] rounded-full"
                style={{ background: colour }}
              />
              <div className="flex flex-wrap items-baseline gap-x-3">
                <h3 className="text-[15px] text-ink">{it.title}</h3>
                {it.tag && (
                  <span className="tnum border border-line px-1.5 py-0.5 text-[10px] text-ink3">
                    {it.tag}
                  </span>
                )}
              </div>
              <p className="mt-2 max-w-[68ch] text-[13.5px] leading-relaxed text-ink3">
                {it.note}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default function RoadmapPage() {
  return (
    <>
      <main>
        <section className="marks relative overflow-hidden border-b border-line">
          <div className="mx-auto max-w-[1180px] px-6 py-14 lg:py-20">
            <p className="idx"><b>Roadmap</b><span>where this is going</span></p>
            <h1 className="mt-6 max-w-[20ch] text-[clamp(2rem,5.5vw,3.4rem)] font-medium leading-[1] tracking-[-0.04em]">
              Same brain. Different body.
            </h1>
            <p className="mt-6 max-w-[58ch] text-[15px] leading-relaxed text-ink2">
              No dates, because I would only miss them. Shipped items carry the
              version that shipped them; everything else is honest about
              whether it exists yet.
            </p>
            <p className="mt-4 max-w-[58ch] text-[13px] leading-relaxed text-ink3">
              Vigil is three days old and free. If something here matters to
              you,{" "}
              <a href={`${REPO_URL}/issues`} className="text-ink2 underline underline-offset-4 hover:text-accent">
                open an issue
              </a>{" "}
              — that is genuinely how this gets prioritised.
            </p>
          </div>
        </section>

        <Bucket label="Shipped" colour="var(--done)" items={SHIPPED} />
        <Bucket label="Building" colour="var(--work)" items={BUILDING} />
        <Bucket label="Planned" colour="var(--idle)" items={PLANNED} last />

        <section className="border-t border-line">
          <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-6 px-6 py-12">
            <p className="max-w-[46ch] text-[15px] leading-relaxed text-ink2">
              Everything in <span className="text-[color:var(--done)]">Shipped</span> is
              in the build you can download right now.
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
