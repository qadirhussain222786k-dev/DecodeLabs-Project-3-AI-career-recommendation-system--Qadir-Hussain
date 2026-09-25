import React from "react";

export default function LoadingSpinner({ label = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <div className="h-10 w-10 rounded-full border-4 border-navy-600 border-t-brand-400 animate-spin" />
      <p className="text-sm text-navy-300">{label}</p>
    </div>
  );
}
