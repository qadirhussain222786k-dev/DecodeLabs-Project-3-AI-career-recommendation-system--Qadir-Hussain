import React from "react";

const VARIANTS = {
  matched: "bg-emerald-400/10 text-emerald-300 ring-1 ring-emerald-400/20",
  missing: "bg-rose-400/10 text-rose-300 ring-1 ring-rose-400/20",
  improve: "bg-amber-400/10 text-amber-300 ring-1 ring-amber-400/20",
};

export default function SkillBadge({ children, variant = "matched" }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${VARIANTS[variant]}`}
    >
      {children}
    </span>
  );
}
