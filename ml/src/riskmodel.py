from pathlib import Path

import joblib
import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.impute import SimpleImputer

from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier

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

MODEL_DIR = BASE_DIR / "models"

MODEL_DIR.mkdir(
    parents=True,
    exist_ok=True
)


# ============================================================
# 2. LOAD DATA
# ============================================================

print("=" * 70)
print("CAREERX RISK MODEL")
print("=" * 70)

print("\nLoading dataset...")

df = pd.read_csv(DATA_FILE)

print("Dataset loaded.")
print("Shape:", df.shape)


# ============================================================
# 3. SEPARATE FEATURES AND TARGET
# ============================================================

X = df.drop(
    columns=["risk_target"]
)

y = df["risk_target"]

print("\nFeature matrix shape:", X.shape)
print("Target shape:", y.shape)

print("\nTarget distribution:")
print(y.value_counts())

print("\nTarget percentages:")
print(
    y.value_counts(
        normalize=True
    ).mul(100).round(2)
)


# ============================================================
# 4. IDENTIFY FEATURE TYPES
# ============================================================

categorical_features = X.select_dtypes(
    include=["object"]
).columns.tolist()

numeric_features = X.select_dtypes(
    include=["int64", "float64"]
).columns.tolist()

print("\nCategorical features:")
print(categorical_features)

print("\nNumeric features:")
print(numeric_features)


# ============================================================
# 5. NUMERIC PREPROCESSING
# ============================================================

numeric_pipeline = Pipeline(
    steps=[
        (
            "imputer",
            SimpleImputer(
                strategy="median"
            )
        ),
        (
            "scaler",
            StandardScaler()
        )
    ]
)


# ============================================================
# 6. CATEGORICAL PREPROCESSING
# ============================================================

categorical_pipeline = Pipeline(
    steps=[
        (
            "imputer",
            SimpleImputer(
                strategy="most_frequent"
            )
        ),
        (
            "encoder",
            OneHotEncoder(
                handle_unknown="ignore"
            )
        )
    ]
)


# ============================================================
# 7. COMBINE PREPROCESSING
# ============================================================

preprocessor = ColumnTransformer(
    transformers=[
        (
            "numeric",
            numeric_pipeline,
            numeric_features
        ),
        (
            "categorical",
            categorical_pipeline,
            categorical_features
        )
    ]
)


# ============================================================
# 8. TRAIN / TEST SPLIT
# ============================================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

print("\n" + "=" * 70)
print("TRAIN / TEST SPLIT")
print("=" * 70)

print("Training records:", len(X_train))
print("Testing records :", len(X_test))


# ============================================================
# 9. DEFINE MODELS
# ============================================================

models = {

    "logistic_regression": LogisticRegression(
        max_iter=2000,
        class_weight="balanced",
        random_state=42
    ),

    "random_forest": RandomForestClassifier(
        n_estimators=300,
        min_samples_leaf=2,
        class_weight="balanced",
        random_state=42,
        n_jobs=-1
    )
}


results = {}


# ============================================================
# 10. TRAIN BOTH MODELS
# ============================================================

for model_name, model in models.items():

    print("\n" + "=" * 70)
    print("TRAINING:", model_name)
    print("=" * 70)

    pipeline = Pipeline(
        steps=[
            (
                "preprocessor",
                preprocessor
            ),
            (
                "model",
                model
            )
        ]
    )

    print("Training...")

    pipeline.fit(
        X_train,
        y_train
    )

    print("Training complete.")

    # --------------------------------------------------------
    # Predictions
    # --------------------------------------------------------

    y_pred = pipeline.predict(
        X_test
    )

    y_probability = pipeline.predict_proba(
        X_test
    )[:, 1]

    # --------------------------------------------------------
    # Metrics
    # --------------------------------------------------------

    accuracy = accuracy_score(
        y_test,
        y_pred
    )

    precision = precision_score(
        y_test,
        y_pred
    )

    recall = recall_score(
        y_test,
        y_pred
    )

    f1 = f1_score(
        y_test,
        y_pred
    )

    roc_auc = roc_auc_score(
        y_test,
        y_probability
    )

    # --------------------------------------------------------
    # Store results
    # --------------------------------------------------------

    results[model_name] = {
        "pipeline": pipeline,
        "accuracy": accuracy,
        "precision": precision,
        "recall": recall,
        "f1": f1,
        "roc_auc": roc_auc
    }

    # --------------------------------------------------------
    # Print results
    # --------------------------------------------------------

    print("\nMetrics")

    print(
        "Accuracy :",
        round(accuracy, 4)
    )

    print(
        "Precision:",
        round(precision, 4)
    )

    print(
        "Recall   :",
        round(recall, 4)
    )

    print(
        "F1       :",
        round(f1, 4)
    )

    print(
        "ROC-AUC  :",
        round(roc_auc, 4)
    )

    print("\nConfusion Matrix:")

    print(
        confusion_matrix(
            y_test,
            y_pred
        )
    )

    print("\nClassification Report:")

    print(
        classification_report(
            y_test,
            y_pred,
            target_names=[
                "Low Risk",
                "High Risk"
            ]
        )
    )


# ============================================================
# 11. MODEL COMPARISON
# ============================================================

print("\n" + "=" * 70)
print("MODEL COMPARISON")
print("=" * 70)

comparison = []

for name, result in results.items():

    comparison.append({
        "model": name,
        "accuracy": result["accuracy"],
        "precision": result["precision"],
        "recall": result["recall"],
        "f1": result["f1"],
        "roc_auc": result["roc_auc"]
    })


comparison_df = pd.DataFrame(
    comparison
)

print(
    comparison_df.to_string(
        index=False
    )
)


# ============================================================
# 12. SELECT BEST MODEL
# ============================================================

best_model_name = max(
    results,
    key=lambda name: results[name]["roc_auc"]
)

best_pipeline = results[
    best_model_name
]["pipeline"]

print("\n" + "=" * 70)
print("SELECTED MODEL")
print("=" * 70)

print(
    "Selected:",
    best_model_name
)


# ============================================================
# 13. SAVE MODEL
# ============================================================

model_file = (
    MODEL_DIR
    / "risk_model.joblib"
)

joblib.dump(
    best_pipeline,
    model_file
)

print("\nModel saved to:")
print(model_file)


# ============================================================
# 14. SAVE TEST PREDICTIONS
# ============================================================

test_output = X_test.copy()

test_output["actual_risk"] = (
    y_test.values
)

test_output["predicted_risk"] = (
    best_pipeline.predict(
        X_test
    )
)

test_output["risk_probability"] = (
    best_pipeline.predict_proba(
        X_test
    )[:, 1]
)

test_file = (
    BASE_DIR
    / "data"
    / "processed"
    / "risk_test_predictions.csv"
)

test_output.to_csv(
    test_file,
    index=False
)

print("\nTest predictions saved to:")
print(test_file)


# ============================================================
# 15. COMPLETE
# ============================================================

print("\n" + "=" * 70)
print("STEP 1 COMPLETE — RISK MODEL TRAINING")
print("=" * 70)
