"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DOWNLOAD_URL, REPO_URL, VERSION } from "../lib/site";

const LINKS = [
  { href: "/demo", label: "demo" },
  { href: "/roadmap", label: "roadmap" },
];

/* One hairline row, three destinations, no dropdowns. The competitor runs six
   nav items plus a language toggle plus a star count; three reads as more
   serious. The version/platform chip stays on every page — it does three jobs
   at once: scope, freshness, and "this is a real shipped binary". */
export default function Nav() {
  const path = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-ground/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1180px] items-center gap-6 px-6 py-3.5">
        <Link
          href="/"
          className="group flex items-center gap-2.5 text-[13px] uppercase tracking-[0.22em] text-ink"
        >
          <span className="relative grid size-2 place-items-center">
            <span className="absolute inset-0 rounded-full bg-[color:var(--work)]" />
            <span className="absolute inset-0 animate-ping rounded-full bg-[color:var(--work)] opacity-40" />
          </span>
          Vigil
        </Link>

        <nav className="ml-auto flex items-center gap-6 text-[11px] uppercase tracking-[0.2em]">
          {LINKS.map((l) => {
            const on = path === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className="relative py-1 transition-colors"
                style={{ color: on ? "var(--ink)" : "var(--ink-3)" }}
              >
                {l.label}
                {on && (
                  <span className="absolute inset-x-0 -bottom-px h-px bg-[color:var(--accent)]" />
                )}
              </Link>
            );
          })}
          <a
            href={REPO_URL}
            className="hidden py-1 text-ink3 transition-colors hover:text-ink2 sm:block"
          >
            github
          </a>
        </nav>

        <a
          href={DOWNLOAD_URL}
          className="border border-accent px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-accent transition-colors hover:bg-accent hover:text-[color:var(--accent-ink)]"
        >
          Download
        </a>

        <span className="hidden text-[10px] uppercase tracking-[0.2em] text-ink3 lg:block">
          {VERSION} · windows
        </span>
      </div>
    </header>
  );
}
