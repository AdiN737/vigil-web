import { DOWNLOAD_URL, REPO_URL } from "../lib/site";

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-4 px-6 py-10 text-[11px] uppercase tracking-[0.18em] text-ink3">
        <span>Vigil — free, no account, no telemetry</span>
        <nav className="flex gap-6">
          <a href={REPO_URL} className="hover:text-ink2">source</a>
          <a href={DOWNLOAD_URL} className="text-accent hover:underline">download</a>
        </nav>
      </div>
    </footer>
  );
}
