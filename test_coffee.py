import requests

# Search for coffee products to confirm they exist
response = requests.get('http://localhost:8000/products?search=coffee&limit=5')
products = response.json()

print(f"Found {len(products)} coffee products")
print("\n=== COFFEE PRODUCTS ===")
for p in products:
    print(f"\nProduct: {p.get('product')}")
    print(f"Category: '{p.get('category')}'")
    print(f"Sub-Category: '{p.get('sub_category')}'")
    print(f"Price: ₹{p.get('sale_price')}")
