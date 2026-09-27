from pathlib import Path
import pandas as pd
import ast


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
# STUDENT SKILLS
# ============================================================
# IMPORTANT:
# These are VERIFIED / USER-PROVIDED skills.
#
# Replace this example later with:
# - assessment results
# - coding test results
# - project verification
# - certificates
# - GitHub/project evidence
# ============================================================

STUDENT_SKILLS = {
    "python",
    "sql",
    "git",
    "machine learning",
    "pandas",
    "numpy"
}


# ============================================================
# TARGET ROLE
# ============================================================

TARGET_ROLE = "Data Scientist"


# ============================================================
# HELPERS
# ============================================================

def normalize_skill(skill):

    if pd.isna(skill):
        return ""

    return str(skill).strip().lower()


def parse_skill_list(value):

    if pd.isna(value):
        return []

    try:

        parsed = ast.literal_eval(str(value))

        if isinstance(parsed, list):
            return [
                normalize_skill(x)
                for x in parsed
                if normalize_skill(x)
            ]

    except Exception:
        pass

    return []


# ============================================================
# LOAD JOB-SKILL DATA
# ============================================================

def load_job_skills():

    if not JOB_SKILLS_FILE.exists():

        raise FileNotFoundError(
            f"Job skill file not found:\n{JOB_SKILLS_FILE}"
        )

    df = pd.read_csv(
        JOB_SKILLS_FILE,
        low_memory=False
    )

    required_columns = {
        "job_id",
        "job_title",
        "skill",
        "category"
    }

    missing = required_columns - set(df.columns)

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
        .str.strip()
    )

    return df


# ============================================================
# FIND TARGET ROLE
# ============================================================

def get_target_jobs(df, target_role):

    target_role = target_role.lower().strip()

    matches = df[
        df["job_title"]
        .str.lower()
        .str.contains(
            target_role,
            regex=False,
            na=False
        )
    ].copy()

    return matches


# ============================================================
# CALCULATE ROLE REQUIREMENTS
# ============================================================

def calculate_required_skills(
    role_jobs,
    minimum_demand=5
):

    if role_jobs.empty:

        return pd.DataFrame(
            columns=[
                "skill",
                "category",
                "job_count",
                "demand_percentage"
            ]
        )

    total_jobs = role_jobs["job_id"].nunique()

    requirements = (
        role_jobs
        .groupby(
            ["skill", "category"]
        )
        ["job_id"]
        .nunique()
        .reset_index(
            name="job_count"
        )
    )

    requirements["demand_percentage"] = (
        requirements["job_count"]
        / total_jobs
        * 100
    )

    # Ignore extremely rare skills
    requirements = requirements[
        requirements["job_count"] >= minimum_demand
    ]

    requirements = requirements.sort_values(
        [
            "demand_percentage",
            "job_count"
        ],
        ascending=False
    )

    return requirements


# ============================================================
# SKILL GAP CALCULATION
# ============================================================

def calculate_skill_gap(
    requirements,
    student_skills
):

    student_skills = {
        normalize_skill(skill)
        for skill in student_skills
    }

    results = []

    for _, row in requirements.iterrows():

        skill = row["skill"]

        if skill in student_skills:

            status = "matched"

        else:

            status = "missing"

        results.append({

            "skill": skill,

            "category": row["category"],

            "job_count": row["job_count"],

            "demand_percentage": round(
                row["demand_percentage"],
                2
            ),

            "status": status

        })

    return pd.DataFrame(results)


# ============================================================
# PRIORITIZE GAPS
# ============================================================

def prioritize_gaps(gap_df):

    missing = gap_df[
        gap_df["status"] == "missing"
    ].copy()

    if missing.empty:

        return missing

    # Higher job demand = higher priority
    missing["priority_score"] = (
        missing["demand_percentage"]
    )

    missing = missing.sort_values(
        "priority_score",
        ascending=False
    )

    return missing


# ============================================================
# MAIN
# ============================================================

def main():

    print("=" * 70)
    print("CAREERX SKILL GAP ENGINE")
    print("=" * 70)

    # --------------------------------------------------------
    # LOAD
    # --------------------------------------------------------

    jobs = load_job_skills()

    print(
        "\nTotal job-skill records:",
        len(jobs)
    )

    print(
        "Total unique jobs:",
        jobs["job_id"].nunique()
    )

    # --------------------------------------------------------
    # FIND TARGET ROLE
    # --------------------------------------------------------

    role_jobs = get_target_jobs(
        jobs,
        TARGET_ROLE
    )

    print(
        "\nTarget role:",
        TARGET_ROLE
    )

    print(
        "Matching jobs:",
        role_jobs["job_id"].nunique()
    )

    if role_jobs.empty:

        print(
            "\nNo jobs found for this role."
        )

        return

    # --------------------------------------------------------
    # ROLE REQUIREMENTS
    # --------------------------------------------------------

    requirements = calculate_required_skills(
        role_jobs
    )

    print(
        "Required skills considered:",
        len(requirements)
    )

    # --------------------------------------------------------
    # STUDENT SKILLS
    # --------------------------------------------------------

    student_skills = {
        normalize_skill(skill)
        for skill in STUDENT_SKILLS
    }

    print(
        "\nStudent skills:"
    )

    for skill in sorted(student_skills):

        print(
            "✓",
            skill
        )

    # --------------------------------------------------------
    # SKILL GAP
    # --------------------------------------------------------

    gap = calculate_skill_gap(
        requirements,
        student_skills
    )

    # --------------------------------------------------------
    # COVERAGE
    # --------------------------------------------------------

    total_required = len(gap)

    matched = (
        gap["status"] == "matched"
    ).sum()

    missing = (
        gap["status"] == "missing"
    ).sum()

    if total_required > 0:

        coverage = (
            matched
            / total_required
            * 100
        )

        gap_percentage = (
            missing
            / total_required
            * 100
        )

    else:

        coverage = 0
        gap_percentage = 0

    # --------------------------------------------------------
    # PRIORITY GAPS
    # --------------------------------------------------------

    priority_gaps = prioritize_gaps(
        gap
    )

    # --------------------------------------------------------
    # PRINT RESULTS
    # --------------------------------------------------------

    print("\n" + "=" * 70)
    print("SKILL GAP RESULTS")
    print("=" * 70)

    print(
        f"\nRequired skills : {total_required}"
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
    # MATCHED
    # --------------------------------------------------------

    print("\nMatched skills:")

    matched_df = gap[
        gap["status"] == "matched"
    ]

    if matched_df.empty:

        print("None")

    else:

        print(
            matched_df[
                [
                    "skill",
                    "category",
                    "demand_percentage"
                ]
            ]
            .to_string(index=False)
        )

    # --------------------------------------------------------
    # MISSING
    # --------------------------------------------------------

    print("\nPriority missing skills:")

    if priority_gaps.empty:

        print("None")

    else:

        print(
            priority_gaps[
                [
                    "skill",
                    "category",
                    "job_count",
                    "demand_percentage"
                ]
            ]
            .head(20)
            .to_string(index=False)
        )

    # ========================================================
    # SAVE OUTPUT
    # ========================================================

    gap_output = (
        OUTPUT_DIR
        / "skill_gap_results.csv"
    )

    priority_output = (
        OUTPUT_DIR
        / "priority_skill_gaps.csv"
    )

    gap.to_csv(
        gap_output,
        index=False
    )

    priority_gaps.to_csv(
        priority_output,
        index=False
    )

    print("\n" + "=" * 70)
    print("OUTPUT FILES")
    print("=" * 70)

    print(gap_output)
    print(priority_output)


if __name__ == "__main__":
    main()