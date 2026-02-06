import urllib.request
import json

try:
    print("Testing API search for 'chicken'...")
    url = "http://localhost:8000/products?search=chicken&limit=5"
    with urllib.request.urlopen(url) as response:
        print(f"Status Code: {response.getcode()}")
        if response.getcode() == 200:
            data = json.loads(response.read().decode())
            print(f"Found {len(data)} items.")
            for item in data:
                print(f"- {item.get('product')} (is_veg: {item.get('is_veg')})")
        else:
            print("Error response")
except Exception as e:
    print("Request failed:", e)
