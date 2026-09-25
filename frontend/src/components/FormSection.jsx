import React from "react";

export default function FormSection({ title, description, children }) {
  return (
    <section className="rounded-2xl border border-white/5 bg-navy-800/60 p-5 sm:p-6 flex flex-col gap-4">
      <div>
        <h2 className="font-display text-base font-semibold text-white">{title}</h2>
        {description && (
          <p className="text-sm text-navy-300 mt-0.5">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}
