from backend.database import SessionLocal
from backend.models import Product
from sqlalchemy import text
import random

def populate_data():
    db = SessionLocal()
    try:
        print("Populating Ratings...")
        # 1. Update NULL ratings with random 3.5 - 5.0
        # Fetch products with null rating
        products = db.query(Product).filter(Product.rating == None).all()
        print(f"Found {len(products)} products without ratings.")
        
        for p in products:
            p.rating = round(random.uniform(3.5, 5.0), 1)
        
        db.commit()
        print("Ratings updated.")

        print("Fixing Market Prices...")
        # 2. Ensure market_price >= sale_price for positive discount
        # If market_price < sale_price (data error), set market_price = sale_price * 1.1 (10% markup)
        products_price = db.query(Product).filter(Product.market_price < Product.sale_price).all()
        print(f"Found {len(products_price)} products with invalid market price.")
        
        for p in products_price:
            p.market_price = round(p.sale_price * random.uniform(1.05, 1.25), 2)
            
        db.commit()
        print("Prices fixed.")

    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    populate_data()
