import pandas as pd
from sqlalchemy import create_engine, text
import os
import sys
import traceback
import re

# No path hacking needed when running as module
from backend.database import DATABASE_URL
from backend.models import Product, Base

def import_data():
    if not DATABASE_URL:
        print("DATABASE_URL not found in environment variables.")
        return

    csv_file = "BigBasket Products.csv"
    if not os.path.exists(csv_file):
        # try checking parent dir
        csv_file = "../BigBasket Products.csv"
        if not os.path.exists(csv_file):
             print(f"CSV file not found: {csv_file}")
             return

    print("Reading CSV...")
    df = pd.read_csv(csv_file)
    
    # Clean up rating column (handle missing values)
    df['rating'] = pd.to_numeric(df['rating'], errors='coerce')
    
    # --- PREPROCESSING START ---
    print("Preprocessing data for enhanced frontend...")

    # 1. Extract Weight & Unit
    def extract_weight(name):
        if not isinstance(name, str): return None, None
        match = re.search(r'(\d+(?:\.\d+)?)\s*(kg|g|gm|gms|l|ml|pc|pcs|pack|sachet)', name, re.IGNORECASE)
        if match:
            val, unit = match.groups()
            unit = unit.lower()
            if unit in ['gm', 'gms']: unit = 'g'
            if unit in ['pc', 'pcs']: unit = 'pc'
            return f"{val}{unit}", unit
        return None, 'pc'

    df[['weight_str', 'unit_type']] = df['product'].apply(lambda x: pd.Series(extract_weight(x)))

    # 2. Diet Logic
    non_veg_keywords = ['chicken', 'meat', 'fish', 'prawn', 'shrimp', 'crab', 'egg', 'mutton', 'pork', 'seafood', 'beef']
    def check_is_veg(row):
        text = (str(row['category']) + " " + str(row['sub_category']) + " " + str(row['product'])).lower()
        if any(k in text for k in non_veg_keywords):
            return False
        return True

    df['is_veg'] = df.apply(check_is_veg, axis=1)

    # 3. Smart Image Placeholder
    def get_image(cat):
        return f"https://placehold.co/400?text={str(cat).replace(' ', '+')}"
    
    df['image_url'] = df['category'].apply(get_image)
    # --- PREPROCESSING END ---
    
    print(f"Found {len(df)} rows. Inserting into database...")
    
    engine = create_engine(DATABASE_URL)
    
    try:
        print("Dropping existing table (if any)...")
        with engine.connect() as conn:
            conn.execute(text("DROP TABLE IF EXISTS products_v2"))
            print("Creating table via Raw SQL...")
            conn.execute(text("""
                CREATE TABLE products_v2 (
                    index BIGINT PRIMARY KEY,
                    product TEXT,
                    category TEXT,
                    sub_category TEXT,
                    brand TEXT,
                    sale_price FLOAT,
                    market_price FLOAT,
                    type TEXT,
                    rating FLOAT,
                    description TEXT,
                    weight_str TEXT,
                    unit_type TEXT,
                    is_veg BOOLEAN,
                    image_url TEXT
                );
            """))
            conn.commit()
            print("Table created.")

        print("Inserting records...")
        df.to_sql('products_v2', engine, if_exists='append', index=False, chunksize=1000)
        print("Data imported successfully!")
    except Exception as e:
        import traceback
        with open("conversion_error.txt", "w") as f:
            f.write(traceback.format_exc())
            f.write(f"\nError: {e}")
        print(f"Error importing data: {e}")

if __name__ == "__main__":
    import_data()
