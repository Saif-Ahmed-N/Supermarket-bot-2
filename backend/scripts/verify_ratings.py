from backend.database import SessionLocal
from backend.models import Product
from sqlalchemy import text, func

def verify_data():
    db = SessionLocal()
    try:
        print("Verifying Data Integrity...")
        
        # 1. Check for missing ratings
        missing_ratings = db.query(Product).filter(Product.rating == None).count()
        if missing_ratings == 0:
            print("SUCCESS: All products have ratings.")
        else:
            print(f"FAIL: {missing_ratings} products are still missing ratings.")

        # 2. Check for invalid prices
        invalid_prices = db.query(Product).filter(Product.market_price < Product.sale_price).count()
        if invalid_prices == 0:
            print("SUCCESS: All products have valid market prices (>= sale price).")
        else:
            print(f"FAIL: {invalid_prices} products have market_price < sale_price.")

        # 3. Sample Data
        print("\nSample Product Data with Calculated Discounts:")
        products = db.query(Product).order_by(func.random()).limit(10).all()
        for p in products:
            discount = 0
            if p.market_price > p.sale_price:
                discount = round(((p.market_price - p.sale_price) / p.market_price) * 100)
            
            print(f" - {p.product[:30]}... | Rating: {p.rating} | Price: ₹{p.sale_price} | Market: ₹{p.market_price} | Discount: {discount}%")

    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    verify_data()
