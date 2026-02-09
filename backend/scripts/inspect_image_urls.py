from backend.database import SessionLocal
from backend.models import Product
from sqlalchemy import func

def inspect_urls():
    db = SessionLocal()
    try:
        print("Analyzing Image URLs...")
        
        # 1. Count distinct image URLs
        distinct_count = db.query(Product.image_url).distinct().count()
        print(f"Total Unique Image URLs: {distinct_count}")
        
        # 2. Check for Placeholder usage
        # Assuming placeholders might contain 'placehold.co' or be NULL/Empty
        placeholders = db.query(Product).filter(Product.image_url.like('%placehold.co%')).count()
        print(f"Products using 'placehold.co' URL in DB: {placeholders}")
        
        # 3. Check for specific common placeholders or potential bad mappings
        # Let's see the most common image URLs to detect duplicates
        common_urls = db.query(Product.image_url, func.count(Product.image_url))\
            .group_by(Product.image_url)\
            .order_by(func.count(Product.image_url).desc())\
            .limit(10).all()
            
        print("\nTop 10 Most Common Image URLs:")
        for url, count in common_urls:
            print(f"Count: {count} | URL: {url}")

        # 4. Show sample of 'missing' sub-categories if any
        # (This would help if we had the mapping logic handy, but for now let's just see variety)

    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    inspect_urls()
