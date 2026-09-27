from pathlib import Path
import pandas as pd


# ============================================================
# PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent

JOB_SKILLS_FILE = (
    BASE_DIR
    / "data"
    / "processed"
    / "job_skill_taxonomy_v2.csv"
)

OUTPUT_DIR = BASE_DIR / "data" / "processed"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


# ============================================================
# TARGET ROLE
# ============================================================

TARGET_ROLE = "Data Scientist"


# ============================================================
# TEMPORARY VERIFIED STUDENT SKILLS
# Replace later with CareerX Student Skill Profile
# ============================================================

STUDENT_SKILLS = {
    "python",
    "sql",
    "git",
    "machine learning",
    "pandas",
    "numpy",
}


# ============================================================
# ADDITIONAL SKILL NORMALIZATION
# ============================================================

SKILL_ALIASES = {

    "sklearn": "scikit-learn",
    "scikit learn": "scikit-learn",

    "np": "numpy",
    "pd": "pandas",

    "tensorflow": "tensorflow",
    "pytorch": "pytorch",

    "ml": "machine learning",

    "ai": "artificial intelligence",

    "nlp": "nlp",

    "aws cloud": "aws",
    "azure cloud": "azure",
    "google cloud": "gcp",

    "k8s": "kubernetes",

    "postgres": "postgresql",

    "mongo db": "mongodb",

    "restful api": "rest api",

    "data analytics": "data analytics",
    "data analysis": "data analysis",

    "computer-vision": "computer vision",
}


# ============================================================
# ADDITIONAL TAXONOMY
# ============================================================

ADDITIONAL_TAXONOMY = {

    # Data / Python ecosystem
    "pandas": "data_library",
    "numpy": "data_library",
    "scipy": "data_library",
    "matplotlib": "data_visualization",
    "seaborn": "data_visualization",

    # Algorithms
    "algorithms": "computer_science",
    "data structures": "computer_science",
    "data structures and algorithms": "computer_science",

    # Big data
    "hive": "big_data",
    "hadoop": "big_data",
    "spark": "big_data",
    "apache spark": "big_data",
    "pyspark": "big_data",
    "kafka": "big_data",

    # Operating systems
    "linux": "operating_system",
    "unix": "operating_system",
    "windows": "operating_system",

    # Software engineering
    "software testing": "software_testing",
    "automation testing": "software_testing",
    "unit testing": "software_testing",
    "testing": "software_testing",

    "debugging": "software_engineering",
    "application development": "software_engineering",
    "software development": "software_engineering",
    "web services": "software_engineering",

    "rest": "software_engineering",
    "rest api": "software_engineering",

    "hibernate": "software_framework",

    "automation": "automation",

    # Networking
    "networking": "networking",
    "computer networking": "networking",
    "tcp/ip": "networking",
    "network administration": "networking",

    # Business
    "marketing": "business",
    "lead generation": "business",
    "recruitment": "business",
    "customer support": "business",
    "bpo": "business",
    "consulting": "business",
    "b2b sales": "business",
    "channel sales": "business",
    "field sales": "business",
    "procurement": "business",
    "telesales": "business",
    "relationship management": "business",
    "risk management": "business",
    "compliance": "business",

    # Languages
    "english": "language",
    "hindi": "language",
    "bengali": "language",

    # Soft skills
    "troubleshooting": "problem_solving",
    "team management": "leadership",
    "interpersonal skills": "soft_skill",
    "presentation skills": "soft_skill",
    "analytical": "analytical_skill",

    # Engineering tools
    "autocad": "engineering_tool",

    # DevOps
    "devops": "devops",
    "ci": "devops",
}


# ============================================================
# GENERIC TERMS TO EXCLUDE FROM SKILL GAP
# ============================================================

EXCLUDE_FROM_GAP = {

    "data",
    "machine",
    "analytical",
    "production",
    "relationship",
    "cd",
    "ci",
    "coding",
    "computer science",
    "development",
    "management",
}


# ============================================================
# NORMALIZATION
# ============================================================

def normalize_skill(skill):

    if pd.isna(skill):
        return ""

    skill = str(skill).strip().lower()

    if skill in SKILL_ALIASES:
        return SKILL_ALIASES[skill]

    return skill


# ============================================================
# LOAD DATA
# ============================================================

def load_data():

    if not JOB_SKILLS_FILE.exists():

        raise FileNotFoundError(
            f"File not found:\n{JOB_SKILLS_FILE}"
        )

    df = pd.read_csv(
        JOB_SKILLS_FILE,
        low_memory=False
    )

    required = {
        "job_id",
        "job_title",
        "skill",
        "category",
    }

    missing = required - set(df.columns)

    if missing:

        raise ValueError(
            f"Missing columns: {missing}"
        )

    df["skill"] = (
        df["skill"]
        .apply(normalize_skill)
    )

    df["job_title"] = (
        df["job_title"]
        .fillna("")
        .astype(str)
    )

    # Apply improved taxonomy
    df["category"] = df.apply(
        lambda row: ADDITIONAL_TAXONOMY.get(
            row["skill"],
            row["category"]
        ),
        axis=1
    )

    return df


# ============================================================
# FIND ROLE JOBS
# ============================================================

def find_role_jobs(df, role):

    role = role.lower().strip()

    matches = df[
        df["job_title"]
        .str.lower()
        .str.contains(
            role,
            regex=False,
            na=False
        )
    ].copy()

    return matches


# ============================================================
# CALCULATE DEMAND
# ============================================================

def calculate_demand(role_jobs):

    total_jobs = role_jobs["job_id"].nunique()

    demand = (
        role_jobs[
            ~role_jobs["skill"].isin(
                EXCLUDE_FROM_GAP
            )
        ]
        .groupby(
            ["skill", "category"]
        )["job_id"]
        .nunique()
        .reset_index(
            name="job_count"
        )
    )

    demand["demand_percentage"] = (
        demand["job_count"]
        / total_jobs
        * 100
    )

    return demand.sort_values(
        "demand_percentage",
        ascending=False
    )


# ============================================================
# CLASSIFY IMPORTANCE
# ============================================================

def classify_importance(demand_percentage):

    if demand_percentage >= 50:

        return "core"

    elif demand_percentage >= 20:

        return "important"

    else:

        return "specialized"


# ============================================================
# BUILD SKILL GAP
# ============================================================

def build_skill_gap(
    demand,
    student_skills
):

    student_skills = {
        normalize_skill(skill)
        for skill in student_skills
    }

    results = []

    for _, row in demand.iterrows():

        skill = row["skill"]

        if skill in student_skills:

            status = "matched"

        else:

            status = "missing"

        importance = classify_importance(
            row["demand_percentage"]
        )

        # ----------------------------------------------------
        # Priority score
        # ----------------------------------------------------
        #
        # Demand is the main factor.
        #
        # Core > Important > Specialized
        #
        # This is NOT a prediction.
        # It is a transparent ranking based
        # directly on observed job demand.
        # ----------------------------------------------------

        importance_weight = {

            "core": 3.0,
            "important": 2.0,
            "specialized": 1.0

        }[importance]

        priority_score = (
            row["demand_percentage"]
            * importance_weight
        )

        results.append({

            "skill": skill,

            "category": row["category"],

            "job_count": int(
                row["job_count"]
            ),

            "demand_percentage": round(
                row["demand_percentage"],
                2
            ),

            "importance": importance,

            "status": status,

            "priority_score": round(
                priority_score,
                2
            )

        })

    return pd.DataFrame(results)


# ============================================================
# MAIN
# ============================================================

def main():

    print("=" * 70)
    print("CAREERX SKILL GAP ENGINE V2")
    print("=" * 70)

    # --------------------------------------------------------
    # LOAD
    # --------------------------------------------------------

    df = load_data()

    print(
        "\nTotal job-skill records:",
        len(df)
    )

    print(
        "Total unique jobs:",
        df["job_id"].nunique()
    )

    # --------------------------------------------------------
    # TARGET ROLE
    # --------------------------------------------------------

    role_jobs = find_role_jobs(
        df,
        TARGET_ROLE
    )

    total_role_jobs = (
        role_jobs["job_id"].nunique()
    )

    print(
        "\nTarget role:",
        TARGET_ROLE
    )

    print(
        "Matching jobs:",
        total_role_jobs
    )

    if role_jobs.empty:

        print(
            "\nNo jobs found."
        )

        return

    # --------------------------------------------------------
    # DEMAND
    # --------------------------------------------------------

    demand = calculate_demand(
        role_jobs
    )

    # --------------------------------------------------------
    # SKILL GAP
    # --------------------------------------------------------

    gap = build_skill_gap(
        demand,
        STUDENT_SKILLS
    )

    # --------------------------------------------------------
    # METRICS
    # --------------------------------------------------------

    total_skills = len(gap)

    matched = (
        gap["status"] == "matched"
    ).sum()

    missing = (
        gap["status"] == "missing"
    ).sum()

    coverage = (
        matched
        / total_skills
        * 100
    )

    gap_percentage = (
        missing
        / total_skills
        * 100
    )

    # --------------------------------------------------------
    # PRIORITY GAPS
    # --------------------------------------------------------

    priority_gaps = (
        gap[
            gap["status"] == "missing"
        ]
        .sort_values(
            "priority_score",
            ascending=False
        )
    )

    # ========================================================
    # REPORT
    # ========================================================

    print("\n" + "=" * 70)
    print("SKILL GAP RESULTS")
    print("=" * 70)

    print(
        f"\nRequired skills : {total_skills}"
    )

    print(
        f"Matched skills  : {matched}"
    )

    print(
        f"Missing skills  : {missing}"
    )

    print(
        f"Skill coverage  : {coverage:.2f}%"
    )

    print(
        f"Skill gap       : {gap_percentage:.2f}%"
    )

    # --------------------------------------------------------
    # IMPORTANCE DISTRIBUTION
    # --------------------------------------------------------

    print("\nSkill importance:")

    print(
        gap["importance"]
        .value_counts()
        .to_string()
    )

    # --------------------------------------------------------
    # MATCHED
    # --------------------------------------------------------

    print("\nMatched skills:")

    matched_df = gap[
        gap["status"] == "matched"
    ].sort_values(
        "demand_percentage",
        ascending=False
    )

    if matched_df.empty:

        print("None")

    else:

        print(
            matched_df[
                [
                    "skill",
                    "category",
                    "demand_percentage",
                    "importance"
                ]
            ]
            .to_string(index=False)
        )

    # --------------------------------------------------------
    # PRIORITY MISSING
    # --------------------------------------------------------

    print("\nTop priority missing skills:")

    if priority_gaps.empty:

        print("None")

    else:

        print(
            priority_gaps[
                [
                    "skill",
                    "category",
                    "job_count",
                    "demand_percentage",
                    "importance",
                    "priority_score"
                ]
            ]
            .head(25)
            .to_string(index=False)
        )

    # ========================================================
    # SAVE OUTPUTS
    # ========================================================

    gap_output = (
        OUTPUT_DIR
        / "skill_gap_v2.csv"
    )

    priority_output = (
        OUTPUT_DIR
        / "priority_skill_gaps_v2.csv"
    )

    demand_output = (
        OUTPUT_DIR
        / "role_skill_demand_v2.csv"
    )

    gap.to_csv(
        gap_output,
        index=False
    )

    priority_gaps.to_csv(
        priority_output,
        index=False
    )

    demand.to_csv(
        demand_output,
        index=False
    )

    # ========================================================
    # DONE
    # ========================================================

    print("\n" + "=" * 70)
    print("OUTPUT FILES")
    print("=" * 70)

    print(gap_output)
    print(priority_output)
    print(demand_output)


if __name__ == "__main__":
    main()