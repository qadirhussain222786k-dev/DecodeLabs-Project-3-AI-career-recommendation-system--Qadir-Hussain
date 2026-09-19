import React from "react";

const LEVELS = [
  { value: 0, label: "None" },
  { value: 1, label: "Beginner" },
  { value: 2, label: "Intermediate" },
  { value: 3, label: "Advanced" },
];

export default function SkillLevelSelect({ label, name, value, onChange }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(name, Number(e.target.value))}
        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none"
      >
        {LEVELS.map((lvl) => (
          <option key={lvl.value} value={lvl.value}>
            {lvl.label}
          </option>
        ))}
      </select>
    </div>
  );
}
