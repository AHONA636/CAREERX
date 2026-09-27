import pandas as pd
from pathlib import Path


# =========================================================
# PATHS
# =========================================================

BASE_DIR = Path(__file__).resolve().parents[1]
PROCESSED_DIR = BASE_DIR / "data" / "processed"

GAP_FILE = PROCESSED_DIR / "priority_skill_gaps_student.csv"

RESOURCE_FILE = PROCESSED_DIR / "learning_resources.csv"
OUTPUT_FILE = PROCESSED_DIR / "skill_recommendations.csv"


# =========================================================
# REAL LEARNING RESOURCE CATALOG
# =========================================================
# These are real resources. The skill mappings are curated
# mappings between the resource and the skills it teaches.
# =========================================================

RESOURCES = [

    {
        "resource_id": "R001",
        "resource_name": "Machine Learning Crash Course",
        "provider": "Google",
        "resource_type": "course",
        "level": "beginner",
        "skills": "machine learning,data science,data analysis",
        "url": "https://developers.google.com/machine-learning/crash-course"
    },

    {
        "resource_id": "R002",
        "resource_name": "TensorFlow Tutorials",
        "provider": "TensorFlow",
        "resource_type": "tutorial",
        "level": "intermediate",
        "skills": "tensorflow,deep learning,machine learning",
        "url": "https://www.tensorflow.org/tutorials"
    },

    {
        "resource_id": "R003",
        "resource_name": "PyTorch Tutorials",
        "provider": "PyTorch",
        "resource_type": "tutorial",
        "level": "intermediate",
        "skills": "pytorch,deep learning,machine learning",
        "url": "https://pytorch.org/tutorials/"
    },

    {
        "resource_id": "R004",
        "resource_name": "scikit-learn User Guide",
        "provider": "scikit-learn",
        "resource_type": "documentation",
        "level": "intermediate",
        "skills": "scikit-learn,machine learning,data analysis",
        "url": "https://scikit-learn.org/stable/user_guide.html"
    },

    {
        "resource_id": "R005",
        "resource_name": "Natural Language Processing",
        "provider": "Hugging Face",
        "resource_type": "course",
        "level": "intermediate",
        "skills": "nlp,large language models,generative ai",
        "url": "https://huggingface.co/learn/nlp-course/"
    },

    {
        "resource_id": "R006",
        "resource_name": "Microsoft Learn - Azure AI",
        "provider": "Microsoft",
        "resource_type": "learning_path",
        "level": "beginner",
        "skills": "azure,artificial intelligence,generative ai",
        "url": "https://learn.microsoft.com/en-us/training/paths/get-started-with-artificial-intelligence-on-azure/"
    },

    {
        "resource_id": "R007",
        "resource_name": "Microsoft Learn - Azure Machine Learning",
        "provider": "Microsoft",
        "resource_type": "learning_path",
        "level": "intermediate",
        "skills": "azure,machine learning,data science",
        "url": "https://learn.microsoft.com/en-us/training/browse/?products=azure-machine-learning"
    },

    {
        "resource_id": "R008",
        "resource_name": "AWS Machine Learning Training",
        "provider": "AWS",
        "resource_type": "training",
        "level": "intermediate",
        "skills": "aws,machine learning,data science",
        "url": "https://aws.amazon.com/training/"
    },

    {
        "resource_id": "R009",
        "resource_name": "SQL Tutorial",
        "provider": "PostgreSQL",
        "resource_type": "documentation",
        "level": "beginner",
        "skills": "sql,database,data analysis",
        "url": "https://www.postgresql.org/docs/current/tutorial.html"
    },

    {
        "resource_id": "R010",
        "resource_name": "Apache Hadoop Documentation",
        "provider": "Apache",
        "resource_type": "documentation",
        "level": "intermediate",
        "skills": "hive,big data",
        "url": "https://hadoop.apache.org/docs/"
    },

    {
        "resource_id": "R011",
        "resource_name": "Keras Documentation",
        "provider": "Keras",
        "resource_type": "documentation",
        "level": "intermediate",
        "skills": "keras,deep learning,tensorflow",
        "url": "https://keras.io/"
    },

    {
        "resource_id": "R012",
        "resource_name": "Generative AI Learning Path",
        "provider": "Microsoft",
        "resource_type": "learning_path",
        "level": "intermediate",
        "skills": "generative ai,artificial intelligence,large language models",
        "url": "https://learn.microsoft.com/en-us/training/"
    }
]


# =========================================================
# SAVE RESOURCE DATASET
# =========================================================

def create_resource_dataset():

    df = pd.DataFrame(RESOURCES)

    df.to_csv(
        RESOURCE_FILE,
        index=False
    )

    print("\nResource dataset created")
    print("-" * 60)
    print(f"Resources: {len(df)}")
    print(f"Saved: {RESOURCE_FILE}")

    return df


# =========================================================
# LOAD SKILL GAPS
# =========================================================

def load_skill_gaps():

    gaps = pd.read_csv(
        GAP_FILE
    )

    gaps["skill"] = (
        gaps["skill"]
        .astype(str)
        .str.strip()
        .str.lower()
    )

    return gaps


# =========================================================
# NORMALIZE RESOURCE SKILLS
# =========================================================

def normalize_resource_skills(df):

    df = df.copy()

    df["skills"] = (
        df["skills"]
        .fillna("")
        .str.lower()
    )

    return df


# =========================================================
# RECOMMEND RESOURCES
# =========================================================

def recommend_resources(gaps, resources):

    recommendations = []

    for _, gap in gaps.iterrows():

        target_skill = gap["skill"]

        demand = float(
            gap["demand_percentage"]
        )

        importance = gap["importance"]

        confidence = float(
            gap["student_confidence"]
        )

        gap_score = float(
            gap["gap_score"]
        )

        for _, resource in resources.iterrows():

            resource_skills = [
                x.strip()
                for x in resource["skills"].split(",")
            ]

            if target_skill not in resource_skills:
                continue

            # ------------------------------------------------
            # RESOURCE SCORE
            # ------------------------------------------------

            score = gap_score

            # Boost important skills
            if importance == "important":
                score *= 1.25

            elif importance == "core":
                score *= 1.50

            # Slightly prefer beginner/intermediate material
            # when the student has weak evidence.
            if confidence < 0.30:

                if resource["level"] == "beginner":
                    score *= 1.15

            # Prefer intermediate resources for partial skills
            elif confidence < 0.60:

                if resource["level"] == "intermediate":
                    score *= 1.15

            recommendations.append({

                "skill": target_skill,

                "demand_percentage": demand,

                "importance": importance,

                "student_confidence": confidence,

                "gap_score": gap_score,

                "resource_id":
                    resource["resource_id"],

                "resource_name":
                    resource["resource_name"],

                "provider":
                    resource["provider"],

                "resource_type":
                    resource["resource_type"],

                "level":
                    resource["level"],

                "resource_url":
                    resource["url"],

                "recommendation_score":
                    round(score, 2)
            })

    result = pd.DataFrame(
        recommendations
    )

    if len(result) == 0:

        print(
            "\nNo matching resources found."
        )

        return result

    result = result.sort_values(
        [
            "skill",
            "recommendation_score"
        ],
        ascending=[
            True,
            False
        ]
    )

    return result


# =========================================================
# TOP RECOMMENDATIONS
# =========================================================

def create_top_recommendations(result):

    if result.empty:
        return result

    top = (
        result
        .groupby("skill", group_keys=False)
        .head(3)
        .copy()
    )

    top = top.sort_values(
        "recommendation_score",
        ascending=False
    )

    return top


# =========================================================
# MAIN
# =========================================================

def main():

    print("\nCAREERX RESOURCE RECOMMENDATION ENGINE")
    print("=" * 60)

    # Create catalog
    resources = create_resource_dataset()

    resources = normalize_resource_skills(
        resources
    )

    # Load actual student gaps
    gaps = load_skill_gaps()

    print(
        f"\nPriority gaps loaded: {len(gaps)}"
    )

    # Recommendation engine
    recommendations = recommend_resources(
        gaps,
        resources
    )

    if recommendations.empty:
        return

    recommendations.to_csv(
        OUTPUT_FILE,
        index=False
    )

    top = create_top_recommendations(
        recommendations
    )

    print("\nTOP RECOMMENDATIONS")
    print("-" * 60)

    print(
        top[
            [
                "skill",
                "importance",
                "student_confidence",
                "resource_name",
                "provider",
                "level",
                "recommendation_score"
            ]
        ]
        .head(20)
        .to_string(index=False)
    )

    print("\nSaved:")
    print(OUTPUT_FILE)


if __name__ == "__main__":
    main()