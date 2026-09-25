import React from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader.jsx";

const STEPS = [
  {
    number: "01",
    title: "Complete the assessment",
    description:
      "Answer questions about your education, skill proficiency, interests, experience, and work preferences.",
  },
  {
    number: "02",
    title: "The model predicts your fit",
    description:
      "A trained classification model turns your profile into a probability for each of 10 career roles, using model.predict_proba().",
  },
  {
    number: "03",
    title: "Skills are compared to each role",
    description:
      "For every recommended career, your skills are checked against that role's typical profile to find what matches, what's missing, and what needs work.",
  },
  {
    number: "04",
    title: "Get a learning roadmap",
    description:
      "Each recommendation comes with a phased roadmap built from your specific skill gaps - a concrete next step, not just a label.",
  },
];

export default function HowItWorksPage() {
  return (
    <div>
      <PageHeader
        eyebrow="How It Works"
        title="From your profile to a ranked recommendation"
        description="Four steps connect what you tell us to what the model predicts."
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-20">
        <ol className="flex flex-col">
          {STEPS.map((step, idx) => (
            <li key={step.number} className="flex gap-5">
              <div className="flex flex-col items-center">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brand-400/40 bg-brand-500/10 font-display text-sm font-semibold text-brand-glow">
                  {step.number}
                </span>
                {idx < STEPS.length - 1 && (
                  <span className="mt-1 w-px flex-1 bg-white/10" />
                )}
              </div>
              <div className="pb-10">
                <h3 className="font-display font-semibold text-white">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-sm text-navy-300 max-w-xl">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <div className="rounded-2xl border border-white/5 bg-navy-800/60 p-6 mt-2">
          <h2 className="font-display text-lg font-semibold text-white">
            What "confidence" means
          </h2>
          <p className="mt-2 text-sm text-navy-300 leading-relaxed">
            The percentage shown next to each career is the model's predicted
            probability that your profile belongs to that career class,
            relative to the other nine. Higher numbers mean the model found
            stronger patterns in your profile matching that role in the
            training data - it isn't a guarantee, but a data-driven estimate.
          </p>
        </div>

        <div className="mt-8">
          <Link
            to="/assessment"
            className="inline-block rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-400"
          >
            Start your assessment
          </Link>
        </div>
      </div>
    </div>
  );
}
