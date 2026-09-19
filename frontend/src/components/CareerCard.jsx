import React, { useState } from "react";
import ConfidenceBar from "./ConfidenceBar.jsx";
import SkillBadge from "./SkillBadge.jsx";

export default function CareerCard({ recommendation, rank }) {
  const [expanded, setExpanded] = useState(rank === 1);
  const {
    career,
    confidence,
    matched_skills: matchedSkills,
    missing_skills: missingSkills,
    skills_to_improve: skillsToImprove,
    learning_path: learningPath,
    explanation,
  } = recommendation;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full text-left p-5 flex flex-col gap-3"
        aria-expanded={expanded}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wide text-brand-600">
              #{rank} Recommendation
            </span>
            <h3 className="text-lg font-semibold text-gray-900">{career}</h3>
          </div>
          <span className="text-2xl font-bold text-brand-700">
            {Math.round(confidence * 100)}%
          </span>
        </div>
        <ConfidenceBar value={confidence} />
        <p className="text-sm text-gray-600">{explanation}</p>
      </button>

      {expanded && (
        <div className="border-t border-gray-100 p-5 flex flex-col gap-5">
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">
                Matched Skills
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {matchedSkills.length ? (
                  matchedSkills.map((s) => (
                    <SkillBadge key={s} variant="matched">
                      {s}
                    </SkillBadge>
                  ))
                ) : (
                  <span className="text-xs text-gray-400">None yet</span>
                )}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">
                Skills to Improve
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {skillsToImprove.length ? (
                  skillsToImprove.map((s) => (
                    <SkillBadge key={s} variant="improve">
                      {s}
                    </SkillBadge>
                  ))
                ) : (
                  <span className="text-xs text-gray-400">None</span>
                )}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">
                Missing Skills
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {missingSkills.length ? (
                  missingSkills.map((s) => (
                    <SkillBadge key={s} variant="missing">
                      {s}
                    </SkillBadge>
                  ))
                ) : (
                  <span className="text-xs text-gray-400">None</span>
                )}
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">
              Suggested Learning Roadmap
            </h4>
            <ol className="space-y-3">
              {learningPath.map((phase) => (
                <li key={phase.phase} className="flex gap-3">
                  <span className="mt-0.5 h-6 w-6 shrink-0 rounded-full bg-brand-100 text-brand-700 text-xs font-semibold flex items-center justify-center">
                    {phase.phase.match(/\d+/)?.[0] || "-"}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{phase.phase}</p>
                    <p className="text-sm text-gray-600">{phase.topics.join(", ")}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}
