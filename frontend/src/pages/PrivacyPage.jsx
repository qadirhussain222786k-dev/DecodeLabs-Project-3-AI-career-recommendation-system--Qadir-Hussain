import React from "react";
import PageHeader from "../components/PageHeader.jsx";

const SECTIONS = [
  {
    title: "1. What we collect",
    body: "The assessment form collects the education, skill, interest, experience, and work-preference values you enter. This information is sent to the backend API solely to generate your career recommendations.",
  },
  {
    title: "2. How it's used",
    body: "Your submitted profile is passed to the trained machine-learning model to produce predictions, and compared against a skill-gap knowledge base to build your results. It is not used to retrain the model automatically.",
  },
  {
    title: "3. Storage",
    body: "This demo project does not include a database or persistent storage layer - assessment submissions are processed in memory by the API to generate a response and are not stored afterward.",
  },
  {
    title: "4. Third parties",
    body: "No data from your assessment is shared with third parties or advertising services. This project displays no ads.",
  },
  {
    title: "5. Contact",
    body: "Questions about this policy can be sent through the Contact page.",
  },
];

export default function PrivacyPage() {
  return (
    <div>
      <PageHeader eyebrow="Legal" title="Privacy Policy" />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-20 flex flex-col gap-8">
        {SECTIONS.map((section) => (
          <div key={section.title}>
            <h2 className="font-display font-semibold text-white">
              {section.title}
            </h2>
            <p className="mt-2 text-sm text-navy-300 leading-relaxed">
              {section.body}
            </p>
          </div>
        ))}
        <p className="text-xs text-navy-400">Last updated: 2026</p>
      </div>
    </div>
  );
}
