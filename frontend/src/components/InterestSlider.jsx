import React from "react";

const LABELS = ["Not interested", "Slightly interested", "Interested", "Very interested"];

export default function InterestSlider({ label, name, value, onChange }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={name} className="text-sm font-medium text-navy-100">
          {label}
        </label>
        <span className="text-xs text-navy-300">{LABELS[value]}</span>
      </div>
      <input
        id={name}
        name={name}
        type="range"
        min={0}
        max={3}
        step={1}
        value={value}
        onChange={(e) => onChange(name, Number(e.target.value))}
        className="w-full accent-brand-500"
        aria-valuetext={LABELS[value]}
      />
    </div>
  );
}
