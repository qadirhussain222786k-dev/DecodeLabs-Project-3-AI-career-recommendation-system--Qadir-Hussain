# Example API Request

## Using curl

```bash
curl -X POST "http://127.0.0.1:8000/api/recommend" \
  -H "Content-Type: application/json" \
  -d '{
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
    "preferred_work_type": "Remote"
  }'
```

## Example response (abridged, one recommendation shown)

```json
{
  "recommendations": [
    {
      "career": "AI Engineer",
      "confidence": 0.6359,
      "matched_skills": ["Python", "Machine Learning", "Statistics", "Data Analysis", "SQL", "Problem Solving"],
      "missing_skills": [],
      "skills_to_improve": [],
      "learning_path": [
        { "phase": "Phase 1 - Foundations", "topics": ["Python fundamentals", "NumPy", "Pandas"] },
        { "phase": "Phase 2 - Core ML", "topics": ["Statistics", "Machine Learning (Scikit-learn)", "Model evaluation"] },
        { "phase": "Phase 3 - Advanced", "topics": ["Deep Learning concepts", "Neural networks basics"] },
        { "phase": "Phase 4 - Deployment", "topics": ["REST APIs (FastAPI)", "Model deployment", "Docker"] }
      ],
      "explanation": "The model estimated a 63.6% match for AI Engineer based on your overall profile, with your current strengths in Python, Machine Learning, Statistics aligning well with what this role typically requires."
    }
  ],
  "model_name": "LogisticRegression",
  "model_trained_at": "2026-09-19T10:54:15.861748+00:00"
}
```

Note: exact confidence values will vary slightly if you retrain the model, since training involves a random train/test split.
