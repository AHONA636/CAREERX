from pathlib import Path
import pandas as pd


# --------------------------------------------------
# Paths
# --------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent.parent

DATA_DIR = BASE_DIR / "data" / "raw" / "oulad"
OUTPUT_DIR = BASE_DIR / "data" / "processed"

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


# --------------------------------------------------
# Load student VLE data
# --------------------------------------------------

print("Loading studentVle.csv...")

vle = pd.read_csv(
    DATA_DIR / "studentVle.csv"
)

print("Loaded:", len(vle), "rows")


# --------------------------------------------------
# Basic cleaning
# --------------------------------------------------

print("Cleaning data...")

vle = vle.dropna(
    subset=[
        "id_student",
        "id_site",
        "date",
        "sum_click"
    ]
)


# --------------------------------------------------
# Behavioral aggregation
# --------------------------------------------------

print("Creating behavioral features...")


behavior_features = (
    vle
    .groupby(
        [
            "id_student",
            "code_module",
            "code_presentation"
        ]
    )
    .agg(
        total_clicks=("sum_click", "sum"),

        active_days=("date", "nunique"),

        unique_activities=("id_site", "nunique"),

        average_daily_clicks=("sum_click", "mean"),

        first_activity_day=("date", "min"),

        last_activity_day=("date", "max")
    )
    .reset_index()
)


# --------------------------------------------------
# Learning span
# --------------------------------------------------

behavior_features["learning_span_days"] = (
    behavior_features["last_activity_day"]
    - behavior_features["first_activity_day"]
)


# --------------------------------------------------
# Clicks per active day
# --------------------------------------------------

behavior_features["clicks_per_active_day"] = (
    behavior_features["total_clicks"]
    / behavior_features["active_days"]
)


# --------------------------------------------------
# Save
# --------------------------------------------------

output_file = (
    OUTPUT_DIR /
    "behavior_features.csv"
)

behavior_features.to_csv(
    output_file,
    index=False
)


# --------------------------------------------------
# Summary
# --------------------------------------------------

print("\n----------------------------------------")
print("Behavior dataset created!")
print("----------------------------------------")

print("Shape:", behavior_features.shape)

print("Saved to:", output_file)

print("\nColumns:")
print(
    behavior_features.columns.tolist()
)

print("\nFirst 5 rows:")
print(
    behavior_features.head().to_string(
        index=False
    )
)