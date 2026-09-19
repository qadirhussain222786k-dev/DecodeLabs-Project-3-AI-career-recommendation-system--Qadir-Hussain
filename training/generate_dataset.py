"""
generate_dataset.py

Generates the SYNTHETIC / DEMO dataset used to train the career
recommendation model.

WHY SYNTHETIC DATA?
A genuinely representative, labeled, public "resume/skills -> career role"
dataset with the exact feature set this project needs (per-skill
proficiency levels, interests, work preference, etc.) is not freely
available. Rather than force-fit an unrelated public dataset (e.g. a
generic salary or job-postings dataset) and pretend its labels mean
something they don't, this project generates a clearly documented
synthetic dataset instead.

HOW IT IS GENERATED (so you can explain this honestly in an evaluation):
1. For each of the 10 career classes, we define a "profile" of which
   skills/interests are typically higher for someone suited to that
   career (see career_profiles.py - the SAME transparent mapping used
   for skill-gap analysis, so the dataset's labels and the app's
   explanations are consistent with each other).
2. For each synthetic candidate, we pick a career class (roughly
   balanced across classes), then sample each feature from a
   distribution centered on that career's typical profile, with
   realistic random noise, occasional low-signal/borderline candidates,
   and some feature correlations (e.g. more years of experience -> more
   likely to have higher skill levels).
3. This means the resulting dataset has a LEARNABLE but NOT TRIVIAL
   relationship between features and career labels - some overlap
   between classes is intentional (e.g. AI Engineer and ML Engineer
   profiles are similar), which is realistic and lets the trained model
   produce genuinely different confidence scores rather than 100%/0%.

This script performs no ML training itself - it only produces
backend/data/career_dataset.csv, which training/train_model.py then
loads, validates, and trains on.
"""

import os
import sys

import numpy as np
import pandas as pd

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))
from app.career_profiles import CAREER_SKILL_PROFILES, SKILL_FIELDS  # noqa: E402

RANDOM_SEED = 42
N_SAMPLES_PER_CAREER = 220  # -> 2200 total rows across 10 balanced classes

EDUCATION_LEVELS = ["Intermediate/High School", "Bachelor", "Master", "PhD"]
FIELDS_OF_STUDY = [
    "Computer Science",
    "Software Engineering",
    "Information Technology",
    "Data Science",
    "Electrical Engineering",
    "Business/Commerce",
    "Mathematics",
    "Other",
]
WORK_PREFERENCES = ["Remote", "On-site", "Hybrid"]

# Interest fields correlated with each career (subset of interests that
# should be sampled HIGH for that career; others sampled lower/neutral).
CAREER_INTERESTS = {
    "AI Engineer": ["interest_ai", "interest_data"],
    "Machine Learning Engineer": ["interest_ai", "interest_data"],
    "Data Scientist": ["interest_data", "interest_ai"],
    "Data Analyst": ["interest_data"],
    "Full Stack Developer": ["interest_web"],
    "Frontend Developer": ["interest_web"],
    "Backend Developer": ["interest_web", "interest_data"],
    "DevOps Engineer": ["interest_cloud", "interest_security"],
    "Cybersecurity Analyst": ["interest_security"],
    "Cloud Engineer": ["interest_cloud"],
}

ALL_INTERESTS = [
    "interest_ai",
    "interest_web",
    "interest_data",
    "interest_cloud",
    "interest_security",
]

# Careers that plausibly involve strong technical/quant education fields
QUANT_FIELDS_BY_CAREER = {
    "AI Engineer": ["Computer Science", "Data Science", "Software Engineering", "Mathematics"],
    "Machine Learning Engineer": ["Computer Science", "Data Science", "Mathematics"],
    "Data Scientist": ["Data Science", "Mathematics", "Computer Science"],
    "Data Analyst": ["Business/Commerce", "Data Science", "Mathematics"],
    "Full Stack Developer": ["Computer Science", "Software Engineering", "Information Technology"],
    "Frontend Developer": ["Computer Science", "Software Engineering", "Information Technology"],
    "Backend Developer": ["Computer Science", "Software Engineering", "Information Technology"],
    "DevOps Engineer": ["Computer Science", "Information Technology", "Electrical Engineering"],
    "Cybersecurity Analyst": ["Information Technology", "Computer Science", "Electrical Engineering"],
    "Cloud Engineer": ["Information Technology", "Computer Science", "Electrical Engineering"],
}


def sample_skill_level(target_level: int, rng: np.random.Generator, noise: float = 1.0) -> int:
    """
    Sample a proficiency level (0-3) around a target level with noise,
    clipped to the valid range. target_level of 0 means "not a relevant
    skill for this career" and is sampled mostly low with occasional
    incidental exposure.
    """
    value = rng.normal(loc=target_level, scale=noise)
    value = int(round(value))
    return int(np.clip(value, 0, 3))


def generate_row(career: str, rng: np.random.Generator) -> dict:
    profile = CAREER_SKILL_PROFILES[career]

    years_experience = float(np.clip(rng.exponential(scale=2.5), 0, 15))
    # More experience -> slightly higher general skill noise ceiling
    experience_bonus = 0.3 if years_experience > 3 else 0.0

    row = {
        "education_level": rng.choice(
            EDUCATION_LEVELS, p=[0.15, 0.55, 0.25, 0.05]
        ),
        "field_of_study": rng.choice(
            QUANT_FIELDS_BY_CAREER[career] + ["Other"],
            p=_field_probs(len(QUANT_FIELDS_BY_CAREER[career])),
        ),
        "years_experience": round(years_experience, 1),
        "preferred_work_type": rng.choice(WORK_PREFERENCES, p=[0.45, 0.25, 0.30]),
    }

    for field_key in SKILL_FIELDS:
        target = profile.get(field_key, 0)
        # Skills relevant to the career get sampled near the profile's
        # target level (plus a small experience bonus); irrelevant
        # skills get sampled low with light noise.
        if target > 0:
            level = sample_skill_level(target + experience_bonus, rng, noise=0.8)
        else:
            level = sample_skill_level(0, rng, noise=0.6)
        row[field_key] = level

    relevant_interests = set(CAREER_INTERESTS[career])
    for interest in ALL_INTERESTS:
        target = 3 if interest in relevant_interests else 1
        row[interest] = sample_skill_level(target, rng, noise=0.9)

    row["career"] = career
    return row


def _field_probs(n_quant_fields: int) -> list:
    """Give higher combined probability to the quant/relevant fields,
    remainder to 'Other'."""
    other_p = 0.15
    each = (1 - other_p) / n_quant_fields
    return [each] * n_quant_fields + [other_p]


def generate_dataset(n_per_career: int = N_SAMPLES_PER_CAREER, seed: int = RANDOM_SEED) -> pd.DataFrame:
    rng = np.random.default_rng(seed)
    rows = []
    for career in CAREER_SKILL_PROFILES:
        for _ in range(n_per_career):
            rows.append(generate_row(career, rng))
    df = pd.DataFrame(rows)
    # Shuffle rows so the CSV isn't grouped by class
    df = df.sample(frac=1.0, random_state=seed).reset_index(drop=True)
    return df


if __name__ == "__main__":
    df = generate_dataset()
    out_path = os.path.join(os.path.dirname(__file__), "..", "backend", "data", "career_dataset.csv")
    out_path = os.path.abspath(out_path)
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    df.to_csv(out_path, index=False)
    print(f"Synthetic dataset written to: {out_path}")
    print(f"Shape: {df.shape}")
    print("\nClass distribution:")
    print(df["career"].value_counts())
