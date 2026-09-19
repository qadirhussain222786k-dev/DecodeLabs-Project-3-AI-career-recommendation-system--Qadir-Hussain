import React from "react";
import { Link } from "react-router-dom";

const FEATURES = [
  {
    title: "ML-Powered Predictions",
    description:
      "A trained Scikit-learn classification model ranks career fits using real prediction probabilities - not hardcoded rules.",
  },
  {
    title: "Skill Gap Analysis",
    description:
      "See exactly which skills you already have, which need improvement, and which are missing for each recommended role.",
  },
  {
    title: "Personalized Roadmap",
    description:
      "Get a phased, beginner-friendly learning path built from your specific skill gaps.",
  },
];

export default function HomePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
      <div className="text-center max-w-2xl mx-auto flex flex-col gap-4">
        <span className="inline-block self-center rounded-full bg-brand-50 text-brand-700 text-xs font-semibold px-3 py-1">
          AI-Assisted Career Guidance
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
          Discover careers that fit your skills and interests
        </h1>
        <p className="text-gray-600">
          Answer a short assessment about your education, skills, and interests. A
          trained machine-learning model will suggest careers you're well-suited
          for, backed by a transparent skill-gap breakdown and learning roadmap.
        </p>
        <div>
          <Link
            to="/assessment"
            className="inline-block rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 transition-colors"
          >
            Start Your Assessment
          </Link>
        </div>
      </div>

      <div className="mt-16 grid sm:grid-cols-3 gap-6">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="rounded-2xl border border-gray-200 bg-white p-5"
          >
            <h3 className="font-semibold text-gray-900">{f.title}</h3>
            <p className="text-sm text-gray-500 mt-2">{f.description}</p>
          </div>
        ))}
      </div>

      <p className="mt-12 text-center text-xs text-gray-400 max-w-xl mx-auto">
        This tool provides AI-assisted suggestions based on patterns learned from
        training data and the information you provide. It does not determine
        anyone's objectively "correct" career.
      </p>
    </div>
  );
}
