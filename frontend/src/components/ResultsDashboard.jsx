import React from "react";
import CareerCard from "./CareerCard.jsx";

export default function ResultsDashboard({ data, onStartOver }) {
  const { recommendations, model_name: modelName } = data;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Career Recommendation Results
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Ranked by predicted fit, using a trained {modelName || "machine learning"} model.
          </p>
        </div>
        <button
          type="button"
          onClick={onStartOver}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Start Over
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {recommendations.map((rec, idx) => (
          <CareerCard key={rec.career} recommendation={rec} rank={idx + 1} />
        ))}
      </div>
    </div>
  );
}
