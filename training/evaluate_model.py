"""
evaluate_model.py

Standalone evaluation script. Loads the ALREADY-TRAINED model from
backend/models/career_model.joblib and re-evaluates it on a fresh
stratified split of the dataset. Useful for:

- Verifying the saved model file actually works (loads + predicts).
- Re-checking metrics without retraining.
- Confirming metadata.json matches what the saved model actually does.

Usage:
    python training/evaluate_model.py
"""

import json
import os
import sys

import joblib
import pandas as pd
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
)
from sklearn.model_selection import train_test_split

sys.path.insert(0, os.path.dirname(__file__))
from preprocess import ALL_FEATURES, TARGET_COLUMN  # noqa: E402

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DATA_PATH = os.path.join(BASE_DIR, "backend", "data", "career_dataset.csv")
MODEL_PATH = os.path.join(BASE_DIR, "backend", "models", "career_model.joblib")
METADATA_PATH = os.path.join(BASE_DIR, "backend", "models", "model_metadata.json")


def main():
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(
            f"No trained model found at {MODEL_PATH}. Run training/train_model.py first."
        )

    with open(METADATA_PATH) as f:
        metadata = json.load(f)
    random_state = metadata.get("random_state", 42)

    print(f"Loading model: {metadata['model_name']} (trained {metadata['training_date']})")
    pipeline = joblib.load(MODEL_PATH)

    df = pd.read_csv(DATA_PATH)
    X = df[ALL_FEATURES]
    y = df[TARGET_COLUMN]
    classes = sorted(y.unique().tolist())

    # Use the SAME split logic/seed as training so this reproduces the
    # original held-out test set.
    _, X_test, _, y_test = train_test_split(
        X, y, test_size=0.2, random_state=random_state, stratify=y
    )

    y_pred = pipeline.predict(X_test)

    print("\nRe-computed evaluation metrics on the held-out test set:")
    print(f"  Accuracy:          {accuracy_score(y_test, y_pred):.4f}")
    print(f"  Precision (macro): {precision_score(y_test, y_pred, average='macro', zero_division=0):.4f}")
    print(f"  Recall (macro):    {recall_score(y_test, y_pred, average='macro', zero_division=0):.4f}")
    print(f"  F1-score (macro):  {f1_score(y_test, y_pred, average='macro', zero_division=0):.4f}")

    print("\nClassification report:")
    print(classification_report(y_test, y_pred, labels=classes, zero_division=0))

    print("Confusion matrix:")
    print(pd.DataFrame(
        confusion_matrix(y_test, y_pred, labels=classes),
        index=classes,
        columns=classes,
    ))


if __name__ == "__main__":
    main()
