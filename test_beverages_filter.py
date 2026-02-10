import requests

# Simulate what the frontend does
BASE_URL = 'http://localhost:8000'

# 1. Get all beverages from the category
print("=== STEP 1: Fetching all Beverages ===")
response = requests.get(f'{BASE_URL}/products?category=Beverages&limit=500')
all_beverages = response.json()
print(f"Total beverages found: {len(all_beverages)}\n")

# 2. Show subcategories
subcategories = {}
for product in all_beverages:
    subcat = product.get('sub_category', 'Unknown')
    if subcat not in subcategories:
        subcategories[subcat] = 0
    subcategories[subcat] += 1

print("=== STEP 2: Subcategories breakdown ===")
for subcat, count in sorted(subcategories.items()):
    print(f"  {subcat}: {count} products")

# 3. Test filtering for "Coffee" subcategory
print("\n=== STEP 3: Testing 'Coffee' filter ===")
subLabel = "Coffee"
keywords = ["coffee", "instant coffee", "filter coffee", "bru", "nescafe", "ground coffee", "davidoff", "levista", "cappuccino", "espresso", "mocha", "decaf"]

matched_products = []
for product in all_beverages:
    name = product.get('product', '').lower()
    subCat = (product.get('sub_category') or '').lower()
    
    # Check if any keyword matches
    isKeywordMatch = any(k.lower() in name or k.lower() in subCat for k in keywords)
    isLabelMatch = subLabel.lower() in name or subLabel.lower() in subCat
    
    if (isKeywordMatch or isLabelMatch) and product.get('category') == 'Beverages':
        matched_products.append(product)

print(f"Matched {len(matched_products)} coffee products")
print("\nFirst 5 matches:")
for i, p in enumerate(matched_products[:5], 1):
    print(f"{i}. {p.get('product')}")
    print(f"   Sub-category: {p.get('sub_category')}")
