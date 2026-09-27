from pathlib import Path

import joblib
import pandas as pd

from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    confusion_matrix,
    classification_report,
)


# ============================================================
# 1. PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent

DATA_FILE = (
    BASE_DIR
    / "data"
    / "processed"
    / "risk_dataset.csv"
)

MODEL_FILE = (
    BASE_DIR
    / "models"
    / "risk_model.joblib"
)

PREDICTION_FILE = (
    BASE_DIR
    / "data"
    / "processed"
    / "risk_test_predictions.csv"
)


# ============================================================
# 2. LOAD DATA
# ============================================================

print("=" * 70)
print("CAREERX — RISK MODEL EVALUATION")
print("=" * 70)

print("\nLoading risk dataset...")

df = pd.read_csv(DATA_FILE)

print("Dataset shape:", df.shape)


# ============================================================
# 3. LOAD TRAINED MODEL
# ============================================================

print("\nLoading trained model...")

model = joblib.load(MODEL_FILE)

print("Model loaded successfully.")


# ============================================================
# 4. LOAD TEST PREDICTIONS
# ============================================================

print("\nLoading test predictions...")

predictions = pd.read_csv(PREDICTION_FILE)

print("Prediction dataset shape:", predictions.shape)


# ============================================================
# 5. ACTUAL VS PREDICTED
# ============================================================

y_true = predictions["actual_risk"]

y_pred = predictions["predicted_risk"]

y_probability = predictions["risk_probability"]


# ============================================================
# 6. OVERALL PERFORMANCE
# ============================================================

print("\n" + "=" * 70)
print("OVERALL PERFORMANCE")
print("=" * 70)

accuracy = accuracy_score(
    y_true,
    y_pred
)

precision = precision_score(
    y_true,
    y_pred
)

recall = recall_score(
    y_true,
    y_pred
)

f1 = f1_score(
    y_true,
    y_pred
)

roc_auc = roc_auc_score(
    y_true,
    y_probability
)

print("\nAccuracy :", round(accuracy, 4))
print("Precision:", round(precision, 4))
print("Recall   :", round(recall, 4))
print("F1       :", round(f1, 4))
print("ROC-AUC  :", round(roc_auc, 4))


# ============================================================
# 7. CONFUSION MATRIX
# ============================================================

print("\n" + "=" * 70)
print("CONFUSION MATRIX")
print("=" * 70)

cm = confusion_matrix(
    y_true,
    y_pred
)

print("\n                 Predicted")
print("                 Low   High")
print(
    f"Actual Low      {cm[0, 0]:4d}  {cm[0, 1]:4d}"
)
print(
    f"Actual High     {cm[1, 0]:4d}  {cm[1, 1]:4d}"
)


# ============================================================
# 8. CLASSIFICATION REPORT
# ============================================================

print("\n" + "=" * 70)
print("CLASSIFICATION REPORT")
print("=" * 70)

print(
    classification_report(
        y_true,
        y_pred,
        target_names=[
            "Low Risk",
            "High Risk"
        ]
    )
)


# ============================================================
# 9. IDENTIFY ERROR TYPES
# ============================================================

print("\n" + "=" * 70)
print("ERROR ANALYSIS")
print("=" * 70)

# False Positive:
# Actual = 0, Predicted = 1

false_positive = predictions[
    (predictions["actual_risk"] == 0)
    &
    (predictions["predicted_risk"] == 1)
].copy()


# False Negative:
# Actual = 1, Predicted = 0

false_negative = predictions[
    (predictions["actual_risk"] == 1)
    &
    (predictions["predicted_risk"] == 0)
].copy()


print("\nFalse Positives:", len(false_positive))
print("False Negatives:", len(false_negative))


# ============================================================
# 10. ERROR RATES
# ============================================================

high_risk_count = (
    y_true == 1
).sum()

low_risk_count = (
    y_true == 0
).sum()

false_negative_rate = (
    len(false_negative)
    / high_risk_count
)

false_positive_rate = (
    len(false_positive)
    / low_risk_count
)

print("\nFalse Negative Rate:")
print(round(false_negative_rate, 4))

print("\nFalse Positive Rate:")
print(round(false_positive_rate, 4))


# ============================================================
# 11. PROBABILITY ANALYSIS
# ============================================================

print("\n" + "=" * 70)
print("RISK PROBABILITY ANALYSIS")
print("=" * 70)

print("\nProbability statistics:")

print(
    y_probability.describe()
)


# ============================================================
# 12. RISK BANDS
# ============================================================

def risk_band(probability):

    if probability < 0.30:
        return "Low"

    elif probability < 0.70:
        return "Moderate"

    else:
        return "High"


predictions["risk_band"] = (
    predictions["risk_probability"]
    .apply(risk_band)
)


print("\nRisk band distribution:")

print(
    predictions["risk_band"]
    .value_counts()
)


print("\nRisk band percentages:")

print(
    predictions["risk_band"]
    .value_counts(
        normalize=True
    )
    .mul(100)
    .round(2)
)


# ============================================================
# 13. ACTUAL OUTCOME BY RISK BAND
# ============================================================

print("\n" + "=" * 70)
print("ACTUAL OUTCOME BY RISK BAND")
print("=" * 70)

band_analysis = (
    predictions
    .groupby("risk_band")["actual_risk"]
    .agg(
        students="count",
        actual_high_risk="sum",
        actual_risk_rate="mean"
    )
)

band_analysis["actual_risk_rate"] = (
    band_analysis["actual_risk_rate"]
    * 100
).round(2)

print(
    band_analysis
)


# ============================================================
# 14. FALSE POSITIVE ANALYSIS
# ============================================================

print("\n" + "=" * 70)
print("FALSE POSITIVE PROBABILITY")
print("=" * 70)

if len(false_positive) > 0:

    print(
        false_positive[
            "risk_probability"
        ].describe()
    )

else:

    print("No false positives found.")


# ============================================================
# 15. FALSE NEGATIVE ANALYSIS
# ============================================================

print("\n" + "=" * 70)
print("FALSE NEGATIVE PROBABILITY")
print("=" * 70)

if len(false_negative) > 0:

    print(
        false_negative[
            "risk_probability"
        ].describe()
    )

else:

    print("No false negatives found.")


# ============================================================
# 16. SAVE ERROR DATASETS
# ============================================================

false_positive_file = (
    BASE_DIR
    / "data"
    / "processed"
    / "risk_false_positives.csv"
)

false_negative_file = (
    BASE_DIR
    / "data"
    / "processed"
    / "risk_false_negatives.csv"
)

false_positive.to_csv(
    false_positive_file,
    index=False
)

false_negative.to_csv(
    false_negative_file,
    index=False
)


# ============================================================
# 17. SAVE COMPLETE ANALYSIS
# ============================================================

analysis_file = (
    BASE_DIR
    / "data"
    / "processed"
    / "risk_predictions_analyzed.csv"
)

predictions.to_csv(
    analysis_file,
    index=False
)


print("\nSaved false positives:")
print(false_positive_file)

print("\nSaved false negatives:")
print(false_negative_file)

print("\nSaved analyzed predictions:")
print(analysis_file)


# ============================================================
# 18. SAMPLE ERRORS
# ============================================================

print("\n" + "=" * 70)
print("SAMPLE FALSE NEGATIVES")
print("=" * 70)

if len(false_negative) > 0:

    print(
        false_negative[
            [
                "risk_probability",
                "actual_risk",
                "predicted_risk"
            ]
        ]
        .sort_values(
            "risk_probability",
            ascending=False
        )
        .head(10)
        .to_string(index=False)
    )


print("\n" + "=" * 70)
print("SAMPLE FALSE POSITIVES")
print("=" * 70)

if len(false_positive) > 0:

    print(
        false_positive[
            [
                "risk_probability",
                "actual_risk",
                "predicted_risk"
            ]
        ]
        .sort_values(
            "risk_probability",
            ascending=True
        )
        .head(10)
        .to_string(index=False)
    )


# ============================================================
# COMPLETE
# ============================================================

print("\n" + "=" * 70)
print("STEP 2 COMPLETE — MODEL EVALUATION + ERROR ANALYSIS")
print("=" * 70)