import React, { useState } from "react";
import AssessmentForm from "../components/AssessmentForm.jsx";
import ResultsDashboard from "../components/ResultsDashboard.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import ErrorBanner from "../components/ErrorBanner.jsx";
import { getCareerRecommendations } from "../services/api.js";

export default function AssessmentPage() {
  const [status, setStatus] = useState("form"); // form | loading | results | error
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [lastPayload, setLastPayload] = useState(null);

  const handleSubmit = async (payload) => {
    setLastPayload(payload);
    setStatus("loading");
    setError(null);
    try {
      const data = await getCareerRecommendations(payload);
      setResults(data);
      setStatus("results");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  const handleRetry = () => {
    if (lastPayload) {
      handleSubmit(lastPayload);
    } else {
      setStatus("form");
    }
  };

  const handleStartOver = () => {
    setResults(null);
    setError(null);
    setStatus("form");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Career Assessment</h1>
        <p className="text-sm text-gray-500 mt-1">
          Fill out the sections below. All fields help the model give you a more
          accurate recommendation.
        </p>
      </div>

      {status === "error" && (
        <div className="mb-6">
          <ErrorBanner message={error} onRetry={handleRetry} />
        </div>
      )}

      {status === "loading" && <LoadingSpinner label="Analyzing your profile..." />}

      {status === "form" && (
        <AssessmentForm onSubmit={handleSubmit} submitting={false} />
      )}

      {status === "results" && results && (
        <ResultsDashboard data={results} onStartOver={handleStartOver} />
      )}
    </div>
  );
}
