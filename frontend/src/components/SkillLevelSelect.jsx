import React from "react";

const LEVELS = [
  { value: 0, label: "None" },
  { value: 1, label: "Beginner" },
  { value: 2, label: "Intermediate" },
  { value: 3, label: "Advanced" },
];

export default function SkillLevelSelect({ label, name, value, onChange }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-medium text-navy-100">
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(name, Number(e.target.value))}
        className="rounded-lg border border-white/10 bg-navy-800 px-3 py-2 text-sm text-white outline-none transition-colors focus:border-brand-400"
      >
        {LEVELS.map((lvl) => (
          <option key={lvl.value} value={lvl.value} className="bg-navy-800">
            {lvl.label}
          </option>
        ))}
      </select>
    </div>
  );
}
