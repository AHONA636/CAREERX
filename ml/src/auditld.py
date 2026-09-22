from pathlib import Path
import pandas as pd


# --------------------------------------------------
# Paths
# --------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent.parent

DATA_FILE = (
    BASE_DIR
    / "data"
    / "processed"
    / "student_learning_dataset.csv"
)


# --------------------------------------------------
# Load data
# --------------------------------------------------

print("Loading CareerX learning dataset...")

df = pd.read_csv(DATA_FILE)

print("\nDataset loaded.")


# --------------------------------------------------
# 1. Basic information
# --------------------------------------------------

print("\n" + "=" * 70)
print("BASIC DATASET INFORMATION")
print("=" * 70)

print("Rows:", len(df))
print("Columns:", len(df.columns))

print("\nData types:")

print(df.dtypes)


# --------------------------------------------------
# 2. Duplicate records
# --------------------------------------------------

print("\n" + "=" * 70)
print("DUPLICATES")
print("=" * 70)

keys = [
    "id_student",
    "code_module",
    "code_presentation"
]

print(
    "Duplicate student-course records:",
    df.duplicated(keys).sum()
)


# --------------------------------------------------
# 3. Missing values
# --------------------------------------------------

print("\n" + "=" * 70)
print("MISSING VALUES")
print("=" * 70)

missing = pd.DataFrame({
    "missing_count": df.isna().sum(),
    "missing_percent": (
        df.isna().mean() * 100
    )
})

missing = (
    missing
    .sort_values(
        "missing_percent",
        ascending=False
    )
)

print(missing.to_string())


# --------------------------------------------------
# 4. Final result distribution
# --------------------------------------------------

print("\n" + "=" * 70)
print("FINAL RESULT DISTRIBUTION")
print("=" * 70)

print(
    df["final_result"]
    .value_counts()
)

print("\nPercentages:")

print(
    df["final_result"]
    .value_counts(
        normalize=True
    )
    .mul(100)
    .round(2)
)


# --------------------------------------------------
# 5. Module distribution
# --------------------------------------------------

print("\n" + "=" * 70)
print("MODULE DISTRIBUTION")
print("=" * 70)

print(
    df["code_module"]
    .value_counts()
)


# --------------------------------------------------
# 6. Presentation distribution
# --------------------------------------------------

print("\n" + "=" * 70)
print("PRESENTATION DISTRIBUTION")
print("=" * 70)

print(
    df["code_presentation"]
    .value_counts()
)


# --------------------------------------------------
# 7. Numeric statistics
# --------------------------------------------------

print("\n" + "=" * 70)
print("NUMERIC FEATURES")
print("=" * 70)

numeric_columns = df.select_dtypes(
    include="number"
).columns

print(
    df[numeric_columns]
    .describe()
    .T
    .to_string()
)


# --------------------------------------------------
# 8. Behavioral statistics
# --------------------------------------------------

behavior_columns = [
    "total_clicks",
    "active_days",
    "unique_activities",
    "average_daily_clicks",
    "learning_span_days",
    "clicks_per_active_day"
]

print("\n" + "=" * 70)
print("BEHAVIORAL FEATURES")
print("=" * 70)

print(
    df[behavior_columns]
    .describe()
    .T
    .to_string()
)


# --------------------------------------------------
# 9. Assessment statistics
# --------------------------------------------------

assessment_columns = [
    "assessment_count",
    "mean_score",
    "max_score",
    "min_score"
]

print("\n" + "=" * 70)
print("ASSESSMENT FEATURES")
print("=" * 70)

print(
    df[assessment_columns]
    .describe()
    .T
    .to_string()
)


# --------------------------------------------------
# 10. Missing behavior vs final result
# --------------------------------------------------

print("\n" + "=" * 70)
print("STUDENTS WITHOUT VLE ACTIVITY")
print("=" * 70)

no_behavior = df["total_clicks"].isna()

print(
    "Students without recorded VLE activity:",
    no_behavior.sum()
)

print("\nFinal result distribution:")

print(
    df.loc[
        no_behavior,
        "final_result"
    ].value_counts()
)


# --------------------------------------------------
# 11. Missing assessments vs final result
# --------------------------------------------------

print("\n" + "=" * 70)
print("STUDENTS WITHOUT ASSESSMENT DATA")
print("=" * 70)

no_assessment = df["mean_score"].isna()

print(
    "Students without assessment score:",
    no_assessment.sum()
)

print("\nFinal result distribution:")

print(
    df.loc[
        no_assessment,
        "final_result"
    ].value_counts()
)


print("\nAudit complete.")