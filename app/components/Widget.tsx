"use client";

import { motion } from "motion/react";

export type Tier = {
  colour: string;
  label: string;
  project?: string;
  detail?: string;
  provider?: "Claude" | "Codex";
  open: boolean;
  danger?: boolean;
};

export default function Widget({
  tier,
  onApprove,
  onDeny,
  idPrefix = "vigil",
}: {
  tier: Tier;
  onApprove?: () => void;
  onDeny?: () => void;
  idPrefix?: string;
}) {
  const spring = { type: "spring" as const, stiffness: 460, damping: 38 };

  if (!tier.open) {
    return (
      <motion.div
        layoutId={`${idPrefix}-body`}
        transition={spring}
        className="size-[26px] rounded-full"
        style={{
          background: tier.colour,
          boxShadow: `0 0 0 6px color-mix(in srgb, ${tier.colour} 12%, transparent)`,
        }}
        aria-label={`Vigil: ${tier.label}`}
      />
    );
  }

  return (
    <motion.div
      layoutId={`${idPrefix}-body`}
      transition={spring}
      className="w-[292px] rounded-[14px] border-2 px-4 py-3 shadow-[0_20px_70px_#0009]"
      style={{ borderColor: tier.colour, background: "var(--panel)" }}
    >
      <motion.div layout="position" className="flex items-center justify-between gap-3">
        <span className="tnum text-[10px] uppercase tracking-[0.12em] text-ink3">
          {tier.provider ?? "Claude"}
        </span>
        <span className="truncate text-[13px] font-medium text-ink">{tier.project}</span>
        <span className="size-2 shrink-0 rounded-full" style={{ background: tier.colour }} />
      </motion.div>
      <motion.p layout="position" className="mt-1 truncate text-right text-[11.5px] text-ink2">
        {tier.detail}
      </motion.p>
      <motion.div layout="position" className="mt-3 flex items-center justify-between gap-2">
        <span className="tnum text-[10px]" style={{ color: tier.colour }}>needs you</span>
        <div className="flex gap-2">
          <button onClick={onApprove} disabled={!onApprove}
            className="px-3 py-1 text-[11px] font-medium transition-[transform,opacity] hover:-translate-y-px disabled:cursor-default"
            style={tier.danger ? { background: "var(--block)", color: "#12161d" } : { border: "1px solid var(--done)", color: "var(--done)" }}>
            {tier.danger ? "Approve anyway" : "Approve"}
          </button>
          <button onClick={onDeny} disabled={!onDeny}
            className="border border-ink3 px-3 py-1 text-[11px] text-ink3 transition-colors hover:border-ink2 hover:text-ink2 disabled:cursor-default">
            Deny
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
