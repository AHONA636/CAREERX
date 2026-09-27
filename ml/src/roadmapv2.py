import pandas as pd
from pathlib import Path


# =========================================================
# PATHS
# =========================================================

BASE_DIR = Path(__file__).resolve().parents[1]

PROCESSED_DIR = BASE_DIR / "data" / "processed"

RECOMMENDATION_FILE = (
    PROCESSED_DIR / "skill_recommendations.csv"
)

OUTPUT_FILE = (
    PROCESSED_DIR / "personalized_roadmap_v2.csv"
)


# =========================================================
# ROADMAP PHASES
# =========================================================
# Lower number = earlier in the roadmap.
#
# The order is deliberately explicit because the system
# should not assume that high job demand means "learn first".
# =========================================================

PHASES = {

    "data_foundations": {
        "order": 1,
        "skills": [
            "sql",
            "data analysis",
            "data science"
        ]
    },

    "machine_learning": {
        "order": 2,
        "skills": [
            "algorithms",
            "scikit-learn"
        ]
    },

    "deep_learning": {
        "order": 3,
        "skills": [
            "deep learning",
            "tensorflow",
            "keras",
            "pytorch"
        ]
    },

    "nlp": {
        "order": 4,
        "skills": [
            "nlp"
        ]
    },

    "generative_ai": {
        "order": 5,
        "skills": [
            "large language models",
            "generative ai"
        ]
    },

    "cloud_big_data": {
        "order": 6,
        "skills": [
            "aws",
            "azure",
            "gcp",
            "hive"
        ]
    }
}


# =========================================================
# SKILL → PHASE MAP
# =========================================================

SKILL_PHASE = {}

for phase_name, phase_info in PHASES.items():

    for skill in phase_info["skills"]:

        SKILL_PHASE[skill] = {
            "phase": phase_name,
            "phase_order": phase_info["order"]
        }


# =========================================================
# SKILLS TO EXCLUDE FROM LEARNING ROADMAP
# =========================================================
# These are broad categories rather than useful standalone
# learning targets for this version of the roadmap.
# =========================================================

EXCLUDED_SKILLS = {
    "artificial intelligence",
    "data"
}


# =========================================================
# LOAD RECOMMENDATIONS
# =========================================================

def load_recommendations():

    df = pd.read_csv(
        RECOMMENDATION_FILE
    )

    df["skill"] = (
        df["skill"]
        .astype(str)
        .str.lower()
        .str.strip()
    )

    return df


# =========================================================
# SELECT BEST RESOURCE
# =========================================================

def select_best_resource(df):

    # One resource per skill for the roadmap.
    #
    # We choose the highest recommendation score.

    selected = (
        df.sort_values(
            "recommendation_score",
            ascending=False
        )
        .drop_duplicates(
            subset=["skill"],
            keep="first"
        )
        .copy()
    )

    return selected


# =========================================================
# ASSIGN PHASE
# =========================================================

def assign_phase(row):

    skill = row["skill"]

    if skill in SKILL_PHASE:

        return pd.Series([
            SKILL_PHASE[skill]["phase"],
            SKILL_PHASE[skill]["phase_order"]
        ])

    # Unknown skills go to the end rather than being
    # incorrectly inserted into an earlier phase.

    return pd.Series([
        "additional",
        99
    ])


# =========================================================
# LEARNING STATUS
# =========================================================

def learning_status(confidence):

    if confidence >= 0.60:
        return "covered"

    elif confidence >= 0.30:
        return "partial"

    else:
        return "missing"


# =========================================================
# BUILD ROADMAP
# =========================================================

def build_roadmap(recommendations):

    # Remove broad/non-actionable skills
    recommendations = recommendations[
        ~recommendations["skill"].isin(
            EXCLUDED_SKILLS
        )
    ].copy()

    # Select one best resource per skill
    roadmap = select_best_resource(
        recommendations
    )

    # Assign roadmap phase
    roadmap[
        ["phase", "phase_order"]
    ] = roadmap.apply(
        assign_phase,
        axis=1
    )

    # Student status
    roadmap["student_status"] = (
        roadmap["student_confidence"]
        .apply(learning_status)
    )

    # -----------------------------------------------------
    # Priority inside each phase
    # -----------------------------------------------------
    #
    # Higher gap score = more important within the phase.
    #

    roadmap = roadmap.sort_values(
        [
            "phase_order",
            "gap_score",
            "demand_percentage"
        ],
        ascending=[
            True,
            False,
            False
        ]
    ).copy()

    # -----------------------------------------------------
    # Roadmap step
    # -----------------------------------------------------

    roadmap["roadmap_step"] = (
        range(1, len(roadmap) + 1)
    )

    # -----------------------------------------------------
    # Add recommended action
    # -----------------------------------------------------

    roadmap["recommended_action"] = (
        roadmap["student_status"]
        .map({
            "missing": "Learn",
            "partial": "Strengthen",
            "covered": "Maintain / Apply"
        })
    )

    # -----------------------------------------------------
    # Final columns
    # -----------------------------------------------------

    roadmap = roadmap[
        [
            "roadmap_step",
            "phase",
            "skill",
            "student_status",
            "student_confidence",
            "importance",
            "demand_percentage",
            "gap_score",
            "recommended_action",
            "resource_name",
            "provider",
            "resource_type",
            "level",
            "resource_url"
        ]
    ]

    return roadmap


# =========================================================
# PRINT ROADMAP
# =========================================================

def print_roadmap(roadmap):

    print("\n")
    print("=" * 80)
    print("CAREERX PERSONALIZED ROADMAP V2")
    print("=" * 80)

    current_phase = None

    for _, row in roadmap.iterrows():

        phase = row["phase"]

        if phase != current_phase:

            current_phase = phase

            print("\n" + "-" * 80)
            print(
                f"PHASE: {phase.upper().replace('_', ' ')}"
            )
            print("-" * 80)

        print(
            f"{int(row['roadmap_step']):2d}. "
            f"{row['skill']:<25} | "
            f"{row['student_status']:<8} | "
            f"Confidence: "
            f"{row['student_confidence']:.2f} | "
            f"Action: "
            f"{row['recommended_action']}"
        )

        print(
            f"    Resource: "
            f"{row['resource_name']} "
            f"({row['provider']})"
        )


# =========================================================
# MAIN
# =========================================================

def main():

    print("\nCAREERX ROADMAP GENERATOR V2")
    print("=" * 80)

    recommendations = load_recommendations()

    print(
        f"Recommendation records loaded: "
        f"{len(recommendations)}"
    )

    roadmap = build_roadmap(
        recommendations
    )

    roadmap.to_csv(
        OUTPUT_FILE,
        index=False
    )

    print_roadmap(
        roadmap
    )

    # -----------------------------------------------------
    # SUMMARY
    # -----------------------------------------------------

    print("\n")
    print("=" * 80)
    print("ROADMAP SUMMARY")
    print("=" * 80)

    print(
        f"Total learning targets : {len(roadmap)}"
    )

    print(
        f"Missing skills         : "
        f"{(roadmap['student_status'] == 'missing').sum()}"
    )

    print(
        f"Partial skills         : "
        f"{(roadmap['student_status'] == 'partial').sum()}"
    )

    print(
        f"Covered skills         : "
        f"{(roadmap['student_status'] == 'covered').sum()}"
    )

    print("\nSaved:")
    print(OUTPUT_FILE)


if __name__ == "__main__":
    main()