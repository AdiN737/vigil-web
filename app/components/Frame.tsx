"use client";

import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useSeen } from "../lib/useSeen";

/* Every section is the same object: a rule that draws itself across the page,
   an index in the left margin, and content on a fixed measure.

   The rule is the whole entrance. A page built on a visible grid should
   assemble like one — lines first, then what hangs off them — rather than
   sliding blocks around. */
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
  const still = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const seen = useSeen(ref);
  const on = still || seen;

  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <section id={id} ref={ref} className="relative">
      {/* the section rule, drawn left to right */}
      <motion.div
        aria-hidden
        className="h-px origin-left bg-line"
        initial={false}
        animate={{ scaleX: on ? 1 : 0 }}
        transition={{ duration: 0.9, ease }}
      />

      <div className={`mx-auto max-w-[1180px] px-6 ${tight ? "py-16" : "py-20 lg:py-28"}`}>
        <motion.p
          className="idx"
          initial={false}
          animate={{ opacity: on ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 0.25, ease }}
        >
          <b>{n}</b>
          <span>{label}</span>
        </motion.p>

        <motion.div
          className="mt-10"
          initial={false}
          animate={on ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
          transition={{ duration: 0.7, delay: 0.34, ease }}
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
}
