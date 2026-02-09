from backend.database import SessionLocal
from backend.models import Product
import json
import os

def verify():
    print("Verifying Product Images in DB...")
    db = SessionLocal()
    try:
        # Check a few random products
        products = db.query(Product).filter(Product.image_url.isnot(None)).limit(5).all()
        if not products:
            print("FAIL: No products with images found!")
        else:
            print(f"SUCCESS: Found {len(products)} sample products with images.")
            for p in products:
                print(f"  - {p.product} ({p.sub_category}): {p.image_url[:50]}...")
                if not p.image_url.startswith("http"):
                    print(f"    WARNING: Invalid URL for {p.product}")

    except Exception as e:
        print(f"Error checking DB: {e}")
    finally:
        db.close()

    print("\nVerifying Categories JSON...")
    json_path = "src/assets/categories.json"
    if os.path.exists(json_path):
        try:
            with open(json_path, 'r') as f:
                data = json.load(f)
                print(f"SUCCESS: Loaded {len(data)} categories from JSON.")
                for c in data:
                    if not c.get('image', '').startswith("http"):
                        print(f"  WARNING: Invalid URL for category {c.get('name')}")
        except Exception as e:
            print(f"FAIL: Error reading JSON: {e}")
    else:
        print(f"FAIL: {json_path} does not exist!")

if __name__ == "__main__":
    verify()
