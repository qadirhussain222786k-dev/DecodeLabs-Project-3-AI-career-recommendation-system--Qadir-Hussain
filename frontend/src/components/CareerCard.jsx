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
    <div className="rounded-2xl border border-white/5 bg-navy-800/60 shadow-card overflow-hidden transition-colors hover:border-white/10">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full text-left p-5 flex flex-col gap-3"
        aria-expanded={expanded}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="text-xs font-medium text-brand-glow">
              #{rank} Recommendation
            </span>
            <h3 className="font-display text-lg font-semibold text-white">
              {career}
            </h3>
          </div>
          <span className="font-display text-2xl font-semibold text-white">
            {Math.round(confidence * 100)}%
          </span>
        </div>
        <ConfidenceBar value={confidence} />
        <p className="text-sm text-navy-300">{explanation}</p>
      </button>

      {expanded && (
        <div className="border-t border-white/5 p-5 flex flex-col gap-5">
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <h4 className="text-xs font-medium text-navy-300 mb-2">
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
                  <span className="text-xs text-navy-400">None yet</span>
                )}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-medium text-navy-300 mb-2">
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
                  <span className="text-xs text-navy-400">None</span>
                )}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-medium text-navy-300 mb-2">
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
                  <span className="text-xs text-navy-400">None</span>
                )}
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-medium text-navy-300 mb-3">
              Suggested Learning Roadmap
            </h4>
            <ol className="space-y-3">
              {learningPath.map((phase) => (
                <li key={phase.phase} className="flex gap-3">
                  <span className="mt-0.5 h-6 w-6 shrink-0 rounded-full bg-brand-500/15 text-brand-glow text-xs font-semibold flex items-center justify-center">
                    {phase.phase.match(/\d+/)?.[0] || "-"}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-white">{phase.phase}</p>
                    <p className="text-sm text-navy-300">{phase.topics.join(", ")}</p>
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
