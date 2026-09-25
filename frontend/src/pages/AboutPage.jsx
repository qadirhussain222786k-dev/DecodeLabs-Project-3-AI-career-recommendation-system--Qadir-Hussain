import React from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader.jsx";

const VALUES = [
  {
    title: "Real machine learning",
    description:
      "Recommendations come from a trained Scikit-learn classifier's prediction probabilities, not hardcoded rules.",
  },
  {
    title: "Transparent by design",
    description:
      "Skill-gap analysis and learning roadmaps use an openly documented mapping, kept separate from the ML layer so it's easy to explain.",
  },
  {
    title: "Built for learning",
    description:
      "This project started as an AI internship exercise: a realistic, end-to-end system rather than a toy demo.",
  },
];

export default function AboutPage() {
  return (
    <div>
      <PageHeader
        eyebrow="About"
        title="Career guidance grounded in real data science"
        description="A small team project exploring how a trained ML model can turn skills and interests into practical career direction."
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-20 flex flex-col gap-10">
        <p className="text-navy-200 leading-relaxed">
          The AI Career &amp; Skill Recommendation System was built to answer a
          simple question: given someone's education, skills, and interests,
          which career paths genuinely fit? Rather than relying on a fixed set
          of if/else rules, the system trains and evaluates several
          classification models on a documented dataset, then uses the
          winning model's own confidence scores to rank recommendations.
        </p>

        <div className="grid sm:grid-cols-3 gap-5">
          {VALUES.map((v) => (
            <div
              key={v.title}
              className="rounded-2xl border border-white/5 bg-navy-800/60 p-5"
            >
              <h3 className="font-display font-semibold text-white">{v.title}</h3>
              <p className="mt-2 text-sm text-navy-300">{v.description}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-white/5 bg-navy-800/60 p-6">
          <h2 className="font-display text-lg font-semibold text-white">
            Why this exists
          </h2>
          <p className="mt-2 text-sm text-navy-300 leading-relaxed">
            Choosing a career direction is hard, especially early on when it's
            unclear how your current skills map to available roles. This tool
            gives a starting point - a ranked, explainable set of suggestions
            you can use alongside your own judgment and conversations with
            mentors, not in place of them.
          </p>
        </div>

        <div>
          <Link
            to="/assessment"
            className="inline-block rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-400"
          >
            Try the assessment
          </Link>
        </div>
      </div>
    </div>
  );
}
