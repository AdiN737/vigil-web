import type { ReactNode } from "react";

/* Every section is the same object: a full-width hairline rule, an index in
   the left margin, and content on a fixed measure. That repetition is the
   design — a spec sheet, not a series of pitches. */
export default function Frame({
  n,
  label,
  children,
  id,
  tight,
}: {
  n: string;
  label: string;
  children: ReactNode;
  id?: string;
  tight?: boolean;
}) {
  return (
    <section id={id} className="border-t border-line">
      <div
        className={`mx-auto max-w-[1180px] px-6 ${tight ? "py-16" : "py-20 lg:py-28"}`}
      >
        <p className="idx">
          <b>{n}</b>
          <span>{label}</span>
        </p>
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}
