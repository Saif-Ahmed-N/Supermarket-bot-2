import requests

BASE_URL = 'http://localhost:8000'

# Test the API response
print("=== Testing API Response ===")
try:
    response = requests.get(f'{BASE_URL}/products?category=Beverages&limit=10')
    print(f"Status Code: {response.status_code}")
    print(f"Content-Type: {response.headers.get('Content-Type')}")
    print(f"\nFirst 500 characters of response:")
    print(response.text[:500])
    
    if response.status_code == 200:
        try:
            data = response.json()
            print(f"\n✓ JSON parsed successfully")
            print(f"Number of products: {len(data)}")
            if len(data) > 0:
                print(f"\nFirst product:")
                print(f"  Name: {data[0].get('product')}")
                print(f"  Category: {data[0].get('category')}")
                print(f"  Sub-category: {data[0].get('sub_category')}")
        except Exception as e:
            print(f"\n✗ JSON parse failed: {e}")
except Exception as e:
    print(f"Request failed: {e}")
