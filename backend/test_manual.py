import requests
import json

BASE_URL = "http://127.0.0.1:8000"

def test_root():
    response = requests.get(f"{BASE_URL}/")
    print("\n[ROOT] Status:", response.status_code)
    print("[ROOT] Response:", response.json())

def test_products():
    response = requests.get(f"{BASE_URL}/products?limit=5")
    print("\n[PRODUCTS] Status:", response.status_code)
    data = response.json()
    print(f"[PRODUCTS] Count: {len(data)}")
    if len(data) > 0:
        print("[PRODUCTS] First item sample:", json.dumps(data[0], indent=2))

def test_categories():
    response = requests.get(f"{BASE_URL}/categories")
    print("\n[CATEGORIES] Status:", response.status_code)
    data = response.json()
    print(f"[CATEGORIES] Count: {len(data)}")
    print("[CATEGORIES] Sample:", data[:5])

if __name__ == "__main__":
    try:
        test_root()
        test_products()
        test_categories()
    except Exception as e:
        print("Error running tests. Is the server running?", e)
