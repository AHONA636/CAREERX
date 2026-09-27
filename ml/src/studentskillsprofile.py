import pandas as pd
from pathlib import Path
import math


# =========================================================
# PATHS
# =========================================================

BASE_DIR = Path(__file__).resolve().parents[1]

PROCESSED_DIR = BASE_DIR / "data" / "processed"

JOB_SKILLS_FILE = PROCESSED_DIR / "job_skill_taxonomy_v2.csv"
STUDENT_PROFILE_FILE = PROCESSED_DIR / "student_skill_profile.csv"

OUTPUT_FILE = PROCESSED_DIR / "skill_gap_student.csv"
PRIORITY_FILE = PROCESSED_DIR / "priority_skill_gaps_student.csv"


# =========================================================
# CONFIGURATION
# =========================================================

TARGET_ROLE = "Data Scientist"

# Minimum percentage of matching jobs that must require a skill
MIN_DEMAND_PERCENTAGE = 5

# Confidence thresholds
STRONG_THRESHOLD = 0.60
PARTIAL_THRESHOLD = 0.30


# =========================================================
# LOAD DATA
# =========================================================

def load_data():

    print("\nLoading job skill data...")

    jobs = pd.read_csv(
        JOB_SKILLS_FILE,
        low_memory=False
    )

    print(f"Job-skill records: {len(jobs):,}")

    print("\nLoading student skill profile...")

    student = pd.read_csv(
        STUDENT_PROFILE_FILE
    )

    print(f"Student skill records: {len(student):,}")

    return jobs, student


# =========================================================
# NORMALIZE
# =========================================================

def normalize_skill(skill):

    if pd.isna(skill):
        return ""

    return str(skill).strip().lower()


# =========================================================
# GET ROLE JOBS
# =========================================================

def get_role_jobs(jobs):

    jobs["skill"] = jobs["skill"].apply(normalize_skill)

    # Try common title columns
    title_column = None

    for column in [
        "job_title",
        "title",
        "jobtitle",
        "job_title_clean"
    ]:
        if column in jobs.columns:
            title_column = column
            break

    if title_column is None:
        raise ValueError(
            "Could not find a job title column in job_skill_taxonomy_v2.csv"
        )

    jobs[title_column] = (
        jobs[title_column]
        .fillna("")
        .astype(str)
        .str.lower()
    )

    role_keyword = TARGET_ROLE.lower()

    role_jobs = jobs[
        jobs[title_column].str.contains(
            role_keyword,
            na=False
        )
    ].copy()

    print(f"\nTarget role: {TARGET_ROLE}")
    print(f"Matching jobs: {role_jobs[title_column].nunique():,}")

    return role_jobs


# =========================================================
# CALCULATE ROLE SKILL DEMAND
# =========================================================

def calculate_skill_demand(role_jobs):

    # Find job identifier
    job_id_column = None

    for column in [
        "job_id",
        "id",
        "jobid"
    ]:
        if column in role_jobs.columns:
            job_id_column = column
            break

    if job_id_column is None:
        raise ValueError(
            "Could not find job ID column in job_skill_taxonomy_v2.csv"
        )

    total_jobs = role_jobs[job_id_column].nunique()

    demand = (
        role_jobs
        .groupby("skill")[job_id_column]
        .nunique()
        .reset_index(name="jobs_requiring_skill")
    )

    demand["demand_percentage"] = (
        demand["jobs_requiring_skill"]
        / total_jobs
        * 100
    )

    demand = demand[
        demand["demand_percentage"]
        >= MIN_DEMAND_PERCENTAGE
    ].copy()

    # Importance tiers
    def importance(x):

        if x >= 50:
            return "core"

        elif x >= 20:
            return "important"

        else:
            return "supporting"

    demand["importance"] = (
        demand["demand_percentage"]
        .apply(importance)
    )

    # Priority weight
    weights = {
        "core": 3,
        "important": 2,
        "supporting": 1
    }

    demand["priority_score"] = (
        demand["demand_percentage"]
        * demand["importance"].map(weights)
    )

    demand = demand.sort_values(
        "priority_score",
        ascending=False
    )

    return demand


# =========================================================
# BUILD STUDENT SKILL MAP
# =========================================================

def build_student_skill_map(student):

    student["skill"] = (
        student["skill"]
        .apply(normalize_skill)
    )

    student_map = {}

    for _, row in student.iterrows():

        student_map[row["skill"]] = {
            "confidence": float(row["confidence"]),
            "evidence_count": int(row["evidence_count"]),
            "best_score": float(row["best_score"])
        }

    return student_map


# =========================================================
# DETERMINE STUDENT STATUS
# =========================================================

def determine_status(confidence):

    if confidence >= STRONG_THRESHOLD:
        return "strong"

    elif confidence >= PARTIAL_THRESHOLD:
        return "partial"

    else:
        return "weak"


# =========================================================
# SKILL GAP
# =========================================================

def calculate_skill_gap(demand, student_map):

    results = []

    for _, row in demand.iterrows():

        skill = row["skill"]

        demand_percentage = row["demand_percentage"]

        priority_score = row["priority_score"]

        importance = row["importance"]

        student_data = student_map.get(skill)

        if student_data is None:

            confidence = 0.0
            status = "missing"

        else:

            confidence = student_data["confidence"]

            status = determine_status(
                confidence
            )

        # Gap severity
        if status == "strong":
            gap_status = "covered"

        elif status == "partial":
            gap_status = "partial_gap"

        else:
            gap_status = "gap"

        results.append({

            "skill": skill,

            "demand_percentage": round(
                demand_percentage,
                2
            ),

            "importance": importance,

            "priority_score": round(
                priority_score,
                2
            ),

            "student_confidence": round(
                confidence,
                4
            ),

            "student_status": status,

            "gap_status": gap_status
        })

    result = pd.DataFrame(results)

    return result


# =========================================================
# PRIORITY GAPS
# =========================================================

def calculate_priority_gaps(result):

    gaps = result[
        result["gap_status"] != "covered"
    ].copy()

    # Combine job demand and student's weakness
    gaps["gap_score"] = (
        gaps["priority_score"]
        * (1 - gaps["student_confidence"])
    )

    gaps = gaps.sort_values(
        "gap_score",
        ascending=False
    )

    gaps["gap_score"] = gaps["gap_score"].round(2)

    return gaps


# =========================================================
# SUMMARY
# =========================================================

def print_summary(result, priority_gaps):

    total = len(result)

    covered = (
        result["gap_status"] == "covered"
    ).sum()

    partial = (
        result["gap_status"] == "partial_gap"
    ).sum()

    missing = (
        result["gap_status"] == "gap"
    ).sum()

    print("\n" + "=" * 60)
    print("STUDENT → DATA SCIENTIST SKILL GAP")
    print("=" * 60)

    print(f"Required skills analysed : {total}")
    print(f"Covered                  : {covered}")
    print(f"Partial                  : {partial}")
    print(f"Missing                  : {missing}")

    if total > 0:

        coverage = (
            covered / total * 100
        )

        print(
            f"Skill coverage           : {coverage:.2f}%"
        )

    print("\nTop Priority Gaps")
    print("-" * 60)

    columns = [
        "skill",
        "demand_percentage",
        "importance",
        "student_confidence",
        "gap_score"
    ]

    print(
        priority_gaps[columns]
        .head(20)
        .to_string(index=False)
    )


# =========================================================
# MAIN
# =========================================================

def main():

    jobs, student = load_data()

    role_jobs = get_role_jobs(jobs)

    demand = calculate_skill_demand(
        role_jobs
    )

    student_map = build_student_skill_map(
        student
    )

    result = calculate_skill_gap(
        demand,
        student_map
    )

    priority_gaps = calculate_priority_gaps(
        result
    )

    # Save complete comparison
    result.to_csv(
        OUTPUT_FILE,
        index=False
    )

    # Save prioritized gaps
    priority_gaps.to_csv(
        PRIORITY_FILE,
        index=False
    )

    print_summary(
        result,
        priority_gaps
    )

    print("\nSaved:")
    print(OUTPUT_FILE)

    print(PRIORITY_FILE)


if __name__ == "__main__":
    main()