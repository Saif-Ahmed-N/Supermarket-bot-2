from backend.database import SessionLocal
from backend.models import Product
from sqlalchemy import text

def debug_products():
    db = SessionLocal()
    try:
        # List of products seen in screenshots
        names = [
            "Almond Butter",
            "White Quinoa Flour",
            "Singhara Atta",
            "Barley Atta",
            "Tapioca Atta",
            "Cinnamon-Infused Honey",
            "Dressing - Thousand Island"
        ]
        
        print(f"{'Product':<30} | {'Category':<20} | {'Sub-Category':<20} | {'Image URL'}")
        print("-" * 100)
        
        for name in names:
            # Flexible search
            p = db.query(Product).filter(Product.product.ilike(f"%{name}%")).first()
            if p:
                print(f"{p.product[:30]:<30} | {p.category[:20]:<20} | {str(p.sub_category)[:20]:<20} | {p.image_url}")
            else:
                print(f"Current Name search failed for: {name}")
                
        # Also check count of products with NULL sub_category
        null_sub = db.query(Product).filter(Product.sub_category == None).count()
        empty_sub = db.query(Product).filter(Product.sub_category == '').count()
        print(f"\nProducts with NULL sub_category: {null_sub}")
        print(f"Products with EMPTY sub_category: {empty_sub}")

    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    debug_products()
