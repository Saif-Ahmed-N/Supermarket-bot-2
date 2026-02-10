import requests

# First, check what categories exist
print("=== ALL CATEGORIES ===")
response = requests.get('http://localhost:8000/categories')
categories = response.json()
for cat in categories:
    print(f"- {cat}")

# Check if beverages exist with different name variations
print("\n=== TESTING BEVERAGES VARIATIONS ===")
variations = ['Beverages', 'beverages', 'Beverage', 'beverage']
for var in variations:
    response = requests.get(f'http://localhost:8000/products?category={var}&limit=1')
    data = response.json()
    print(f"{var}: {len(data)} products found")

# Search for products that might be beverages
print("\n=== SEARCHING FOR WATER ===")
response = requests.get('http://localhost:8000/products?search=water&limit=5')
data = response.json()
for product in data:
    print(f"- {product.get('product')}")
    print(f"  Category: {product.get('category')}")
    print(f"  Sub-Category: {product.get('sub_category')}")
    print()
