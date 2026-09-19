import React from "react";

const VARIANTS = {
  matched: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  missing: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
  improve: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
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
