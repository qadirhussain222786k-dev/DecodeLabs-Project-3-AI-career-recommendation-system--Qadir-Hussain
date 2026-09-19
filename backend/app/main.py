"""
main.py

FastAPI application entrypoint for the AI Career & Skill Recommendation
System backend.

Endpoints:
  GET  /               -> basic API info
  GET  /health          -> health check + model-loaded status
  POST /api/recommend   -> the main recommendation endpoint
"""

import logging

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .predictor import ModelNotLoadedError, predictor
from .recommender import get_recommendations
from .schemas import CareerAssessmentRequest, HealthResponse, RecommendationResponse

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="AI Career & Skill Recommendation System API",
    description=(
        "Predicts suitable career roles from a user's education, skills, "
        "and interests using a trained Scikit-learn classification model, "
        "and enriches the prediction with skill-gap analysis and a "
        "learning roadmap."
    ),
    version="1.0.0",
)

# Allow the local Vite React dev server (and any origin during
# development) to call this API. Tighten this before deploying publicly.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "name": "AI Career & Skill Recommendation System API",
        "status": "running",
        "docs": "/docs",
    }


@app.get("/health", response_model=HealthResponse)
def health():
    return HealthResponse(
        status="ok" if predictor.is_loaded else "degraded",
        model_loaded=predictor.is_loaded,
        model_name=predictor.model_name if predictor.is_loaded else None,
    )


@app.post("/api/recommend", response_model=RecommendationResponse)
def recommend(request: CareerAssessmentRequest):
    """
    Accepts a full career-assessment profile and returns ranked career
    recommendations with confidence scores from the trained ML model,
    plus skill-gap analysis and a learning roadmap for each.
    """
    if not predictor.is_loaded:
        raise HTTPException(
            status_code=503,
            detail=(
                "The recommendation model is not currently loaded on the "
                "server. Please train the model (training/train_model.py) "
                "and restart the API."
            ),
        )

    try:
        return get_recommendations(request)
    except ModelNotLoadedError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except Exception as exc:  # noqa: BLE001
        logger.exception("Unexpected error while generating recommendations")
        raise HTTPException(
            status_code=500, detail="An unexpected error occurred while generating recommendations."
        ) from exc
