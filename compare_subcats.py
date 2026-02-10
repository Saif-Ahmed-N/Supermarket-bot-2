import requests

# Get actual beverage subcategories from DB
response = requests.get('http://localhost:8000/products?category=Beverages&limit=500')
beverages = response.json()

# Get unique subcategories
db_subcats = set()
for p in beverages:
    db_subcats.add(p.get('sub_category'))

print("=== DATABASE SUBCATEGORIES ===")
for sc in sorted(db_subcats):
    print(f"  - \"{sc}\"")

print("\n=== FRONTEND SUBCATEGORIES (from useChatLogic.js) ===")
frontend_subcats = [
    "Tea",
    "Coffee",
    "Health Drinks & Nutrition Beverages",
    "Soft Drinks & Sodas",
    "Fruit Juices & Drinks",
    "Energy &Sports Drinks",
    "Milk-Based Beverages",
    "Flavoured Water & Sparkling Drinks",
    "Instant Drink Mixes",
    "Traditional & Regional Drinks",
    "Iced Tea & Cold Coffee",
    "Water & Mineral Water"
]

for fsc in frontend_subcats:
    print(f"  - \"{fsc}\"")

print("\n=== MISMATCHES ===")
for fsc in frontend_subcats:
    if fsc not in db_subcats:
        print(f"❌ Frontend has \"{fsc}\" but DB doesn't")

for dsc in db_subcats:
    found = False
    for fsc in frontend_subcats:
        if dsc.lower() == fsc.lower():
            found = True
            break
    if not found:
        print(f"⚠️  DB has \"{dsc}\" but frontend doesn't match")
