import React from "react";

export default function PageHeader({ eyebrow, title, description }) {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-14 pb-10 text-center flex flex-col gap-3">
      {eyebrow && (
        <span className="self-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-navy-200">
          {eyebrow}
        </span>
      )}
      <h1 className="font-display text-3xl sm:text-4xl font-semibold text-white tracking-tight">
        {title}
      </h1>
      {description && <p className="text-navy-300">{description}</p>}
    </div>
  );
}
