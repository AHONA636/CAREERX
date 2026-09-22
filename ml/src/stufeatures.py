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
# Load datasets
# --------------------------------------------------

print("Loading student information...")

students = pd.read_csv(
    DATA_DIR / "studentInfo.csv"
)

print("Loading assessments...")

student_assessment = pd.read_csv(
    DATA_DIR / "studentAssessment.csv"
)

assessments = pd.read_csv(
    DATA_DIR / "assessments.csv"
)

print("Loading registration data...")

registration = pd.read_csv(
    DATA_DIR / "studentRegistration.csv"
)


# --------------------------------------------------
# 1. Assessment features
# --------------------------------------------------

print("\nCreating assessment features...")

# Add course/module information to each
# student assessment record.
assessment_data = student_assessment.merge(
    assessments[
        [
            "id_assessment",
            "code_module",
            "code_presentation",
            "assessment_type",
            "date",
            "weight"
        ]
    ],
    on="id_assessment",
    how="left"
)


# Aggregate assessments at:
# student + module + presentation level
assessment_features = (
    assessment_data
    .groupby(
        [
            "id_student",
            "code_module",
            "code_presentation"
        ]
    )
    .agg(
        assessment_count=("id_assessment", "count"),
        mean_score=("score", "mean"),
        max_score=("score", "max"),
        min_score=("score", "min"),
        mean_submission_date=("date_submitted", "mean"),
        mean_assessment_weight=("weight", "mean")
    )
    .reset_index()
)


# --------------------------------------------------
# 2. Registration features
# --------------------------------------------------

print("Creating registration features...")

registration_features = (
    registration
    .groupby(
        [
            "id_student",
            "code_module",
            "code_presentation"
        ]
    )
    .agg(
        registration_date=("date_registration", "mean"),
        unregistration_date=("date_unregistration", "mean")
    )
    .reset_index()
)


# --------------------------------------------------
# 3. Merge student + assessment features
# --------------------------------------------------

print("Merging student and assessment features...")

student_features = students.merge(
    assessment_features,
    on=[
        "id_student",
        "code_module",
        "code_presentation"
    ],
    how="left"
)


# --------------------------------------------------
# 4. Add registration features
# --------------------------------------------------

print("Adding registration features...")

student_features = student_features.merge(
    registration_features,
    on=[
        "id_student",
        "code_module",
        "code_presentation"
    ],
    how="left"
)


# --------------------------------------------------
# 5. Save dataset
# --------------------------------------------------

output_file = (
    OUTPUT_DIR /
    "student_features.csv"
)

student_features.to_csv(
    output_file,
    index=False
)


# --------------------------------------------------
# 6. Display summary
# --------------------------------------------------

print("\n----------------------------------------")
print("Student dataset created successfully!")
print("----------------------------------------")

print("Shape:", student_features.shape)

print("Saved to:", output_file)

print("\nColumns:")

for column in student_features.columns:
    print(" -", column)

print("\nFirst 5 rows:")

print(
    student_features
    .head()
    .to_string(index=False)
)