import requests
import json

# Test the API endpoint
response = requests.get('http://localhost:8000/products?category=Beverages&limit=5')
data = response.json()

print(f"Status Code: {response.status_code}")
print(f"Number of products returned: {len(data)}")
print("\nFirst 3 products:")
for i, product in enumerate(data[:3]):
    print(f"\n{i+1}. {product.get('product', 'N/A')}")
    print(f"   Category: {product.get('category', 'N/A')}")
    print(f"   Sub-Category: {product.get('sub_category', 'MISSING!')}")
    print(f"   Price: {product.get('sale_price', 'N/A')}")

# Test with a specific search
print("\n\n=== Testing search for 'water' ===")
response2 = requests.get('http://localhost:8000/products?search=water&limit=3')
data2 = response2.json()
print(f"Found {len(data2)} products")
for product in data2:
    print(f"- {product.get('product')} (sub_category: {product.get('sub_category')})")
