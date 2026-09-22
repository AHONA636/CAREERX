from pathlib import Path
import pandas as pd


DATA_DIR = (
    Path(__file__).resolve().parent.parent
    / "data"
    / "raw"
    / "oulad"
)


for file in sorted(DATA_DIR.glob("*.csv")):

    df = pd.read_csv(file)

    print("\n" + "=" * 70)
    print(file.name)
    print("=" * 70)

    print("Shape:", df.shape)

    print("\nColumns:")
    for column in df.columns:
        print(" -", column)

    print("\nFirst 3 rows:")
    print(df.head(3).to_string(index=False))