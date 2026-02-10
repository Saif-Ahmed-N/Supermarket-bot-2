import requests
import json

# Get all categories
response = requests.get('http://localhost:8000/categories')
categories = response.json()

print("=== ALL CATEGORIES IN DATABASE ===")
for i, cat in enumerate(categories, 1):
    print(f"{i}. '{cat}'")

# Check for beverage-like categories
print("\n=== CHECKING FOR BEVERAGE PRODUCTS ===")
for cat in categories:
    if 'bever' in cat.lower() or 'drink' in cat.lower():
        response = requests.get(f'http://localhost:8000/products?category={cat}&limit=3')
        data = response.json()
        print(f"\nCategory: '{cat}' - Found {len(data)} products")
        for product in data[:3]:
            print(f"  - {product.get('product')}")
            print(f"    Sub-category: {product.get('sub_category')}")
