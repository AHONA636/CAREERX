from pathlib import Path
import pandas as pd
import re
import ast


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
# 1. NORMALIZATION ALIASES
# ============================================================

ALIASES = {

    # Programming
    "python programming": "python",
    "python3": "python",
    "python 3": "python",

    "java programming": "java",

    "js": "javascript",
    "javascript programming": "javascript",

    "ts": "typescript",

    "cpp": "c++",
    "c plus plus": "c++",

    "c sharp": "c#",

    "golang": "go",

    "r programming": "r",

    # Web
    "html5": "html",
    "html 5": "html",

    "css3": "css",
    "css 3": "css",

    "reactjs": "react",
    "react js": "react",
    "react.js": "react",

    "nodejs": "node.js",
    "node js": "node.js",

    "nextjs": "next.js",
    "next js": "next.js",

    "angularjs": "angular",
    "angular js": "angular",

    # AI / ML
    "ml": "machine learning",
    "machine-learning": "machine learning",

    "dl": "deep learning",
    "deep-learning": "deep learning",

    "ai": "artificial intelligence",
    "artificial-intelligence": "artificial intelligence",

    "natural language processing": "nlp",
    "natural-language processing": "nlp",

    "large language model": "large language models",
    "large language models": "large language models",
    "llm": "large language models",
    "llms": "large language models",

    "gen ai": "generative ai",
    "generative-ai": "generative ai",

    "computer-vision": "computer vision",

    # ML libraries
    "sklearn": "scikit-learn",
    "scikit learn": "scikit-learn",

    "torch": "pytorch",

    "tf": "tensorflow",

    # Data
    "data analytics": "data analytics",
    "data analysis": "data analysis",

    "data visualization": "data visualization",

    "statistical analysis": "statistics",

    # Databases
    "postgres": "postgresql",
    "postgres db": "postgresql",

    "mongo db": "mongodb",

    "ms sql": "sql server",
    "microsoft sql server": "sql server",

    "oracle database": "oracle",

    # Cloud
    "amazon web services": "aws",
    "amazon aws": "aws",

    "google cloud": "gcp",
    "google cloud platform": "gcp",

    "microsoft azure": "azure",
    "azure cloud": "azure",

    # DevOps
    "k8s": "kubernetes",

    "ci cd": "ci/cd",
    "continuous integration": "ci/cd",
    "continuous deployment": "ci/cd",

    # Version control
    "github": "github",
    "git hub": "github",

    # Security
    "cyber security": "cybersecurity",
    "cyber-security": "cybersecurity",

    "infosec": "information security",

    "ethical hacking": "ethical hacking",

    "penetration testing": "penetration testing",

    # Soft skills
    "communication skills": "communication",
    "communication skill": "communication",

    "team work": "teamwork",
    "team working": "teamwork",

    "problem-solving": "problem solving",

    "critical thinking skills": "critical thinking",

    "leadership skills": "leadership",

    # Business
    "project management": "project management",

    "business analysis": "business analysis",

    "business development": "business development",

    "customer service": "customer service",

    "digital marketing": "digital marketing",

    "content marketing": "content marketing",

    "search engine optimization": "seo",
    "search engine optimisation": "seo",

    # Methodologies
    "agile methodology": "agile",
    "agile methodologies": "agile",

    "scrum methodology": "scrum",

    "restful api": "rest api",
    "restful apis": "rest api",

    "api development": "api development",

    # Enterprise
    "sap": "sap",

    "salesforce": "salesforce",

    "servicenow": "servicenow",
}


# ============================================================
# 2. TAXONOMY
# ============================================================

TAXONOMY = {

    # ---------------- PROGRAMMING ----------------

    "python": "programming_language",
    "java": "programming_language",
    "javascript": "programming_language",
    "typescript": "programming_language",
    "c++": "programming_language",
    "c#": "programming_language",
    "go": "programming_language",
    "r": "programming_language",
    "php": "programming_language",
    "ruby": "programming_language",
    "scala": "programming_language",
    "kotlin": "programming_language",
    "swift": "programming_language",

    # ---------------- WEB ----------------

    "html": "web",
    "css": "web",

    "react": "web_framework",
    "angular": "web_framework",
    "vue": "web_framework",

    "node.js": "web_framework",
    "next.js": "web_framework",
    "django": "web_framework",
    "flask": "web_framework",
    "spring": "web_framework",
    "spring boot": "web_framework",

    # ---------------- AI / ML ----------------

    "artificial intelligence": "artificial_intelligence",
    "machine learning": "artificial_intelligence",
    "deep learning": "artificial_intelligence",
    "nlp": "artificial_intelligence",
    "computer vision": "artificial_intelligence",
    "generative ai": "artificial_intelligence",
    "large language models": "artificial_intelligence",
    "reinforcement learning": "artificial_intelligence",

    # ---------------- ML FRAMEWORKS ----------------

    "scikit-learn": "ml_framework",
    "tensorflow": "ml_framework",
    "pytorch": "ml_framework",
    "keras": "ml_framework",
    "xgboost": "ml_framework",
    "lightgbm": "ml_framework",
    "catboost": "ml_framework",

    # ---------------- DATA ----------------

    "data science": "data",
    "data analysis": "data",
    "data analytics": "data",
    "data visualization": "data",
    "statistics": "data",
    "big data": "data",
    "data mining": "data",
    "etl": "data",

    # ---------------- DATABASE ----------------

    "sql": "database",
    "mysql": "database",
    "postgresql": "database",
    "mongodb": "database",
    "sql server": "database",
    "oracle": "database",
    "redis": "database",
    "sqlite": "database",
    "cassandra": "database",

    # ---------------- CLOUD ----------------

    "aws": "cloud",
    "azure": "cloud",
    "gcp": "cloud",

    # ---------------- DEVOPS ----------------

    "docker": "devops",
    "kubernetes": "devops",
    "jenkins": "devops",
    "ci/cd": "devops",
    "terraform": "devops",
    "ansible": "devops",
    "maven": "devops",
    "gradle": "devops",

    # ---------------- VERSION CONTROL ----------------

    "git": "version_control",
    "github": "version_control",
    "gitlab": "version_control",
    "bitbucket": "version_control",

    # ---------------- SECURITY ----------------

    "cybersecurity": "cybersecurity",
    "information security": "cybersecurity",
    "network security": "cybersecurity",
    "ethical hacking": "cybersecurity",
    "penetration testing": "cybersecurity",
    "application security": "cybersecurity",

    # ---------------- API / ARCHITECTURE ----------------

    "rest api": "software_engineering",
    "api development": "software_engineering",
    "microservices": "software_engineering",
    "software architecture": "software_engineering",

    # ---------------- SOFT SKILLS ----------------

    "communication": "soft_skill",
    "teamwork": "soft_skill",
    "problem solving": "soft_skill",
    "critical thinking": "soft_skill",
    "leadership": "soft_skill",
    "time management": "soft_skill",
    "project management": "soft_skill",

    # ---------------- BUSINESS ----------------

    "business analysis": "business",
    "business development": "business",
    "customer service": "business",
    "digital marketing": "business",
    "content marketing": "business",
    "seo": "business",
    "sales": "business",
    "accounting": "business",
    "finance": "business",

    # ---------------- ENTERPRISE ----------------

    "sap": "enterprise_software",
    "salesforce": "enterprise_software",
    "servicenow": "enterprise_software",

    # ---------------- METHODOLOGIES ----------------

    "agile": "methodology",
    "scrum": "methodology",
}


# ============================================================
# 3. DEFINITELY NOISY TERMS
# ============================================================

NOISY_SKILLS = {

    "skills",
    "skill",
    "experience",
    "work",
    "working",
    "job",
    "jobs",
    "career",
    "professional",
    "professionals",
    "technology",
    "technologies",
    "technical",
    "technical skills",
    "software",
    "services",
    "solutions",
    "knowledge",
    "requirements",
    "responsibilities",
    "role",
    "roles",
    "team",
    "company",
    "organization",
    "business",
    "industry",
    "office",
    "operations",
    "support",
    "quality",
    "performance",
    "development",
    "management",
}


# ============================================================
# 4. NORMALIZE
# ============================================================

def normalize_skill(skill):

    if pd.isna(skill):
        return None

    skill = str(skill).lower().strip()

    skill = re.sub(r"\s+", " ", skill)

    skill = skill.strip(" .,;:()[]{}")

    if not skill:
        return None

    # Remove obvious noise
    if skill in NOISY_SKILLS:
        return None

    # Alias
    if skill in ALIASES:
        return ALIASES[skill]

    # Already canonical
    if skill in TAXONOMY:
        return skill

    return skill


# ============================================================
# 5. PARSE EXISTING LIST
# ============================================================

def parse_skill_list(value):

    if pd.isna(value):
        return []

    try:

        parsed = ast.literal_eval(str(value))

        if isinstance(parsed, list):
            return parsed

    except Exception:
        pass

    return []


# ============================================================
# 6. BUILD CANONICAL SKILL LIST
# ============================================================

def clean_skill_list(value):

    skills = parse_skill_list(value)

    cleaned = set()

    for skill in skills:

        normalized = normalize_skill(skill)

        if normalized:
            cleaned.add(normalized)

    return sorted(cleaned)


# ============================================================
# 7. MAIN
# ============================================================

def main():

    print("=" * 70)
    print("SKILL TAXONOMY V2")
    print("=" * 70)

    df = pd.read_csv(
        INPUT_FILE,
        low_memory=False
    )

    print("\nInput jobs:", len(df))

    # --------------------------------------------------------
    # Normalize skills
    # --------------------------------------------------------

    df["canonical_skills"] = (
        df["skills_normalized"]
        .apply(clean_skill_list)
    )

    df["canonical_skill_count"] = (
        df["canonical_skills"]
        .apply(len)
    )

    # --------------------------------------------------------
    # Save job-level output
    # --------------------------------------------------------

    job_output = (
        OUTPUT_DIR /
        "jobs_taxonomy_v2.csv"
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

        for skill in row["canonical_skills"]:

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

    mapping = mapping.drop_duplicates(
        subset=["job_id", "skill"]
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
        .reset_index(name="job_count")
        .sort_values(
            "job_count",
            ascending=False
        )
    )

    # --------------------------------------------------------
    # Save
    # --------------------------------------------------------

    mapping_output = (
        OUTPUT_DIR /
        "job_skill_taxonomy_v2.csv"
    )

    demand_output = (
        OUTPUT_DIR /
        "skill_demand_taxonomy_v2.csv"
    )

    mapping.to_csv(
        mapping_output,
        index=False
    )

    demand.to_csv(
        demand_output,
        index=False
    )

    # ========================================================
    # REPORT
    # ========================================================

    total_relationships = len(mapping)

    other_relationships = (
        mapping["category"]
        .eq("other")
        .sum()
    )

    recognized_relationships = (
        total_relationships -
        other_relationships
    )

    print("\n" + "=" * 70)
    print("RESULTS")
    print("=" * 70)

    print(
        "\nJobs:",
        len(df)
    )

    print(
        "Unique canonical skills:",
        mapping["skill"].nunique()
    )

    print(
        "Job-skill relationships:",
        total_relationships
    )

    print(
        "Recognized relationships:",
        recognized_relationships
    )

    print(
        "Other relationships:",
        other_relationships
    )

    if total_relationships > 0:

        print(
            "Taxonomy coverage:",
            round(
                recognized_relationships
                / total_relationships
                * 100,
                2
            ),
            "%"
        )

    print("\nCategory distribution:")

    print(
        mapping["category"]
        .value_counts()
        .to_string()
    )

    print("\nTop 30 canonical skills:")

    print(
        demand.head(30).to_string(
            index=False
        )
    )

    # --------------------------------------------------------
    # Show remaining OTHER skills
    # --------------------------------------------------------

    print("\nTop 50 skills still classified as OTHER:")

    other = (
        demand[
            demand["category"] == "other"
        ]
        .head(50)
    )

    print(
        other.to_string(
            index=False
        )
    )

    print("\nOutput files:")

    print(job_output)
    print(mapping_output)
    print(demand_output)


if __name__ == "__main__":
    main()