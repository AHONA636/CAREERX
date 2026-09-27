from pathlib import Path
import pandas as pd
import re
import ast

# ============================================================
# PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent

DATASETS = [
    BASE_DIR / "data" / "raw" / "archive (3)" / "indian-job-market-dataset-2025.xlsx",
    BASE_DIR / "data" / "raw" / "archive (4)" / "all_job_post.csv",
]

OUTPUT_DIR = BASE_DIR / "data" / "processed"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


# ============================================================
# SKILL NORMALIZATION DICTIONARY
# ============================================================

SKILL_ALIASES = {
    # Programming
    "python programming": "python",
    "python3": "python",
    "python 3": "python",

    "java programming": "java",
    "javascript": "javascript",
    "js": "javascript",

    "typescript": "typescript",
    "ts": "typescript",

    "c++": "c++",
    "cpp": "c++",

    "c#": "c#",
    "c sharp": "c#",

    # Web
    "react.js": "react",
    "reactjs": "react",
    "react js": "react",

    "node.js": "node.js",
    "nodejs": "node.js",
    "node js": "node.js",

    "next.js": "next.js",
    "nextjs": "next.js",

    "angular.js": "angular",
    "angularjs": "angular",

    "html5": "html",
    "css3": "css",

    # Data / ML
    "machine learning": "machine learning",
    "ml": "machine learning",

    "deep learning": "deep learning",
    "dl": "deep learning",

    "artificial intelligence": "artificial intelligence",
    "ai": "artificial intelligence",

    "natural language processing": "nlp",
    "natural language understanding": "nlp",

    "computer vision": "computer vision",
    "cv": "computer vision",

    "generative ai": "generative ai",
    "gen ai": "generative ai",

    # Libraries
    "scikit-learn": "scikit-learn",
    "sklearn": "scikit-learn",

    "pytorch": "pytorch",
    "torch": "pytorch",

    "tensorflow": "tensorflow",
    "tf": "tensorflow",

    # Databases
    "postgres": "postgresql",
    "postgresql": "postgresql",

    "mysql": "mysql",
    "mongodb": "mongodb",
    "mongo db": "mongodb",

    "sql server": "sql server",
    "microsoft sql server": "sql server",

    # Cloud
    "amazon web services": "aws",
    "aws": "aws",

    "google cloud platform": "gcp",
    "gcp": "gcp",

    "microsoft azure": "azure",
    "azure cloud": "azure",

    # DevOps
    "docker": "docker",
    "kubernetes": "kubernetes",
    "k8s": "kubernetes",

    "continuous integration": "ci/cd",
    "continuous deployment": "ci/cd",
    "ci/cd": "ci/cd",

    "git": "git",
    "github": "github",
}


# ============================================================
# SKILL VOCABULARY
# Used for extracting skills from job descriptions
# ============================================================

SKILLS = sorted(
    set(SKILL_ALIASES.values()),
    key=len,
    reverse=True
)


# ============================================================
# TEXT CLEANING
# ============================================================

def clean_text(value):
    """Clean text while preserving useful technical tokens."""

    if pd.isna(value):
        return ""

    value = str(value)

    # Remove HTML
    value = re.sub(r"<[^>]+>", " ", value)

    # Normalize whitespace
    value = re.sub(r"\s+", " ", value)

    # Normalize quotes
    value = value.replace("“", '"').replace("”", '"')
    value = value.replace("’", "'")

    return value.strip()


# ============================================================
# COLUMN NORMALIZATION
# ============================================================

def normalize_column_name(column):
    column = str(column).strip().lower()

    column = re.sub(r"[^a-z0-9]+", "_", column)

    column = re.sub(r"_+", "_", column)

    return column.strip("_")


# ============================================================
# FIND RELEVANT COLUMNS
# ============================================================

def find_column(columns, keywords):

    for column in columns:

        column_lower = column.lower()

        for keyword in keywords:

            if keyword in column_lower:
                return column

    return None


# ============================================================
# PARSE EXISTING SKILL FIELD
# ============================================================

def parse_skill_field(value):

    if pd.isna(value):
        return []

    value = str(value).strip()

    if not value:
        return []

    # Try Python-list format:
    # ['Python', 'SQL', 'AWS']
    if value.startswith("[") and value.endswith("]"):

        try:
            parsed = ast.literal_eval(value)

            if isinstance(parsed, list):
                return [str(x) for x in parsed]

        except Exception:
            pass

    # Common separators
    parts = re.split(r"[,;|/]", value)

    return [
        x.strip()
        for x in parts
        if x.strip()
    ]


# ============================================================
# NORMALIZE SKILL
# ============================================================

def normalize_skill(skill):

    skill = clean_text(skill).lower()

    skill = re.sub(r"\s+", " ", skill)

    skill = skill.strip(" .,;:()[]{}")

    if skill in SKILL_ALIASES:
        return SKILL_ALIASES[skill]

    return skill


# ============================================================
# EXTRACT SKILLS FROM TEXT
# ============================================================

def extract_skills_from_text(text):

    text = clean_text(text).lower()

    found = set()

    for skill in SKILLS:

        # Escape special regex characters
        pattern = re.escape(skill)

        # Word boundary matching
        if re.search(r"(?<!\w)" + pattern + r"(?!\w)", text):

            found.add(skill)

    return sorted(found)


# ============================================================
# PROCESS ONE DATASET
# ============================================================

def process_dataset(file):

    print("\n" + "=" * 70)
    print("PROCESSING:", file.name)
    print("=" * 70)

    # --------------------------------------------------------
    # LOAD
    # --------------------------------------------------------

    if file.suffix.lower() == ".xlsx":

        df = pd.read_excel(file)

    elif file.suffix.lower() == ".csv":

        df = pd.read_csv(file)

    else:

        raise ValueError(f"Unsupported file: {file}")

    print("Original shape:", df.shape)

    # --------------------------------------------------------
    # NORMALIZE COLUMN NAMES
    # --------------------------------------------------------

    df.columns = [
        normalize_column_name(col)
        for col in df.columns
    ]

    # --------------------------------------------------------
    # REMOVE COMPLETELY EMPTY ROWS/COLUMNS
    # --------------------------------------------------------

    df = df.dropna(axis=0, how="all")
    df = df.dropna(axis=1, how="all")

    # --------------------------------------------------------
    # REMOVE DUPLICATES
    # --------------------------------------------------------

    before = len(df)

    df = df.drop_duplicates()

    print("Duplicate rows removed:", before - len(df))

    # --------------------------------------------------------
    # IDENTIFY IMPORTANT COLUMNS
    # --------------------------------------------------------

    title_col = find_column(
        df.columns,
        [
            "job_title",
            "title",
            "jobtitle",
            "position",
            "role"
        ]
    )

    description_col = find_column(
        df.columns,
        [
            "job_description",
            "description",
            "job_desc",
            "details",
            "responsibilities"
        ]
    )

    skills_col = find_column(
        df.columns,
        [
            "skills",
            "skill",
            "required_skills",
            "technical_skills",
            "skills_required"
        ]
    )

    location_col = find_column(
        df.columns,
        [
            "location",
            "city",
            "job_location"
        ]
    )

    print("\nDetected columns:")

    print("Job title:", title_col)
    print("Description:", description_col)
    print("Skills:", skills_col)
    print("Location:", location_col)

    # --------------------------------------------------------
    # CREATE STANDARD COLUMNS
    # --------------------------------------------------------

    df["source_dataset"] = file.stem

    if title_col:
        df["job_title_clean"] = df[title_col].apply(clean_text)
    else:
        df["job_title_clean"] = ""

    if description_col:
        df["job_description_clean"] = (
            df[description_col]
            .apply(clean_text)
        )
    else:
        df["job_description_clean"] = ""

    if location_col:
        df["location_clean"] = (
            df[location_col]
            .apply(clean_text)
        )
    else:
        df["location_clean"] = ""

    # --------------------------------------------------------
    # EXTRACT SKILLS
    # --------------------------------------------------------

    extracted_skills = []

    for _, row in df.iterrows():

        skills = set()

        # Skills explicitly present in dataset
        if skills_col:

            existing_skills = parse_skill_field(
                row[skills_col]
            )

            for skill in existing_skills:

                normalized = normalize_skill(skill)

                if normalized:
                    skills.add(normalized)

        # Skills found inside description
        description_skills = extract_skills_from_text(
            row["job_description_clean"]
        )

        skills.update(description_skills)

        extracted_skills.append(
            sorted(skills)
        )

    df["skills_normalized"] = extracted_skills

    # --------------------------------------------------------
    # SKILL COUNT
    # --------------------------------------------------------

    df["skill_count"] = df[
        "skills_normalized"
    ].apply(len)

    # --------------------------------------------------------
    # KEEP JOBS WITH ACTUAL INFORMATION
    # --------------------------------------------------------

    df = df[
        (
            df["job_title_clean"].str.len() > 0
        )
        |
        (
            df["job_description_clean"].str.len() > 0
        )
    ].copy()

    print("Final shape:", df.shape)

    print(
        "Jobs with at least one extracted skill:",
        (df["skill_count"] > 0).sum()
    )

    return df


# ============================================================
# MAIN
# ============================================================

def main():

    processed = []

    for file in DATASETS:

        if not file.exists():

            print("\nWARNING: File not found:")
            print(file)

            continue

        df = process_dataset(file)

        processed.append(df)

    if not processed:

        raise FileNotFoundError(
            "No job datasets were found."
        )

    # ========================================================
    # MERGE DATASETS
    # ========================================================

    jobs = pd.concat(
        processed,
        ignore_index=True,
        sort=False
    )

    # ========================================================
    # REMOVE CROSS-DATASET DUPLICATES
    # ========================================================

    before = len(jobs)

    jobs = jobs.drop_duplicates(
        subset=[
            "job_title_clean",
            "job_description_clean",
            "location_clean"
        ]
    )

    print("\n" + "=" * 70)
    print("FINAL JOB DATASET")
    print("=" * 70)

    print("Before cross-dataset deduplication:", before)
    print("After:", len(jobs))

    # ========================================================
    # SAVE MAIN DATASET
    # ========================================================

    output_jobs = (
        OUTPUT_DIR /
        "jobs_cleaned_skills.csv"
    )

    jobs.to_csv(
        output_jobs,
        index=False
    )

    # ========================================================
    # CREATE JOB → SKILL MAPPING
    # ========================================================

    skill_rows = []

    for index, row in jobs.iterrows():

        for skill in row["skills_normalized"]:

            skill_rows.append({
                "job_index": index,
                "job_title": row["job_title_clean"],
                "location": row["location_clean"],
                "skill": skill,
                "source_dataset": row["source_dataset"]
            })

    skill_mapping = pd.DataFrame(skill_rows)

    output_skills = (
        OUTPUT_DIR /
        "job_skill_mapping.csv"
    )

    skill_mapping.to_csv(
        output_skills,
        index=False
    )

    # ========================================================
    # SKILL DEMAND SUMMARY
    # ========================================================

    if not skill_mapping.empty:

        skill_demand = (
            skill_mapping["skill"]
            .value_counts()
            .reset_index()
        )

        skill_demand.columns = [
            "skill",
            "job_count"
        ]

        output_demand = (
            OUTPUT_DIR /
            "skill_demand.csv"
        )

        skill_demand.to_csv(
            output_demand,
            index=False
        )

        print("\nTop 20 skills:")

        print(
            skill_demand.head(20).to_string(
                index=False
            )
        )

    # ========================================================
    # FINAL OUTPUT
    # ========================================================

    print("\n" + "=" * 70)
    print("OUTPUT FILES")
    print("=" * 70)

    print(output_jobs)
    print(output_skills)

    if not skill_mapping.empty:
        print(output_demand)


if __name__ == "__main__":
    main()