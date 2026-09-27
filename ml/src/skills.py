from pathlib import Path
import pandas as pd
import re


# ============================================================
# PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent

INPUT_FILE = (
    BASE_DIR
    / "data"
    / "processed"
    / "jobs_cleaned_skills.csv"
)

OUTPUT_DIR = BASE_DIR / "data" / "processed"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


# ============================================================
# 1. SKILL ALIASES
# ============================================================

ALIASES = {

    # ---------------- PROGRAMMING ----------------

    "python programming": "python",
    "python3": "python",
    "python 3": "python",

    "java programming": "java",

    "javascript": "javascript",
    "js": "javascript",

    "typescript": "typescript",
    "ts": "typescript",

    "cpp": "c++",
    "c plus plus": "c++",

    "c sharp": "c#",

    "golang": "go",

    # ---------------- WEB ----------------

    "html5": "html",
    "html 5": "html",

    "css3": "css",
    "css 3": "css",

    "reactjs": "react",
    "react js": "react",
    "react.js": "react",

    "nodejs": "node.js",
    "node js": "node.js",
    "node.js": "node.js",

    "nextjs": "next.js",
    "next js": "next.js",

    "angularjs": "angular",
    "angular js": "angular",

    # ---------------- DATA / ML ----------------

    "machine learning": "machine learning",
    "machine-learning": "machine learning",
    "ml": "machine learning",

    "deep learning": "deep learning",
    "deep-learning": "deep learning",
    "dl": "deep learning",

    "artificial intelligence": "artificial intelligence",
    "artificial-intelligence": "artificial intelligence",
    "ai": "artificial intelligence",

    "natural language processing": "nlp",
    "natural-language processing": "nlp",

    "natural language understanding": "nlp",

    "computer vision": "computer vision",

    "generative ai": "generative ai",
    "gen ai": "generative ai",

    "large language models": "large language models",
    "large language model": "large language models",
    "llm": "large language models",
    "llms": "large language models",

    # ---------------- ML LIBRARIES ----------------

    "sklearn": "scikit-learn",
    "scikit learn": "scikit-learn",

    "tensorflow": "tensorflow",
    "tf": "tensorflow",

    "pytorch": "pytorch",
    "torch": "pytorch",

    "keras": "keras",

    "xgboost": "xgboost",
    "lightgbm": "lightgbm",
    "catboost": "catboost",

    # ---------------- DATA ----------------

    "data analysis": "data analysis",
    "data analytics": "data analytics",

    "data visualization": "data visualization",

    "statistics": "statistics",
    "statistical analysis": "statistics",

    "data science": "data science",

    "big data": "big data",

    # ---------------- DATABASE ----------------

    "sql": "sql",

    "mysql": "mysql",

    "postgres": "postgresql",
    "postgresql": "postgresql",

    "mongo db": "mongodb",
    "mongodb": "mongodb",

    "microsoft sql server": "sql server",
    "ms sql server": "sql server",

    "oracle database": "oracle",
    "oracle db": "oracle",

    "redis": "redis",

    # ---------------- CLOUD ----------------

    "amazon web services": "aws",
    "amazon aws": "aws",
    "aws cloud": "aws",

    "google cloud": "gcp",
    "google cloud platform": "gcp",

    "microsoft azure": "azure",
    "azure cloud": "azure",

    # ---------------- DEVOPS ----------------

    "docker": "docker",

    "k8s": "kubernetes",
    "kubernetes": "kubernetes",

    "jenkins": "jenkins",

    "continuous integration": "ci/cd",
    "continuous deployment": "ci/cd",
    "ci cd": "ci/cd",

    "terraform": "terraform",

    "ansible": "ansible",

    # ---------------- VERSION CONTROL ----------------

    "git": "git",
    "github": "github",
    "gitlab": "gitlab",
    "bitbucket": "bitbucket",

    # ---------------- CYBERSECURITY ----------------

    "cyber security": "cybersecurity",
    "cyber-security": "cybersecurity",

    "information security": "information security",

    "network security": "network security",

    "penetration testing": "penetration testing",

    "ethical hacking": "ethical hacking",

    # ---------------- SOFT SKILLS ----------------

    "communication skills": "communication",
    "communication skill": "communication",

    "team work": "teamwork",
    "team working": "teamwork",

    "problem solving": "problem solving",

    "critical thinking": "critical thinking",

    "leadership skills": "leadership",
    "leadership skill": "leadership",

    "time management": "time management",

    "project management": "project management",
}


# ============================================================
# 2. SKILL TAXONOMY
# ============================================================

TAXONOMY = {

    # Programming
    "python": "programming_language",
    "java": "programming_language",
    "javascript": "programming_language",
    "typescript": "programming_language",
    "c++": "programming_language",
    "c#": "programming_language",
    "go": "programming_language",

    # Web
    "html": "web",
    "css": "web",
    "react": "web_framework",
    "node.js": "web_framework",
    "next.js": "web_framework",
    "angular": "web_framework",

    # AI / ML
    "machine learning": "artificial_intelligence",
    "deep learning": "artificial_intelligence",
    "artificial intelligence": "artificial_intelligence",
    "nlp": "artificial_intelligence",
    "computer vision": "artificial_intelligence",
    "generative ai": "artificial_intelligence",
    "large language models": "artificial_intelligence",

    # ML frameworks
    "scikit-learn": "ml_framework",
    "tensorflow": "ml_framework",
    "pytorch": "ml_framework",
    "keras": "ml_framework",
    "xgboost": "ml_framework",
    "lightgbm": "ml_framework",
    "catboost": "ml_framework",

    # Data
    "data analysis": "data",
    "data analytics": "data",
    "data visualization": "data",
    "statistics": "data",
    "data science": "data",
    "big data": "data",

    # Databases
    "sql": "database",
    "mysql": "database",
    "postgresql": "database",
    "mongodb": "database",
    "sql server": "database",
    "oracle": "database",
    "redis": "database",

    # Cloud
    "aws": "cloud",
    "azure": "cloud",
    "gcp": "cloud",

    # DevOps
    "docker": "devops",
    "kubernetes": "devops",
    "jenkins": "devops",
    "ci/cd": "devops",
    "terraform": "devops",
    "ansible": "devops",

    # Version control
    "git": "version_control",
    "github": "version_control",
    "gitlab": "version_control",
    "bitbucket": "version_control",

    # Cybersecurity
    "cybersecurity": "cybersecurity",
    "information security": "cybersecurity",
    "network security": "cybersecurity",
    "penetration testing": "cybersecurity",
    "ethical hacking": "cybersecurity",

    # Soft skills
    "communication": "soft_skill",
    "teamwork": "soft_skill",
    "problem solving": "soft_skill",
    "critical thinking": "soft_skill",
    "leadership": "soft_skill",
    "time management": "soft_skill",
    "project management": "soft_skill",
}


# ============================================================
# 3. GENERIC / NOISY SKILLS
# ============================================================

NOISY_SKILLS = {
    "development",
    "management",
    "business",
    "skills",
    "work",
    "working",
    "experience",
    "technology",
    "technologies",
    "software",
    "services",
    "operations",
    "support",
    "solutions",
    "knowledge",
    "professional",
    "technical",
    "industry",
    "customer",
    "marketing",
    "sales",
    "accounting",
}


# ============================================================
# 4. NORMALIZE TEXT
# ============================================================

def normalize_text(skill):

    if pd.isna(skill):
        return ""

    skill = str(skill).lower().strip()

    skill = re.sub(r"\s+", " ", skill)

    skill = skill.strip(" .,;:()[]{}")

    return skill


# ============================================================
# 5. NORMALIZE SKILL
# ============================================================

def normalize_skill(skill):

    skill = normalize_text(skill)

    if not skill:
        return None

    # Direct alias
    if skill in ALIASES:
        return ALIASES[skill]

    # Already canonical
    if skill in TAXONOMY:
        return skill

    # Remove obvious noise
    if skill in NOISY_SKILLS:
        return None

    return skill


# ============================================================
# 6. PROCESS SKILL LIST
# ============================================================

def process_skill_list(skills):

    if not isinstance(skills, list):
        return []

    normalized = set()

    for skill in skills:

        skill = normalize_skill(skill)

        if skill:
            normalized.add(skill)

    return sorted(normalized)


# ============================================================
# 7. MAIN
# ============================================================

def main():

    print("=" * 70)
    print("SKILL EXTRACTION / NORMALIZATION / TAXONOMY")
    print("=" * 70)

    if not INPUT_FILE.exists():

        raise FileNotFoundError(
            f"Input file not found:\n{INPUT_FILE}"
        )

    df = pd.read_csv(INPUT_FILE)

    print("\nInput shape:", df.shape)

    # --------------------------------------------------------
    # Convert stored skill lists back into Python lists
    # --------------------------------------------------------

    import ast

    def parse_skills(value):

        if pd.isna(value):
            return []

        try:

            parsed = ast.literal_eval(str(value))

            if isinstance(parsed, list):
                return parsed

        except Exception:
            pass

        return []

    df["skills_normalized"] = (
        df["skills_normalized"]
        .apply(parse_skills)
        .apply(process_skill_list)
    )

    # --------------------------------------------------------
    # Skill count
    # --------------------------------------------------------

    df["skill_count"] = (
        df["skills_normalized"]
        .apply(len)
    )

    # --------------------------------------------------------
    # Save job-level dataset
    # --------------------------------------------------------

    job_output = (
        OUTPUT_DIR /
        "jobs_with_taxonomy.csv"
    )

    df.to_csv(
        job_output,
        index=False
    )

    # --------------------------------------------------------
    # Expand job → skill
    # --------------------------------------------------------

    rows = []

    for job_id, row in df.iterrows():

        for skill in row["skills_normalized"]:

            rows.append({
                "job_id": job_id,
                "job_title": row.get(
                    "job_title_clean",
                    ""
                ),
                "location": row.get(
                    "location_clean",
                    ""
                ),
                "skill": skill,
                "category": TAXONOMY.get(
                    skill,
                    "other"
                ),
                "source_dataset": row.get(
                    "source_dataset",
                    ""
                )
            })

    mapping = pd.DataFrame(rows)

    # --------------------------------------------------------
    # Remove duplicate job-skill pairs
    # --------------------------------------------------------

    mapping = mapping.drop_duplicates(
        subset=[
            "job_id",
            "skill"
        ]
    )

    # --------------------------------------------------------
    # Save mapping
    # --------------------------------------------------------

    mapping_output = (
        OUTPUT_DIR /
        "job_skill_taxonomy.csv"
    )

    mapping.to_csv(
        mapping_output,
        index=False
    )

    # --------------------------------------------------------
    # Skill demand
    # --------------------------------------------------------

    demand = (
        mapping
        .groupby(
            ["skill", "category"]
        )
        .size()
        .reset_index(
            name="job_count"
        )
        .sort_values(
            "job_count",
            ascending=False
        )
    )

    demand_output = (
        OUTPUT_DIR /
        "skill_demand_taxonomy.csv"
    )

    demand.to_csv(
        demand_output,
        index=False
    )

    # --------------------------------------------------------
    # Category demand
    # --------------------------------------------------------

    category_demand = (
        mapping["category"]
        .value_counts()
        .reset_index()
    )

    category_demand.columns = [
        "category",
        "skill_occurrences"
    ]

    category_output = (
        OUTPUT_DIR /
        "skill_category_demand.csv"
    )

    category_demand.to_csv(
        category_output,
        index=False
    )

    # ========================================================
    # REPORT
    # ========================================================

    print("\n" + "=" * 70)
    print("RESULTS")
    print("=" * 70)

    print("\nJobs:", len(df))

    print(
        "Unique canonical skills:",
        mapping["skill"].nunique()
    )

    print(
        "Job-skill relationships:",
        len(mapping)
    )

    print("\nTop 30 canonical skills:")

    print(
        demand.head(30).to_string(
            index=False
        )
    )

    print("\nSkill categories:")

    print(
        category_demand.to_string(
            index=False
        )
    )

    print("\nOutput files:")

    print(job_output)
    print(mapping_output)
    print(demand_output)
    print(category_output)


if __name__ == "__main__":
    main()