import pandas as pd
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parents[1]

OUTPUT_DIR = BASE_DIR / "data" / "processed"


# ---------------------------------------------------------
# TEMPORARY STUDENT EVIDENCE
# Replace this later with assessments/projects/GitHub/etc.
# ---------------------------------------------------------

STUDENT_EVIDENCE = [
    {
        "student_id": "student_001",
        "skill": "python",
        "evidence_type": "coding_assessment",
        "score": 0.85
    },
    {
        "student_id": "student_001",
        "skill": "sql",
        "evidence_type": "course",
        "score": 0.75
    },
    {
        "student_id": "student_001",
        "skill": "git",
        "evidence_type": "project",
        "score": 0.80
    },
    {
        "student_id": "student_001",
        "skill": "machine learning",
        "evidence_type": "project",
        "score": 0.80
    },
    {
        "student_id": "student_001",
        "skill": "pandas",
        "evidence_type": "project",
        "score": 0.85
    },
    {
        "student_id": "student_001",
        "skill": "numpy",
        "evidence_type": "project",
        "score": 0.85
    }
]


# ---------------------------------------------------------
# EVIDENCE WEIGHTS
# ---------------------------------------------------------

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


# ---------------------------------------------------------
# NORMALIZATION
# ---------------------------------------------------------

ALIASES = {
    "py": "python",
    "python programming": "python",
    "sql programming": "sql",
    "machine learning": "machine learning",
    "ml": "machine learning",
    "pandas python": "pandas",
    "numpy python": "numpy"
}


def normalize_skill(skill):

    skill = str(skill).strip().lower()

    return ALIASES.get(skill, skill)


# ---------------------------------------------------------
# BUILD STUDENT SKILL PROFILE
# ---------------------------------------------------------

def build_student_profile():

    df = pd.DataFrame(STUDENT_EVIDENCE)

    df["skill"] = df["skill"].apply(normalize_skill)

    df["evidence_weight"] = (
        df["evidence_type"]
        .map(EVIDENCE_WEIGHTS)
        .fillna(0.30)
    )

    df["weighted_score"] = (
        df["score"] * df["evidence_weight"]
    )

    profile = (
        df.groupby(["student_id", "skill"])
        .agg(
            evidence_count=("skill", "count"),
            best_score=("score", "max"),
            confidence=("weighted_score", "max")
        )
        .reset_index()
    )

    profile["confidence"] = profile["confidence"].round(4)

    return profile


# ---------------------------------------------------------
# MAIN
# ---------------------------------------------------------

if __name__ == "__main__":

    profile = build_student_profile()

    output_file = OUTPUT_DIR / "student_skill_profile.csv"

    profile.to_csv(output_file, index=False)

    print("\nStudent Skill Profile")
    print("=" * 50)

    print(profile.to_string(index=False))

    print("\nSaved:")
    print(output_file)