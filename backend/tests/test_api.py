"""
test_api.py

Basic backend tests. Run with:
    pytest backend/tests/test_api.py -v

(run from the project root, with the backend dependencies installed)
"""

import os
import sys

import pytest
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from app.main import app  # noqa: E402
from app.predictor import predictor  # noqa: E402

client = TestClient(app)

VALID_PAYLOAD = {
    "education_level": "Bachelor",
    "field_of_study": "Software Engineering",
    "years_experience": 1,
    "python_level": 3,
    "javascript_level": 2,
    "java_level": 1,
    "sql_level": 2,
    "react_level": 2,
    "nodejs_level": 2,
    "machine_learning_level": 3,
    "data_analysis_level": 2,
    "cloud_level": 1,
    "cybersecurity_level": 1,
    "statistics_level": 2,
    "communication_level": 2,
    "problem_solving_level": 3,
    "interest_ai": 3,
    "interest_web": 2,
    "interest_data": 3,
    "interest_cloud": 1,
    "interest_security": 1,
    "preferred_work_type": "Remote",
}


def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    assert "name" in response.json()


def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    body = response.json()
    assert "status" in body
    assert "model_loaded" in body


@pytest.mark.skipif(not predictor.is_loaded, reason="Model not trained/loaded")
def test_model_is_loaded():
    assert predictor.is_loaded is True


@pytest.mark.skipif(not predictor.is_loaded, reason="Model not trained/loaded")
def test_recommend_endpoint_valid_request():
    response = client.post("/api/recommend", json=VALID_PAYLOAD)
    assert response.status_code == 200
    body = response.json()

    assert "recommendations" in body
    assert len(body["recommendations"]) > 0

    top = body["recommendations"][0]
    assert "career" in top
    assert "confidence" in top
    assert 0.0 <= top["confidence"] <= 1.0
    assert "matched_skills" in top
    assert "missing_skills" in top
    assert "learning_path" in top

    # Recommendations should be sorted by confidence, descending
    confidences = [r["confidence"] for r in body["recommendations"]]
    assert confidences == sorted(confidences, reverse=True)


def test_recommend_endpoint_invalid_skill_level():
    bad_payload = dict(VALID_PAYLOAD)
    bad_payload["python_level"] = 99  # out of allowed range (0-3)
    response = client.post("/api/recommend", json=bad_payload)
    assert response.status_code == 422


def test_recommend_endpoint_missing_field():
    bad_payload = dict(VALID_PAYLOAD)
    del bad_payload["education_level"]
    response = client.post("/api/recommend", json=bad_payload)
    assert response.status_code == 422


def test_recommend_endpoint_invalid_enum_value():
    bad_payload = dict(VALID_PAYLOAD)
    bad_payload["preferred_work_type"] = "FromTheMoon"
    response = client.post("/api/recommend", json=bad_payload)
    assert response.status_code == 422
