"""
career_profiles.py

Transparent, human-authored mapping from career roles to the skills that
matter for that role, and to a phased learning roadmap for beginners.

IMPORTANT (read this before assuming this file is "the ML"):
This file is NOT the machine-learning model. The ML model (trained with
scikit-learn, see training/train_model.py) is responsible ONLY for
predicting which career(s) best fit a user's profile, using
model.predict_proba().

This file powers a SEPARATE, second layer of the system: skill-gap
analysis and learning-path generation. These mappings are intentionally
transparent/rule-based rather than learned, because:
  1. They need to be explainable in an internship evaluation.
  2. There is no reliable labeled dataset for "which exact skill order
     should a beginner learn skills in for career X" - this is closer to
     curated career-counselling knowledge than a supervised-learning
     problem.

The two layers are kept in separate modules on purpose:
  - predictor.py      -> ML prediction layer (model.predict_proba)
  - career_profiles.py -> rule-based skill-gap / roadmap layer (this file)
  - recommender.py    -> combines both into the final API response
"""

from typing import Dict, List

# Skill fields that exist in the dataset / API request and their
# human-readable labels (used to build matched/missing skill lists).
SKILL_FIELDS: Dict[str, str] = {
    "python_level": "Python",
    "javascript_level": "JavaScript",
    "java_level": "Java",
    "sql_level": "SQL",
    "react_level": "React",
    "nodejs_level": "Node.js",
    "machine_learning_level": "Machine Learning",
    "data_analysis_level": "Data Analysis",
    "cloud_level": "Cloud Computing",
    "cybersecurity_level": "Cybersecurity",
    "statistics_level": "Statistics",
    "communication_level": "Communication",
    "problem_solving_level": "Problem Solving",
}

# Proficiency encoding used consistently across dataset generation,
# training, and the API request schema.
PROFICIENCY_LEVELS = {"None": 0, "Beginner": 1, "Intermediate": 2, "Advanced": 3}

# For each career: the skills that matter most, and the proficiency
# level (1-3) that is considered "sufficient" for that skill in that role.
# This is the transparent knowledge base used for skill-gap comparison.
CAREER_SKILL_PROFILES: Dict[str, Dict[str, int]] = {
    "AI Engineer": {
        "python_level": 3,
        "machine_learning_level": 3,
        "statistics_level": 2,
        "data_analysis_level": 2,
        "sql_level": 1,
        "problem_solving_level": 3,
    },
    "Machine Learning Engineer": {
        "python_level": 3,
        "machine_learning_level": 3,
        "statistics_level": 2,
        "data_analysis_level": 2,
        "cloud_level": 2,
        "sql_level": 2,
        "problem_solving_level": 2,
    },
    "Data Scientist": {
        "python_level": 3,
        "statistics_level": 3,
        "data_analysis_level": 3,
        "machine_learning_level": 2,
        "sql_level": 2,
        "communication_level": 2,
    },
    "Data Analyst": {
        "sql_level": 3,
        "data_analysis_level": 3,
        "statistics_level": 2,
        "python_level": 1,
        "communication_level": 2,
    },
    "Full Stack Developer": {
        "javascript_level": 3,
        "react_level": 2,
        "nodejs_level": 2,
        "sql_level": 2,
        "problem_solving_level": 2,
    },
    "Frontend Developer": {
        "javascript_level": 3,
        "react_level": 3,
        "communication_level": 2,
        "problem_solving_level": 1,
    },
    "Backend Developer": {
        "java_level": 2,
        "nodejs_level": 2,
        "sql_level": 3,
        "python_level": 2,
        "problem_solving_level": 2,
    },
    "DevOps Engineer": {
        "cloud_level": 3,
        "python_level": 2,
        "cybersecurity_level": 2,
        "problem_solving_level": 3,
        "sql_level": 1,
    },
    "Cybersecurity Analyst": {
        "cybersecurity_level": 3,
        "sql_level": 2,
        "python_level": 1,
        "problem_solving_level": 3,
        "communication_level": 2,
    },
    "Cloud Engineer": {
        "cloud_level": 3,
        "python_level": 2,
        "cybersecurity_level": 1,
        "sql_level": 1,
        "problem_solving_level": 2,
    },
}

# Beginner-friendly, phased learning roadmap per career. Generated from
# the same skill profile knowledge base above, ordered by a sensible
# learning progression (fundamentals -> core skill -> supporting tools).
LEARNING_ROADMAPS: Dict[str, List[Dict[str, List[str]]]] = {
    "AI Engineer": [
        {"phase": "Phase 1 - Foundations", "topics": ["Python fundamentals", "NumPy", "Pandas"]},
        {"phase": "Phase 2 - Core ML", "topics": ["Statistics", "Machine Learning (Scikit-learn)", "Model evaluation"]},
        {"phase": "Phase 3 - Advanced", "topics": ["Deep Learning concepts", "Neural networks basics"]},
        {"phase": "Phase 4 - Deployment", "topics": ["REST APIs (FastAPI)", "Model deployment", "Docker"]},
    ],
    "Machine Learning Engineer": [
        {"phase": "Phase 1 - Foundations", "topics": ["Python fundamentals", "SQL basics", "NumPy/Pandas"]},
        {"phase": "Phase 2 - Core ML", "topics": ["Statistics", "Scikit-learn pipelines", "Model evaluation"]},
        {"phase": "Phase 3 - Productionizing", "topics": ["APIs", "Docker", "Cloud basics"]},
        {"phase": "Phase 4 - Advanced", "topics": ["Model monitoring", "MLOps fundamentals"]},
    ],
    "Data Scientist": [
        {"phase": "Phase 1 - Foundations", "topics": ["Python fundamentals", "SQL basics", "Statistics"]},
        {"phase": "Phase 2 - Analysis", "topics": ["Data analysis (Pandas)", "Data visualization"]},
        {"phase": "Phase 3 - Modeling", "topics": ["Machine Learning (Scikit-learn)", "Experiment evaluation"]},
        {"phase": "Phase 4 - Communication", "topics": ["Storytelling with data", "Dashboards"]},
    ],
    "Data Analyst": [
        {"phase": "Phase 1 - Foundations", "topics": ["SQL fundamentals", "Excel/Spreadsheets"]},
        {"phase": "Phase 2 - Analysis", "topics": ["Statistics basics", "Pandas for analysis"]},
        {"phase": "Phase 3 - Visualization", "topics": ["Data visualization", "Dashboarding tools"]},
        {"phase": "Phase 4 - Communication", "topics": ["Business communication", "Reporting"]},
    ],
    "Full Stack Developer": [
        {"phase": "Phase 1 - Foundations", "topics": ["HTML/CSS", "JavaScript fundamentals"]},
        {"phase": "Phase 2 - Frontend", "topics": ["React fundamentals", "State management"]},
        {"phase": "Phase 3 - Backend", "topics": ["Node.js", "REST APIs", "SQL"]},
        {"phase": "Phase 4 - Integration", "topics": ["Full stack integration", "Deployment"]},
    ],
    "Frontend Developer": [
        {"phase": "Phase 1 - Foundations", "topics": ["HTML/CSS", "JavaScript fundamentals"]},
        {"phase": "Phase 2 - Framework", "topics": ["React fundamentals", "Component design"]},
        {"phase": "Phase 3 - Polish", "topics": ["Responsive design", "Accessibility"]},
        {"phase": "Phase 4 - Advanced", "topics": ["Performance optimization", "Testing"]},
    ],
    "Backend Developer": [
        {"phase": "Phase 1 - Foundations", "topics": ["Programming fundamentals", "SQL basics"]},
        {"phase": "Phase 2 - Core", "topics": ["REST API design", "Database design"]},
        {"phase": "Phase 3 - Reliability", "topics": ["Authentication/Security basics", "Testing"]},
        {"phase": "Phase 4 - Scale", "topics": ["Caching", "Cloud deployment"]},
    ],
    "DevOps Engineer": [
        {"phase": "Phase 1 - Foundations", "topics": ["Linux basics", "Scripting (Python/Bash)"]},
        {"phase": "Phase 2 - Core", "topics": ["CI/CD pipelines", "Containers (Docker)"]},
        {"phase": "Phase 3 - Cloud", "topics": ["Cloud platforms", "Infrastructure as Code"]},
        {"phase": "Phase 4 - Reliability", "topics": ["Monitoring", "Security basics"]},
    ],
    "Cybersecurity Analyst": [
        {"phase": "Phase 1 - Foundations", "topics": ["Networking basics", "Operating systems"]},
        {"phase": "Phase 2 - Core", "topics": ["Security fundamentals", "Threat analysis"]},
        {"phase": "Phase 3 - Tools", "topics": ["SIEM tools", "Vulnerability assessment"]},
        {"phase": "Phase 4 - Advanced", "topics": ["Incident response", "Compliance basics"]},
    ],
    "Cloud Engineer": [
        {"phase": "Phase 1 - Foundations", "topics": ["Networking basics", "Linux basics"]},
        {"phase": "Phase 2 - Core", "topics": ["Cloud platform fundamentals", "Scripting (Python)"]},
        {"phase": "Phase 3 - Infrastructure", "topics": ["Infrastructure as Code", "Containers"]},
        {"phase": "Phase 4 - Advanced", "topics": ["Security basics", "Cost optimization"]},
    ],
}


def get_all_career_names() -> List[str]:
    """Return the list of all career classes known to the system."""
    return list(CAREER_SKILL_PROFILES.keys())
