"""
train_model.py

End-to-end, re-runnable training script for the AI Career Recommendation
System. This is the SAME logic demonstrated interactively in
notebooks/03_model_training.ipynb, extracted into a script so the model
can be retrained from the command line without copy-pasting notebook
cells:

    python training/train_model.py

What this script does, in order:
1. Load backend/data/career_dataset.csv (synthetic/demo data - see
   generate_dataset.py for how and why it was generated).
2. Validate the data: missing values, duplicate rows, invalid values,
   class balance.
3. Split into train/test sets (stratified, since this is a
   classification task with multiple balanced-but-distinct classes).
4. Build a Pipeline(preprocessing + classifier) for each candidate
   model: RandomForestClassifier (primary candidate), LogisticRegression,
   and GradientBoostingClassifier.
5. Train each pipeline on the TRAINING set only.
6. Evaluate every pipeline on the held-out TEST set using accuracy,
   precision, recall, F1 (macro-averaged, since all classes matter
   equally here), and a confusion matrix.
7. Select the best model by macro F1-score (a fairer metric than raw
   accuracy for a balanced multi-class problem) and print a short,
   honest comparison explaining why it won.
8. Save the selected pipeline (preprocessing + model together) to
   backend/models/career_model.joblib, and write
   backend/models/model_metadata.json with real metrics, feature names,
   target classes, and training date - no fabricated numbers.
9. Save a confusion matrix plot for the winning model to
   backend/models/confusion_matrix.png for use in the README/report.
"""

import json
import os
import sys
from datetime import datetime, timezone

import joblib
import matplotlib

matplotlib.use("Agg")  # headless rendering, no display needed
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from sklearn.ensemble import GradientBoostingClassifier, RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    ConfusionMatrixDisplay,
    accuracy_score,
    classification_report,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
)
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline

sys.path.insert(0, os.path.dirname(__file__))
from preprocess import ALL_FEATURES, TARGET_COLUMN, build_preprocessor  # noqa: E402

RANDOM_STATE = 42

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DATA_PATH = os.path.join(BASE_DIR, "backend", "data", "career_dataset.csv")
MODEL_DIR = os.path.join(BASE_DIR, "backend", "models")
MODEL_PATH = os.path.join(MODEL_DIR, "career_model.joblib")
METADATA_PATH = os.path.join(MODEL_DIR, "model_metadata.json")
CONFUSION_MATRIX_PATH = os.path.join(MODEL_DIR, "confusion_matrix.png")


def load_and_validate_data(path: str) -> pd.DataFrame:
    """Load the dataset and run basic, honest data-quality checks."""
    if not os.path.exists(path):
        raise FileNotFoundError(
            f"Dataset not found at {path}. Run training/generate_dataset.py first."
        )

    df = pd.read_csv(path)
    print(f"Loaded dataset: {df.shape[0]} rows, {df.shape[1]} columns")

    missing = df.isnull().sum()
    missing = missing[missing > 0]
    if len(missing) > 0:
        print("Missing values found:")
        print(missing)
        # For this project's synthetic data there should be none, but if
        # any slipped in, drop those rows rather than silently guessing.
        df = df.dropna().reset_index(drop=True)
        print(f"Dropped rows with missing values. New shape: {df.shape}")
    else:
        print("Missing values: none found.")

    n_duplicates = df.duplicated().sum()
    if n_duplicates > 0:
        print(f"Duplicate rows found: {n_duplicates}. Removing duplicates.")
        df = df.drop_duplicates().reset_index(drop=True)
    else:
        print("Duplicate rows: none found.")

    # Basic range validation on numeric skill/interest columns (must be 0-3)
    numeric_skill_cols = [
        c
        for c in df.columns
        if (c.endswith("_level") or c.startswith("interest_"))
        and c != "education_level"
        and pd.api.types.is_numeric_dtype(df[c])
    ]
    invalid_mask = pd.Series(False, index=df.index)
    for col in numeric_skill_cols:
        invalid_mask |= ~df[col].between(0, 3)
    n_invalid = invalid_mask.sum()
    if n_invalid > 0:
        print(f"Invalid skill/interest values found in {n_invalid} rows. Removing them.")
        df = df.loc[~invalid_mask].reset_index(drop=True)
    else:
        print("Invalid skill/interest values: none found.")

    print("\nClass distribution (checking for imbalance):")
    class_counts = df[TARGET_COLUMN].value_counts()
    print(class_counts)
    imbalance_ratio = class_counts.max() / class_counts.min()
    print(f"Imbalance ratio (max class / min class): {imbalance_ratio:.2f}")
    if imbalance_ratio > 1.5:
        print(
            "Note: classes are somewhat imbalanced. Stratified train/test "
            "splitting will be used, and macro-averaged metrics will be "
            "reported so no single class dominates the evaluation."
        )
    else:
        print("Classes are reasonably balanced.")

    return df


def build_candidate_pipelines() -> dict:
    """Return {model_name: sklearn Pipeline} for every candidate model."""
    candidates = {
        "RandomForestClassifier": RandomForestClassifier(
            n_estimators=300,
            max_depth=None,
            min_samples_leaf=2,
            random_state=RANDOM_STATE,
            n_jobs=-1,
        ),
        "LogisticRegression": LogisticRegression(
            max_iter=2000,
            random_state=RANDOM_STATE,
        ),
        "GradientBoostingClassifier": GradientBoostingClassifier(
            n_estimators=200,
            max_depth=3,
            learning_rate=0.1,
            random_state=RANDOM_STATE,
        ),
    }
    pipelines = {}
    for name, clf in candidates.items():
        pipelines[name] = Pipeline(
            steps=[("preprocessor", build_preprocessor()), ("classifier", clf)]
        )
    return pipelines


def evaluate_pipeline(pipeline: Pipeline, X_test: pd.DataFrame, y_test: pd.Series) -> dict:
    """Compute real evaluation metrics for a fitted pipeline on the test set."""
    y_pred = pipeline.predict(X_test)
    metrics = {
        "accuracy": float(accuracy_score(y_test, y_pred)),
        "precision_macro": float(precision_score(y_test, y_pred, average="macro", zero_division=0)),
        "recall_macro": float(recall_score(y_test, y_pred, average="macro", zero_division=0)),
        "f1_macro": float(f1_score(y_test, y_pred, average="macro", zero_division=0)),
    }
    return metrics, y_pred


def main():
    print("=" * 70)
    print("AI Career & Skill Recommendation System - Model Training")
    print("=" * 70)

    df = load_and_validate_data(DATA_PATH)

    X = df[ALL_FEATURES]
    y = df[TARGET_COLUMN]
    classes = sorted(y.unique().tolist())

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=RANDOM_STATE, stratify=y
    )
    print(f"\nTrain set: {X_train.shape[0]} rows | Test set: {X_test.shape[0]} rows")

    pipelines = build_candidate_pipelines()
    results = {}
    fitted_pipelines = {}

    print("\n" + "-" * 70)
    print("Training and evaluating candidate models")
    print("-" * 70)
    for name, pipeline in pipelines.items():
        print(f"\nTraining {name} ...")
        pipeline.fit(X_train, y_train)
        metrics, y_pred = evaluate_pipeline(pipeline, X_test, y_test)
        results[name] = metrics
        fitted_pipelines[name] = pipeline
        print(f"  Accuracy:          {metrics['accuracy']:.4f}")
        print(f"  Precision (macro): {metrics['precision_macro']:.4f}")
        print(f"  Recall (macro):    {metrics['recall_macro']:.4f}")
        print(f"  F1-score (macro):  {metrics['f1_macro']:.4f}")

    # Select the best model by macro F1 (fair for a multi-class, roughly
    # balanced problem - it does not let one strong class hide weak ones).
    best_model_name = max(results, key=lambda name: results[name]["f1_macro"])
    best_pipeline = fitted_pipelines[best_model_name]
    best_metrics = results[best_model_name]

    print("\n" + "=" * 70)
    print("MODEL COMPARISON SUMMARY")
    print("=" * 70)
    comparison_df = pd.DataFrame(results).T.sort_values("f1_macro", ascending=False)
    print(comparison_df.to_string())
    print(
        f"\nSelected model: {best_model_name} "
        f"(highest macro F1-score = {best_metrics['f1_macro']:.4f})"
    )

    # Detailed classification report + confusion matrix for the winner
    y_pred_best = best_pipeline.predict(X_test)
    print("\nClassification report (selected model):")
    report_text = classification_report(y_test, y_pred_best, labels=classes, zero_division=0)
    print(report_text)

    cm = confusion_matrix(y_test, y_pred_best, labels=classes)

    os.makedirs(MODEL_DIR, exist_ok=True)

    fig, ax = plt.subplots(figsize=(9, 8))
    disp = ConfusionMatrixDisplay(confusion_matrix=cm, display_labels=classes)
    disp.plot(ax=ax, xticks_rotation=45, colorbar=False, cmap="Blues")
    ax.set_title(f"Confusion Matrix - {best_model_name}")
    plt.tight_layout()
    plt.savefig(CONFUSION_MATRIX_PATH, dpi=150)
    plt.close(fig)
    print(f"\nConfusion matrix image saved to: {CONFUSION_MATRIX_PATH}")

    # Save the winning pipeline (preprocessing + model together)
    joblib.dump(best_pipeline, MODEL_PATH)
    print(f"Trained model saved to: {MODEL_PATH}")

    metadata = {
        "model_name": best_model_name,
        "training_date": datetime.now(timezone.utc).isoformat(),
        "random_state": RANDOM_STATE,
        "feature_names": ALL_FEATURES,
        "target_classes": classes,
        "dataset_info": {
            "path": os.path.relpath(DATA_PATH, BASE_DIR),
            "n_rows": int(df.shape[0]),
            "n_features": len(ALL_FEATURES),
            "type": "synthetic/demo",
            "class_distribution": df[TARGET_COLUMN].value_counts().to_dict(),
        },
        "train_test_split": {
            "test_size": 0.2,
            "n_train": int(X_train.shape[0]),
            "n_test": int(X_test.shape[0]),
            "stratified": True,
        },
        "all_model_metrics": results,
        "selected_model_metrics": best_metrics,
        "confusion_matrix": {
            "labels": classes,
            "matrix": cm.tolist(),
        },
    }
    with open(METADATA_PATH, "w") as f:
        json.dump(metadata, f, indent=2)
    print(f"Model metadata saved to: {METADATA_PATH}")

    print("\nDone. The backend will load this saved model at startup.")


if __name__ == "__main__":
    main()
