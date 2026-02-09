from backend.database import SessionLocal
from backend.models import Product

def get_sub_categories():
    db = SessionLocal()
    try:
        sub_categories = db.query(Product.sub_category).distinct().all()
        sub_categories = [s[0] for s in sub_categories if s[0]]
        sub_categories.sort()
        
        print("Unique Sub-Categories:")
        for sc in sub_categories:
            print(sc)
            
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    get_sub_categories()
