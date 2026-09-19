"""
preprocess.py

Defines the preprocessing pipeline shared by training and inference so
that the exact same transformations are applied to training data and to
live prediction requests. This is the key reason we wrap preprocessing
+ model together in a single Scikit-learn Pipeline: it eliminates the
classic bug where training-time and prediction-time preprocessing
silently drift apart.

Feature groups:
- CATEGORICAL: education_level, field_of_study, preferred_work_type
    -> OneHotEncoder (nominal categories, no natural order between
       "Remote" and "On-site", etc.)
- NUMERIC (skills, interests, experience): already encoded as ordered
  integers (0-3 for skill/interest levels, and a float for years of
  experience). These are already on a small, meaningful numeric scale,
  so we apply StandardScaler mainly so that years_experience (which has
  a larger range than the 0-3 skill levels) doesn't dominate
  distance/gradient-sensitive parts of the pipeline, and so the
  Logistic Regression baseline (which IS scale-sensitive) is treated
  fairly against RandomForest (which is scale-insensitive).
"""

from typing import List, Tuple

from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler

CATEGORICAL_FEATURES: List[str] = [
    "education_level",
    "field_of_study",
    "preferred_work_type",
]

NUMERIC_FEATURES: List[str] = [
    "years_experience",
    "python_level",
    "javascript_level",
    "java_level",
    "sql_level",
    "react_level",
    "nodejs_level",
    "machine_learning_level",
    "data_analysis_level",
    "cloud_level",
    "cybersecurity_level",
    "statistics_level",
    "communication_level",
    "problem_solving_level",
    "interest_ai",
    "interest_web",
    "interest_data",
    "interest_cloud",
    "interest_security",
]

ALL_FEATURES: List[str] = CATEGORICAL_FEATURES + NUMERIC_FEATURES

TARGET_COLUMN = "career"


def build_preprocessor() -> ColumnTransformer:
    """Build the ColumnTransformer used inside the model Pipeline."""
    return ColumnTransformer(
        transformers=[
            (
                "categorical",
                OneHotEncoder(handle_unknown="ignore"),
                CATEGORICAL_FEATURES,
            ),
            ("numeric", StandardScaler(), NUMERIC_FEATURES),
        ]
    )


def get_feature_lists() -> Tuple[List[str], List[str]]:
    return CATEGORICAL_FEATURES, NUMERIC_FEATURES
