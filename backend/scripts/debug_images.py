from backend.database import SessionLocal
from backend.models import Product
from sqlalchemy import func

def debug_images():
    db = SessionLocal()
    try:
        total = db.query(Product).count()
        missing = db.query(Product).filter(Product.image_url == None).count()
        print(f"Total Products: {total}")
        print(f"Products with Missing Images: {missing}")
        
        if missing > 0:
            print("\nSub-Categories with missing images:")
            # Get sub_categories of products with null images
            subs = db.query(Product.sub_category, func.count(Product.index))\
                .filter(Product.image_url == None)\
                .group_by(Product.sub_category)\
                .all()
            
            for s in subs:
                print(f" - '{s[0]}': {s[1]} products")
                
        # Also check if rating/market_price are populated
        print("\nData Quality Check:")
        rated = db.query(Product).filter(Product.rating != None).count()
        priced = db.query(Product).filter(Product.market_price != None).count()
        print(f"Products with Ratings: {rated}")
        print(f"Products with Market Price: {priced}")

    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    debug_images()
