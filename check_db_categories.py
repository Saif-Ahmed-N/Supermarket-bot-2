import sys
import os
sys.path.append(os.path.dirname(__file__))

from backend.database import SessionLocal
from backend import models

# Create database session
db = SessionLocal()

# Get all unique categories
print("=== ALL CATEGORIES IN DATABASE ===\n")
categories = db.query(models.Product.category).distinct().all()
for i, (cat,) in enumerate(categories, 1):
    print(f"{i}. '{cat}'")

# Check beverage products specifically
print("\n\n=== SEARCHING FOR BEVERAGE PRODUCTS ===\n")
beverage_products = db.query(models.Product).filter(
    models.Product.sub_category.in_(['Coffee', 'Tea', 'Water', 'Energy & Soft Drinks', 'Fruit Juices & Drinks', 'Health Drink, Supplement'])
).limit(10).all()

print(f"Found {len(beverage_products)} beverage products\n")
for p in beverage_products:
    print(f"Product: {p.product}")
    print(f"Category: '{p.category}'")
    print(f"Sub-Category: '{p.sub_category}'")
    print(f"Price: ₹{p.sale_price}")
    print()

db.close()
