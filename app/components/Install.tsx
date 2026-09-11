import Frame from "./Frame";
import { DOWNLOAD_URL, REPO_URL, SIZE, VERSION } from "../lib/site";

const STEPS: [string, string][] = [
  ["Extract the zip", "Right-click → Extract All. Not the zip preview — that unpacks to a temp folder and won't stick."],
  ["Run Install Vigil.bat", "Copies Vigil to ~/.vigil, connects Claude Code, and starts the widget."],
  ["Restart Claude Code", "Hooks load at session start, so open a fresh window."],
];

export default function Install() {
  return (
    <Frame n="06" label="Install" id="install">
      <div className="grid gap-12 lg:grid-cols-[1fr_auto] lg:items-start">
        <div>
          <p className="text-[14px] text-ink2">
            Two minutes. No Python, no terminal, no config.
          </p>

          <ol className="mt-8 border-t border-line">
            {STEPS.map(([t, d], i) => (
              <li key={t} className="grid grid-cols-[2.5rem_1fr] gap-4 border-b border-line py-5">
                <span className="tnum text-[12px] text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="text-[14px] text-ink">{t}</p>
                  <p className="mt-1.5 max-w-[52ch] text-[12px] leading-relaxed text-ink3">{d}</p>
                </div>
              </li>
            ))}
          </ol>

          <p className="mt-6 text-[12px] leading-relaxed text-ink3">
            The downloadable build supports Claude Code on Windows 10 &amp; 11. The Codex adapter is in source and being validated. macOS is ported but unbuilt — see the{" "}
            <a href={REPO_URL} className="text-ink2 underline underline-offset-4 hover:text-accent">
              repo
            </a>.
          </p>
        </div>

        <div className="w-full lg:w-[300px]">
          <a
            href={DOWNLOAD_URL}
            className="group flex items-center justify-between gap-8 border border-accent px-6 py-4 text-[13px] uppercase tracking-[0.18em] text-accent transition-colors hover:bg-accent hover:text-ground"
          >
            Download
            <span aria-hidden className="transition-transform group-hover:translate-x-1">&rarr;</span>
          </a>
          <dl className="mt-6 border-t border-line text-[12px]">
            {[["version", VERSION], ["size", SIZE], ["price", "free"], ["account", "none"], ["telemetry", "none"]].map(([k, v]) => (
              <div key={k} className="flex justify-between border-b border-line py-2.5">
                <dt className="text-ink3">{k}</dt>
                <dd className="text-ink2">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Frame>
  );
}
