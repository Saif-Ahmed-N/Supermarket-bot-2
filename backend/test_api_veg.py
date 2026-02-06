import urllib.request
import json

try:
    print("Testing API search for 'Chicken' to check is_veg status...")
    url = "http://localhost:8000/products?search=Chicken&limit=5"
    with urllib.request.urlopen(url) as response:
        print(f"Status Code: {response.getcode()}")
        if response.getcode() == 200:
            raw_data = response.read().decode()
            print(f"Raw JSON: {raw_data[:500]}") # Print first 500 chars
            data = json.loads(raw_data)
            print(f"Found {len(data)} items.")
            for item in data:
                print(f"Product: {item.get('product')}")
                print(f"is_veg (Raw Value): {item.get('is_veg')} (Type: {type(item.get('is_veg'))})")
        else:
            print("Error response")
except Exception as e:
    print("Request failed:", e)
