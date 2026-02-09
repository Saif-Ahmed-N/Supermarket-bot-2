from backend.database import SessionLocal
from backend.models import Product
from sqlalchemy import func

component = "Data Analysis"

def analyze_data():
    db = SessionLocal()
    try:
        # Count total products
        total_products = db.query(Product).count()
        print(f"Total Products: {total_products}")

        # distinctive categories
        categories = db.query(Product.category).distinct().all()
        categories = [c[0] for c in categories if c[0]]
        print(f"\nTotal Categories: {len(categories)}")
        print("Categories:", categories)

        # distinct sub_categories
        sub_categories = db.query(Product.sub_category).distinct().all()
        sub_categories = [s[0] for s in sub_categories if s[0]]
        print(f"\nTotal Sub-Categories: {len(sub_categories)}")
        # print("Sub-Categories:", sub_categories) # Might be too many

    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    analyze_data()
