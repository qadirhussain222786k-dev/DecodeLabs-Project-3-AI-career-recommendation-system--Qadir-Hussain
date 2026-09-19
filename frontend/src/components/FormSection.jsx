import React from "react";

export default function FormSection({ title, description, children }) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 flex flex-col gap-4">
      <div>
        <h2 className="text-base font-semibold text-gray-900">{title}</h2>
        {description && <p className="text-sm text-gray-500 mt-0.5">{description}</p>}
      </div>
      {children}
    </section>
  );
}
