"""
schemas.py

Pydantic models defining and validating the API's request and response
shapes. Using Pydantic here means malformed requests (wrong types,
out-of-range skill levels, unknown enum values) are rejected by FastAPI
automatically, with a clear 422 error, before any of our code runs.
"""

from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, Field


class EducationLevel(str, Enum):
    high_school = "Intermediate/High School"
    bachelor = "Bachelor"
    master = "Master"
    phd = "PhD"


class FieldOfStudy(str, Enum):
    computer_science = "Computer Science"
    software_engineering = "Software Engineering"
    information_technology = "Information Technology"
    data_science = "Data Science"
    electrical_engineering = "Electrical Engineering"
    business = "Business/Commerce"
    mathematics = "Mathematics"
    other = "Other"


class WorkPreference(str, Enum):
    remote = "Remote"
    onsite = "On-site"
    hybrid = "Hybrid"


# Skill/interest levels are validated as integers 0-3:
# 0 = None, 1 = Beginner, 2 = Intermediate, 3 = Advanced
SkillLevel = int


class CareerAssessmentRequest(BaseModel):
    education_level: EducationLevel
    field_of_study: FieldOfStudy
    years_experience: float = Field(ge=0, le=50)

    python_level: SkillLevel = Field(ge=0, le=3)
    javascript_level: SkillLevel = Field(ge=0, le=3)
    java_level: SkillLevel = Field(ge=0, le=3)
    sql_level: SkillLevel = Field(ge=0, le=3)
    react_level: SkillLevel = Field(ge=0, le=3)
    nodejs_level: SkillLevel = Field(ge=0, le=3)
    machine_learning_level: SkillLevel = Field(ge=0, le=3)
    data_analysis_level: SkillLevel = Field(ge=0, le=3)
    cloud_level: SkillLevel = Field(ge=0, le=3)
    cybersecurity_level: SkillLevel = Field(ge=0, le=3)
    statistics_level: SkillLevel = Field(ge=0, le=3)
    communication_level: SkillLevel = Field(ge=0, le=3)
    problem_solving_level: SkillLevel = Field(ge=0, le=3)

    interest_ai: SkillLevel = Field(ge=0, le=3)
    interest_web: SkillLevel = Field(ge=0, le=3)
    interest_data: SkillLevel = Field(ge=0, le=3)
    interest_cloud: SkillLevel = Field(ge=0, le=3)
    interest_security: SkillLevel = Field(ge=0, le=3)

    preferred_work_type: WorkPreference

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
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
        }
    )


class LearningRoadmapPhase(BaseModel):
    phase: str
    topics: List[str]


class CareerRecommendation(BaseModel):
    career: str
    confidence: float = Field(..., description="Model prediction probability (0-1)")
    matched_skills: List[str]
    missing_skills: List[str]
    skills_to_improve: List[str]
    learning_path: List[LearningRoadmapPhase]
    explanation: str


class RecommendationResponse(BaseModel):
    recommendations: List[CareerRecommendation]
    model_name: str
    model_trained_at: Optional[str] = None


class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    model_name: Optional[str] = None
