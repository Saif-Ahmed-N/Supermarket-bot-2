import requests
from backend.database import SessionLocal
from backend.models import Product

def check_urls():
    db = SessionLocal()
    try:
        # Check specific products again with exact sub-cat
        names = [
            "Singhara Atta", # User showed this
            "Almond Butter"
        ]
        
        for name in names:
            p = db.query(Product).filter(Product.product.ilike(f"%{name}%")).first()
            if p:
                print(f"Product: {p.product}")
                print(f"Sub-Cat: '{p.sub_category}'") # Quotes to see whitespace
                print(f"URL: {p.image_url}")
                
                if p.image_url:
                    try:
                        r = requests.head(p.image_url, timeout=5)
                        print(f"Status Code: {r.status_code}")
                    except Exception as e:
                        print(f"Request Error: {e}")
                else:
                    print("URL is Empty/None")
                print("-" * 50)

    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    check_urls()
