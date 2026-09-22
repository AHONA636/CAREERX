from pathlib import Path
import pandas as pd


# --------------------------------------------------
# Paths
# --------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent.parent

DATA_DIR = BASE_DIR / "data" / "processed"


# --------------------------------------------------
# Load datasets
# --------------------------------------------------

print("Loading student features...")

students = pd.read_csv(
    DATA_DIR / "student_features.csv"
)

print("Loading behavioral features...")

behavior = pd.read_csv(
    DATA_DIR / "behavior_features.csv"
)


# --------------------------------------------------
# Define the real relationship
# --------------------------------------------------

KEYS = [
    "id_student",
    "code_module",
    "code_presentation"
]


# --------------------------------------------------
# Check uniqueness before merging
# --------------------------------------------------

print("\nChecking student dataset...")

print(
    "Duplicate student-course records:",
    students.duplicated(KEYS).sum()
)

print("\nChecking behavior dataset...")

print(
    "Duplicate behavioral records:",
    behavior.duplicated(KEYS).sum()
)


# --------------------------------------------------
# Merge
# --------------------------------------------------

print("\nMerging datasets...")

learning_data = students.merge(
    behavior,
    on=KEYS,
    how="left",
    indicator=True
)


# --------------------------------------------------
# Check merge results
# --------------------------------------------------

print("\nMerge results:")

print(
    learning_data["_merge"].value_counts()
)


# Remove merge indicator after inspection
learning_data = learning_data.drop(
    columns=["_merge"]
)


# --------------------------------------------------
# Save
# --------------------------------------------------

output_file = (
    DATA_DIR /
    "student_learning_dataset.csv"
)

learning_data.to_csv(
    output_file,
    index=False
)


# --------------------------------------------------
# Summary
# --------------------------------------------------

print("\n----------------------------------------")
print("CareerX learning dataset created!")
print("----------------------------------------")

print(
    "Shape:",
    learning_data.shape
)

print(
    "Saved to:",
    output_file
)

print("\nColumns:")

for column in learning_data.columns:
    print(" -", column)


print("\nMissing values:")

print(
    learning_data.isna().sum()
)


print("\nFirst 5 rows:")

print(
    learning_data
    .head()
    .to_string(index=False)
)