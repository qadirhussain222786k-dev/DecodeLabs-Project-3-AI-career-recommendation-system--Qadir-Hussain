"""
predictor.py

The ML PREDICTION LAYER. This module's only job is:
1. Load the trained Scikit-learn Pipeline (preprocessing + classifier)
   that training/train_model.py saved to
   backend/models/career_model.joblib.
2. Turn a validated API request into the same tabular shape the model
   was trained on.
3. Call model.predict_proba() and return ranked (career, probability)
   pairs.

No skill-gap logic, no roadmap logic, and no hardcoded career ranking
lives in this file - that separation is deliberate so it's obvious,
during an internship evaluation, exactly which part of the system is
"the machine learning" versus supporting business logic
(see recommender.py and career_profiles.py for that layer).
"""

import json
import logging
import os
from typing import List, Tuple

import joblib
import pandas as pd

from .schemas import CareerAssessmentRequest

logger = logging.getLogger(__name__)

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
MODEL_PATH = os.path.join(BASE_DIR, "backend", "models", "career_model.joblib")
METADATA_PATH = os.path.join(BASE_DIR, "backend", "models", "model_metadata.json")

FEATURE_ORDER = [
    "education_level",
    "field_of_study",
    "preferred_work_type",
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


class ModelNotLoadedError(RuntimeError):
    """Raised when a prediction is requested but no model file could be loaded."""


class CareerPredictor:
    """Wraps the trained pipeline and exposes a simple predict() method."""

    def __init__(self, model_path: str = MODEL_PATH, metadata_path: str = METADATA_PATH):
        self.model_path = model_path
        self.metadata_path = metadata_path
        self.pipeline = None
        self.metadata = None
        self._load()

    def _load(self) -> None:
        try:
            if not os.path.exists(self.model_path):
                logger.error("Model file not found at %s", self.model_path)
                return
            self.pipeline = joblib.load(self.model_path)
            logger.info("Loaded trained model from %s", self.model_path)

            if os.path.exists(self.metadata_path):
                with open(self.metadata_path) as f:
                    self.metadata = json.load(f)
            else:
                logger.warning("Model metadata file not found at %s", self.metadata_path)
        except Exception:  # noqa: BLE001
            logger.exception("Failed to load model from %s", self.model_path)
            self.pipeline = None

    @property
    def is_loaded(self) -> bool:
        return self.pipeline is not None

    @property
    def model_name(self) -> str:
        if self.metadata:
            return self.metadata.get("model_name", "UnknownModel")
        return "UnknownModel"

    @property
    def trained_at(self) -> str:
        if self.metadata:
            return self.metadata.get("training_date")
        return None

    def _request_to_dataframe(self, request: CareerAssessmentRequest) -> pd.DataFrame:
        data = request.model_dump()
        # Enums serialize to their string value via model_dump(mode="json"),
        # but model_dump() alone may keep Enum members - normalize explicitly.
        row = {}
        for key in FEATURE_ORDER:
            value = data[key]
            row[key] = value.value if hasattr(value, "value") else value
        return pd.DataFrame([row], columns=FEATURE_ORDER)

    def predict_ranked(
        self, request: CareerAssessmentRequest, top_n: int = 5
    ) -> List[Tuple[str, float]]:
        """
        Return up to `top_n` (career, probability) pairs, sorted by
        probability descending, using the trained model's
        predict_proba() output - not a hardcoded ranking.
        """
        if not self.is_loaded:
            raise ModelNotLoadedError(
                "Career prediction model is not loaded. Train it with "
                "training/train_model.py and restart the API."
            )

        X = self._request_to_dataframe(request)
        probabilities = self.pipeline.predict_proba(X)[0]
        classes = self.pipeline.classes_

        ranked = sorted(zip(classes, probabilities), key=lambda pair: pair[1], reverse=True)
        return [(str(career), float(prob)) for career, prob in ranked[:top_n]]


# Module-level singleton so the model is loaded once at process startup,
# not re-loaded from disk on every request.
predictor = CareerPredictor()
