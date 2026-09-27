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
    PROCESSED_DIR / "personalized_roadmap.csv"
)


# =========================================================
# LEARNING DEPENDENCIES
# =========================================================

PREREQUISITES = {

    "data science": [
        "data analysis"
    ],

    "scikit-learn": [
        "data science"
    ],

    "deep learning": [
        "machine learning"
    ],

    "tensorflow": [
        "deep learning"
    ],

    "pytorch": [
        "deep learning"
    ],

    "nlp": [
        "machine learning",
        "deep learning"
    ],

    "large language models": [
        "nlp",
        "deep learning"
    ],

    "generative ai": [
        "large language models"
    ],

    "aws": [
        "machine learning"
    ],

    "azure": [
        "machine learning"
    ],

    "gcp": [
        "machine learning"
    ],

    "hive": [
        "data science"
    ]
}


# =========================================================
# STAGE DEFINITIONS
# =========================================================

STAGE_ORDER = {

    "foundation": 1,
    "data": 2,
    "machine_learning": 3,
    "deep_learning": 4,
    "nlp": 5,
    "generative_ai": 6,
    "cloud": 7,
    "big_data": 8
}


def get_stage(skill):

    skill = skill.lower()

    if skill in [
        "data analysis",
        "data science",
        "sql"
    ]:
        return "data"

    if skill in [
        "machine learning",
        "scikit-learn",
        "algorithms"
    ]:
        return "machine_learning"

    if skill in [
        "deep learning",
        "tensorflow",
        "pytorch",
        "keras"
    ]:
        return "deep_learning"

    if skill in [
        "nlp"
    ]:
        return "nlp"

    if skill in [
        "generative ai",
        "large language models"
    ]:
        return "generative_ai"

    if skill in [
        "aws",
        "azure",
        "gcp"
    ]:
        return "cloud"

    if skill in [
        "hive"
    ]:
        return "big_data"

    return "foundation"


# =========================================================
# LOAD
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
# SELECT BEST RESOURCE PER SKILL
# =========================================================

def select_resources(df):

    # Highest recommendation score for each skill
    selected = (
        df.sort_values(
            "recommendation_score",
            ascending=False
        )
        .groupby("skill")
        .first()
        .reset_index()
    )

    return selected


# =========================================================
# BUILD DEPENDENCY ORDER
# =========================================================

def dependency_depth(
    skill,
    cache=None
):

    if cache is None:
        cache = {}

    if skill in cache:
        return cache[skill]

    prerequisites = PREREQUISITES.get(
        skill,
        []
    )

    if not prerequisites:

        cache[skill] = 0
        return 0

    depth = 0

    for prerequisite in prerequisites:

        depth = max(
            depth,
            dependency_depth(
                prerequisite,
                cache
            ) + 1
        )

    cache[skill] = depth

    return depth


# =========================================================
# ROADMAP
# =========================================================

def generate_roadmap(df):

    selected = select_resources(df)

    cache = {}

    selected["dependency_depth"] = (
        selected["skill"]
        .apply(
            lambda x:
            dependency_depth(
                x,
                cache
            )
        )
    )

    selected["stage"] = (
        selected["skill"]
        .apply(get_stage)
    )

    selected["stage_order"] = (
        selected["stage"]
        .map(STAGE_ORDER)
        .fillna(99)
    )

    # Prioritize dependency order first,
    # then stage, then actual gap importance.
    roadmap = selected.sort_values(
        [
            "dependency_depth",
            "stage_order",
            "gap_score"
        ],
        ascending=[
            True,
            True,
            False
        ]
    ).copy()

    roadmap["roadmap_step"] = (
        range(1, len(roadmap) + 1)
    )

    roadmap = roadmap[
        [
            "roadmap_step",
            "skill",
            "stage",
            "importance",
            "demand_percentage",
            "student_confidence",
            "gap_score",
            "resource_name",
            "provider",
            "resource_type",
            "level",
            "resource_url"
        ]
    ]

    return roadmap


# =========================================================
# MAIN
# =========================================================

def main():

    print("\nCAREERX PERSONALIZED ROADMAP")
    print("=" * 60)

    recommendations = load_recommendations()

    print(
        f"Recommendation records: "
        f"{len(recommendations)}"
    )

    roadmap = generate_roadmap(
        recommendations
    )

    roadmap.to_csv(
        OUTPUT_FILE,
        index=False
    )

    print("\nPERSONALIZED ROADMAP")
    print("-" * 60)

    print(
        roadmap.to_string(
            index=False
        )
    )

    print("\nSaved:")
    print(OUTPUT_FILE)


if __name__ == "__main__":
    main()