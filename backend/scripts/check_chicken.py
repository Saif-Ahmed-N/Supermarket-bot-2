from sqlalchemy import create_engine, text
from backend.database import DATABASE_URL
import pandas as pd

if not DATABASE_URL:
    print("NO DATABASE URL")
    exit()

engine = create_engine(DATABASE_URL)

with engine.connect() as conn:
    # Check total count
    count = conn.execute(text("SELECT COUNT(*) FROM products_v2")).scalar()
    print(f"Total Products: {count}")

    # Check for Chicken
    result = conn.execute(text("SELECT product, category, is_veg FROM products_v2 WHERE product ILIKE '%Chicken%' LIMIT 5")).fetchall()
    print(f"Found {len(result)} Chicken items:")
    for r in result:
        print(r)
