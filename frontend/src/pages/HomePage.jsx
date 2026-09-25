import React from "react";
import { Link } from "react-router-dom";

const FEATURES = [
  {
    title: "ML-powered predictions",
    description:
      "A trained Scikit-learn classifier ranks career fits using real prediction probabilities, not hardcoded rules.",
  },
  {
    title: "Skill gap analysis",
    description:
      "See exactly which skills you already have, which need work, and which are missing for each recommended role.",
  },
  {
    title: "Personalized roadmap",
    description:
      "Get a phased, beginner-friendly learning path built from your specific skill gaps.",
  },
];

const SAMPLE_SKILLS = ["Python", "Machine Learning", "Statistics"];

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-fade pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-20 grid lg:grid-cols-2 gap-14 items-center">
        <div className="flex flex-col gap-6">
          <span className="self-start rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-navy-200">
            AI-assisted career guidance
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold text-white tracking-tight leading-[1.1]">
            Find the career your skills already point to
          </h1>
          <p className="text-navy-300 text-base sm:text-lg max-w-xl">
            Answer a short assessment about your education, skills, and interests. Our AI-powered career assessment identifies the career paths that best match your profile, with a transparent skill-gap breakdown and personalized learning roadmap.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/assessment"
              className="rounded-lg bg-brand-500 px-6 py-3 text-sm font-medium text-white shadow-glow transition-colors hover:bg-brand-400"
            >
              Start your assessment
            </Link>
            <Link
              to="/how-it-works"
              className="rounded-lg border border-white/10 px-6 py-3 text-sm font-medium text-navy-100 transition-colors hover:border-white/25 hover:text-white"
            >
              See how it works
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-6 rounded-3xl bg-brand-500/10 blur-3xl" />
          <div className="relative rounded-2xl border border-white/10 bg-navy-800/80 p-6 shadow-card backdrop-blur">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-navy-300">
                #1 Recommendation
              </span>
              <span className="font-display text-2xl font-semibold text-brand-glow">
                91%
              </span>
            </div>
            <h3 className="mt-1 font-display text-xl font-semibold text-white">
              AI Engineer
            </h3>
            <div className="mt-3 h-2 w-full rounded-full bg-navy-600 overflow-hidden">
              <div className="h-full w-[91%] rounded-full bg-gradient-to-r from-brand-500 to-brand-glow" />
            </div>
            <div className="mt-5">
              <p className="text-xs font-medium text-navy-300 mb-2">
                Matched skills
              </p>
              <div className="flex flex-wrap gap-1.5">
                {SAMPLE_SKILLS.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-xs text-emerald-300 ring-1 ring-emerald-400/20"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-5 border-t border-white/5 pt-4">
              <p className="text-xs font-medium text-navy-300 mb-1">
                Next in your roadmap
              </p>
              <p className="text-sm text-navy-100">
                Deep Learning concepts &rarr; Model deployment
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pb-24">
        <div className="grid sm:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-white/5 bg-navy-800/60 p-5 transition-colors hover:border-white/10"
            >
              <h3 className="font-display font-semibold text-white">{f.title}</h3>
              <p className="text-sm text-navy-300 mt-2">{f.description}</p>
            </div>
          ))}
        </div>

        <p className="mt-14 text-center text-xs text-navy-400 max-w-xl mx-auto">
          This tool provides AI-assisted suggestions based on patterns learned
          from training data and the information you provide. It does not
          determine anyone's objectively "correct" career.
        </p>
      </div>
    </div>
  );
}
