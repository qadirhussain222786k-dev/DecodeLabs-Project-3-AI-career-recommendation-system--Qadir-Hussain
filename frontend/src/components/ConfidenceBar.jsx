import React from "react";

export default function ConfidenceBar({ value }) {
  const pct = Math.round(value * 100);
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-navy-300 mb-1.5">
        <span>Match confidence</span>
        <span className="font-semibold text-brand-glow">{pct}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-navy-600 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-glow transition-all duration-500"
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}
