import pandas as pd
import os

# Path to CSV
csv_path = "BigBasket Products.csv"

if not os.path.exists(csv_path):
    print(f"File not found: {csv_path}")
    exit(1)

df = pd.read_csv(csv_path)
with open("backend/scripts/csv_info.txt", "w", encoding="utf-8") as f:
    f.write(f"COLUMNS: {df.columns.tolist()}\n")

    # Check for specific columns likelihood
    likely_image = [c for c in df.columns if 'image' in c.lower() or 'url' in c.lower()]
    likely_weight = [c for c in df.columns if 'weight' in c.lower() or 'quantity' in c.lower() or 'size' in c.lower()]

    f.write(f"Likely Image Cols: {likely_image}\n")
    f.write(f"Likely Weight Cols: {likely_weight}\n")

    # Check Type column
    if 'type' in df.columns:
        f.write(f"Unique Types: {df['type'].unique().tolist()}\n")
