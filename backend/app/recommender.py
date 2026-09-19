"""
recommender.py

Combines the two layers of the system into the final API response:

  1. ML PREDICTION LAYER (predictor.py)
     -> WHICH careers fit, and with what confidence
        (from model.predict_proba()).

  2. SKILL-GAP / ROADMAP LAYER (career_profiles.py)
     -> WHY that career was suggested, in terms of the user's own
        skills, and WHAT to learn next.

This file is intentionally the only place where these two layers meet,
so the separation between "what the ML model decided" and "what the
rule-based explanation layer adds on top" stays clear and explainable.
"""

from typing import List

from .career_profiles import CAREER_SKILL_PROFILES, LEARNING_ROADMAPS, SKILL_FIELDS
from .predictor import predictor
from .schemas import (
    CareerAssessmentRequest,
    CareerRecommendation,
    LearningRoadmapPhase,
    RecommendationResponse,
)

TOP_N_RECOMMENDATIONS = 5

PROFICIENCY_LABELS = {0: "None", 1: "Beginner", 2: "Intermediate", 3: "Advanced"}


def _skill_gap_for_career(career: str, request: CareerAssessmentRequest):
    """
    Compare the user's self-reported skill levels against the target
    career's transparent skill profile (career_profiles.py).

    Returns (matched_skills, missing_skills, skills_to_improve) as lists
    of human-readable skill names.
    """
    profile = CAREER_SKILL_PROFILES.get(career, {})
    user_data = request.model_dump()

    matched: List[str] = []
    missing: List[str] = []
    improve: List[str] = []

    for field_key, required_level in profile.items():
        if required_level <= 0:
            continue
        user_level = user_data.get(field_key, 0)
        skill_name = SKILL_FIELDS.get(field_key, field_key)

        if user_level == 0:
            missing.append(skill_name)
        elif user_level < required_level:
            improve.append(skill_name)
        else:
            matched.append(skill_name)

    return matched, missing, improve


def _roadmap_for_career(career: str) -> List[LearningRoadmapPhase]:
    phases = LEARNING_ROADMAPS.get(career, [])
    return [LearningRoadmapPhase(phase=p["phase"], topics=p["topics"]) for p in phases]


def _explanation_for(career: str, confidence: float, matched: List[str]) -> str:
    pct = round(confidence * 100, 1)
    if matched:
        matched_str = ", ".join(matched[:3])
        return (
            f"The model estimated a {pct}% match for {career} based on your overall "
            f"profile, with your current strengths in {matched_str} aligning well "
            f"with what this role typically requires."
        )
    return (
        f"The model estimated a {pct}% match for {career} based on your overall "
        f"profile. Building the skills listed below would strengthen this fit."
    )


def get_recommendations(
    request: CareerAssessmentRequest, top_n: int = TOP_N_RECOMMENDATIONS
) -> RecommendationResponse:
    """Produce the full API response: ranked ML predictions enriched with
    skill-gap analysis and a learning roadmap for each recommended career."""

    ranked_predictions = predictor.predict_ranked(request, top_n=top_n)

    recommendations: List[CareerRecommendation] = []
    for career, confidence in ranked_predictions:
        matched, missing, improve = _skill_gap_for_career(career, request)
        recommendations.append(
            CareerRecommendation(
                career=career,
                confidence=round(confidence, 4),
                matched_skills=matched,
                missing_skills=missing,
                skills_to_improve=improve,
                learning_path=_roadmap_for_career(career),
                explanation=_explanation_for(career, confidence, matched),
            )
        )

    return RecommendationResponse(
        recommendations=recommendations,
        model_name=predictor.model_name,
        model_trained_at=predictor.trained_at,
    )
