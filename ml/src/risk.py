from pathlib import Path
import pandas as pd

BASE_DIR = Path(__file__).resolve().parent.parent

DATA_FILE = (
    BASE_DIR
    / "data"
    / "processed"
    / "student_learning_dataset.csv"
)

OUTPUT_FILE = (
    BASE_DIR
    / "data"
    / "processed"
    / "risk_dataset.csv"
)

print("Loading CareerX learning dataset...")

df = pd.read_csv(DATA_FILE)

print("Dataset loaded.")
print("Original shape:", df.shape)


# ============================================================
# 1. CREATE TARGET
# ============================================================

print("\nCreating target variable...")

# Withdrawn / Fail = higher-risk outcome
# Pass / Distinction = successful outcome

df["risk_target"] = df["final_result"].isin(
    ["Withdrawn", "Fail"]
).astype(int)

print("\nRisk target distribution:")
print(df["risk_target"].value_counts())

print("\nRisk target percentages:")
print(
    df["risk_target"]
    .value_counts(normalize=True)
    .mul(100)
    .round(2)
)


# ============================================================
# 2. CREATE EXPLICIT MISSINGNESS FEATURES
# ============================================================

print("\nCreating missingness indicators...")

df["has_vle_activity"] = (
    df["total_clicks"].notna()
).astype(int)

df["has_assessment_data"] = (
    df["mean_score"].notna()
).astype(int)


# ============================================================
# 3. SELECT INITIAL FEATURES
# ============================================================

feature_columns = [
    "code_module",
    "code_presentation",

    "gender",
    "region",
    "highest_education",
    "imd_band",
    "age_band",
    "disability",

    "num_of_prev_attempts",
    "studied_credits",

    "assessment_count",
    "mean_score",
    "max_score",
    "min_score",

    "total_clicks",
    "active_days",
    "unique_activities",
    "average_daily_clicks",
    "learning_span_days",
    "clicks_per_active_day",

    "has_vle_activity",
    "has_assessment_data",
]


# ============================================================
# 4. KEEP TARGET
# ============================================================

model_df = df[feature_columns + ["risk_target"]].copy()


# ============================================================
# 5. BASIC CLEANUP
# ============================================================

# Keep missing values for now.
# We will handle them properly inside the ML pipeline.

print("\nFinal feature dataset:")
print("Shape:", model_df.shape)

print("\nColumns:")
for column in model_df.columns:
    print("-", column)


# ============================================================
# 6. SAVE
# ============================================================

model_df.to_csv(OUTPUT_FILE, index=False)

print("\nSaved:")
print(OUTPUT_FILE)

print("\nPreparation complete.")