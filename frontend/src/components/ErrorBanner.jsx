import React from "react";

export default function ErrorBanner({ message, onRetry }) {
  if (!message) return null;
  return (
    <div className="rounded-xl border border-rose-400/20 bg-rose-400/10 p-4 flex items-start justify-between gap-4">
      <div className="flex gap-3">
        <span className="text-rose-400 text-xl leading-none" aria-hidden="true">
          !
        </span>
        <p className="text-sm text-rose-200">{message}</p>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="shrink-0 text-sm font-medium text-rose-200 underline hover:text-white"
        >
          Try again
        </button>
      )}
    </div>
  );
}
