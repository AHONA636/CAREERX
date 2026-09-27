import pandas as pd
from pathlib import Path


# =========================================================
# PATHS
# =========================================================

BASE_DIR = Path(__file__).resolve().parents[1]

PROCESSED_DIR = BASE_DIR / "data" / "processed"

STUDENT_PROFILE_FILE = (
    PROCESSED_DIR / "student_skill_profile.csv"
)

ASSESSMENT_FILE = (
    PROCESSED_DIR / "student_assessments.csv"
)

UPDATED_PROFILE_FILE = (
    PROCESSED_DIR / "student_skill_profile_updated.csv"
)


# =========================================================
# TEMPORARY ASSESSMENT INPUT
# =========================================================
# Later this will come from CareerX's actual assessment
# system / database.
# =========================================================

NEW_ASSESSMENTS = [

    {
        "student_id": "student_001",
        "skill": "sql",
        "assessment_type": "technical_assessment",
        "score": 0.82
    },

    {
        "student_id": "student_001",
        "skill": "data analysis",
        "assessment_type": "technical_assessment",
        "score": 0.74
    }
]


# =========================================================
# EVIDENCE WEIGHTS
# =========================================================

EVIDENCE_WEIGHTS = {

    "coding_assessment": 1.00,

    "technical_assessment": 1.00,

    "verified_project": 0.90,

    "project": 0.85,

    "github": 0.80,

    "certificate": 0.70,

    "course": 0.60,

    "academic_subject": 0.60,

    "self_declared": 0.30
}


# =========================================================
# LOAD
# =========================================================

def load_profile():

    profile = pd.read_csv(
        STUDENT_PROFILE_FILE
    )

    profile["skill"] = (
        profile["skill"]
        .astype(str)
        .str.lower()
        .str.strip()
    )

    return profile


# =========================================================
# PROCESS NEW ASSESSMENTS
# =========================================================

def process_assessments():

    assessments = pd.DataFrame(
        NEW_ASSESSMENTS
    )

    assessments["skill"] = (
        assessments["skill"]
        .astype(str)
        .str.lower()
        .str.strip()
    )

    assessments["evidence_weight"] = (
        assessments["assessment_type"]
        .map(EVIDENCE_WEIGHTS)
        .fillna(0.30)
    )

    assessments["weighted_score"] = (
        assessments["score"]
        * assessments["evidence_weight"]
    )

    return assessments


# =========================================================
# UPDATE STUDENT PROFILE
# =========================================================

def update_profile(
    profile,
    assessments
):

    profile_records = {}

    # -----------------------------------------------------
    # Existing evidence
    # -----------------------------------------------------

    for _, row in profile.iterrows():

        key = (
            row["student_id"],
            row["skill"]
        )

        profile_records[key] = {

            "student_id":
                row["student_id"],

            "skill":
                row["skill"],

            "evidence_count":
                int(row["evidence_count"]),

            "best_score":
                float(row["best_score"]),

            "confidence":
                float(row["confidence"])
        }

    # -----------------------------------------------------
    # Add new assessment evidence
    # -----------------------------------------------------

    for _, row in assessments.iterrows():

        key = (
            row["student_id"],
            row["skill"]
        )

        new_score = float(
            row["score"]
        )

        new_weighted_score = float(
            row["weighted_score"]
        )

        if key not in profile_records:

            profile_records[key] = {

                "student_id":
                    row["student_id"],

                "skill":
                    row["skill"],

                "evidence_count": 1,

                "best_score":
                    new_score,

                "confidence":
                    new_weighted_score
            }

        else:

            current = profile_records[key]

            current["evidence_count"] += 1

            current["best_score"] = max(
                current["best_score"],
                new_score
            )

            # Evidence aggregation:
            #
            # New strong evidence should increase confidence,
            # but repeated evidence should not exceed 1.0.

            current["confidence"] = min(
                1.0,
                max(
                    current["confidence"],
                    new_weighted_score
                )
            )

    return pd.DataFrame(
        profile_records.values()
    )


# =========================================================
# MAIN
# =========================================================

def main():

    print("\nCAREERX ASSESSMENT ENGINE")
    print("=" * 60)

    profile = load_profile()

    print(
        f"Existing skills: {len(profile)}"
    )

    assessments = process_assessments()

    print(
        f"New assessments: {len(assessments)}"
    )

    updated_profile = update_profile(
        profile,
        assessments
    )

    updated_profile = updated_profile.sort_values(
        [
            "student_id",
            "confidence"
        ],
        ascending=[
            True,
            False
        ]
    )

    updated_profile.to_csv(
        UPDATED_PROFILE_FILE,
        index=False
    )

    print("\nUPDATED STUDENT PROFILE")
    print("-" * 60)

    print(
        updated_profile.to_string(
            index=False
        )
    )

    print("\nSaved:")
    print(UPDATED_PROFILE_FILE)


if __name__ == "__main__":
    main()