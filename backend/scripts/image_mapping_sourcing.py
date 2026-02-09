from backend.database import SessionLocal, engine
from backend.models import Product
from sqlalchemy import text

# Mapping of Sub-Categories to high-quality Open Source Image URLs (Unsplash/Pexels/Wikimedia)
# Using generic but relevant images.
IMAGE_MAPPING = {
    "All Purpose Cleaners": "https://images.unsplash.com/photo-1585833800637-2cf0da536de0?auto=format&fit=crop&w=400&q=80",
    "Appliances & Electricals": "https://images.unsplash.com/photo-1584622050111-993a426fbf0a?auto=format&fit=crop&w=400&q=80",
    "Atta, Flours & Sooji": "https://images.unsplash.com/photo-1509365465984-119181172a50?auto=format&fit=crop&w=400&q=80", # Bakery/Flour generic
    "Baby Accessories": "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=400&q=80",
    "Baby Bath & Hygiene": "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=400&q=80",
    "Baby Food & Formula": "https://images.unsplash.com/photo-1584634731339-252c581abfc5?auto=format&fit=crop&w=400&q=80",
    "Bakery Snacks": "https://images.unsplash.com/photo-1509365465984-119181172a50?auto=format&fit=crop&w=400&q=80",
    "Bakeware": "https://images.unsplash.com/photo-1583944682490-2824be4c28b5?auto=format&fit=crop&w=400&q=80",
    "Bath & Hand Wash": "https://images.unsplash.com/photo-1584305574647-0cc949a2bb9f?auto=format&fit=crop&w=400&q=80",
    "Bins & Bathroom Ware": "https://images.unsplash.com/photo-1584622050111-993a426fbf0a?auto=format&fit=crop&w=400&q=80",
    "Biscuits & Cookies": "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=400&q=80",
    "Breads & Buns": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80",
    "Breakfast Cereals": "https://images.unsplash.com/photo-1521483450569-b5668a62049d?auto=format&fit=crop&w=400&q=80",
    "Cakes & Pastries": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=400&q=80",
    "Car & Shoe Care": "https://images.unsplash.com/photo-1632731518342-a6f91d848135?auto=format&fit=crop&w=400&q=80",
    "Cereals & Breakfast": "https://images.unsplash.com/photo-1521483450569-b5668a62049d?auto=format&fit=crop&w=400&q=80",
    "Chocolates & Biscuits": "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=400&q=80",
    "Chocolates & Candies": "https://images.unsplash.com/photo-1582239486851-4d94326120e2?auto=format&fit=crop&w=400&q=80",
    "Coffee": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=400&q=80",
    "Cookies, Rusk & Khari": "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=400&q=80",
    "Cooking & Baking Needs": "https://images.unsplash.com/photo-1506368249639-73a05d6f6488?auto=format&fit=crop&w=400&q=80",
    "Cookware & Non Stick": "https://images.unsplash.com/photo-1584990347449-a0846b1d4023?auto=format&fit=crop&w=400&q=80",
    "Crockery & Cutlery": "https://images.unsplash.com/photo-1584990347449-a0846b1d4023?auto=format&fit=crop&w=400&q=80",
    "Cuts & Sprouts": "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&w=400&q=80",
    "Dairy": "https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=400&q=80",
    "Dairy & Cheese": "https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=400&q=80",
    "Dals & Pulses": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80", # Rice/Grains
    "Detergents & Dishwash": "https://images.unsplash.com/photo-1585833800637-2cf0da536de0?auto=format&fit=crop&w=400&q=80",
    "Diapers & Wipes": "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=400&q=80",
    "Disposables, Garbage Bag": "https://images.unsplash.com/photo-1584622050111-993a426fbf0a?auto=format&fit=crop&w=400&q=80",
    "Drinks & Beverages": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=400&q=80",
    "Dry Fruits": "https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?auto=format&fit=crop&w=400&q=80",
    "Edible Oils & Ghee": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80",
    "Eggs": "https://images.unsplash.com/photo-1569288052389-dac9b01c9c05?auto=format&fit=crop&w=400&q=80",
    "Energy & Soft Drinks": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=400&q=80",
    "Exotic Fruits & Veggies": "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=400&q=80",
    "Feeding & Nursing": "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=400&q=80",
    "Feminine Hygiene": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80",
    "Fish & Seafood": "https://images.unsplash.com/photo-1534951009808-766178b47a4f?auto=format&fit=crop&w=400&q=80",
    "Flask & Casserole": "https://images.unsplash.com/photo-1584990347449-a0846b1d4023?auto=format&fit=crop&w=400&q=80",
    "Flower Bouquets, Bunches": "https://images.unsplash.com/photo-1563241527-28509e44bc63?auto=format&fit=crop&w=400&q=80",
    "Fragrances & Deos": "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=400&q=80",
    "Fresh Fruits": "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=400&q=80",
    "Fresh Vegetables": "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?auto=format&fit=crop&w=400&q=80",
    "Fresheners & Repellents": "https://images.unsplash.com/photo-1585833800637-2cf0da536de0?auto=format&fit=crop&w=400&q=80",
    "Frozen Veggies & Snacks": "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80",
    "Fruit Juices & Drinks": "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=400&q=80",
    "Gardening": "https://images.unsplash.com/photo-1589531646271-93021f185c79?auto=format&fit=crop&w=400&q=80",
    "Gourmet Breads": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80",
    "Hair Care": "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=400&q=80",
    "Health & Medicine": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80",
    "Health Drink, Supplement": "https://images.unsplash.com/photo-1584634731339-252c581abfc5?auto=format&fit=crop&w=400&q=80",
    "Herbs & Seasonings": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80",
    "Ice Creams & Desserts": "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&w=400&q=80",
    "Indian Mithai": "https://images.unsplash.com/photo-1517244683847-7456b63c5969?auto=format&fit=crop&w=400&q=80",
    "Kitchen Accessories": "https://images.unsplash.com/photo-1584990347449-a0846b1d4023?auto=format&fit=crop&w=400&q=80",
    "Makeup": "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=400&q=80",
    "Marinades": "https://images.unsplash.com/photo-1616782299719-2169572459c5?auto=format&fit=crop&w=400&q=80",
    "Masalas & Spices": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80",
    "Men's Grooming": "https://images.unsplash.com/photo-1550529819-75ddad658863?auto=format&fit=crop&w=400&q=80",
    "Mops, Brushes & Scrubs": "https://images.unsplash.com/photo-1585833800637-2cf0da536de0?auto=format&fit=crop&w=400&q=80",
    "Mothers & Maternity": "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=400&q=80",
    "Mutton & Lamb": "https://images.unsplash.com/photo-1603048297172-c92544798d5e?auto=format&fit=crop&w=400&q=80",
    "Non Dairy": "https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=400&q=80",
    "Noodle, Pasta, Vermicelli": "https://images.unsplash.com/photo-1551462147-37885acc36f1?auto=format&fit=crop&w=400&q=80",
    "Oils & Vinegar": "https://images.unsplash.com/photo-1617088612749-3178c5d9a957?auto=format&fit=crop&w=400&q=80",
    "Oral Care": "https://images.unsplash.com/photo-1559591937-e170494df332?auto=format&fit=crop&w=400&q=80",
    "Organic Fruits & Vegetables": "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=400&q=80",
    "Organic Staples": "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80",
    "Party & Festive Needs": "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=400&q=80",
    "Pasta, Soup & Noodles": "https://images.unsplash.com/photo-1551462147-37885acc36f1?auto=format&fit=crop&w=400&q=80",
    "Pet Food & Accessories": "https://images.unsplash.com/photo-1589924691195-41432c84c161?auto=format&fit=crop&w=400&q=80",
    "Pickles & Chutney": "https://images.unsplash.com/photo-1606914500049-7e53f09805be?auto=format&fit=crop&w=400&q=80",
    "Pooja Needs": "https://images.unsplash.com/photo-1605370428581-2292f750014a?auto=format&fit=crop&w=400&q=80",
    "Pork & Other Meats": "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=400&q=80",
    "Ready To Cook & Eat": "https://images.unsplash.com/photo-1541592106381-b31e9674c96a?auto=format&fit=crop&w=400&q=80",
    "Rice & Rice Products": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80",
    "Salt, Sugar & Jaggery": "https://images.unsplash.com/photo-1616616086200-c917ee72051e?auto=format&fit=crop&w=400&q=80",
    "Sauces, Spreads & Dips": "https://images.unsplash.com/photo-1472476443507-ebd01202f9e4?auto=format&fit=crop&w=400&q=80",
    "Sausages, Bacon & Salami": "https://images.unsplash.com/photo-1595183424169-2364c767425f?auto=format&fit=crop&w=400&q=80",
    "Skin Care": "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=400&q=80",
    "Snacks & Namkeen": "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=400&q=80",
    "Snacks, Dry Fruits, Nuts": "https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?auto=format&fit=crop&w=400&q=80",
    "Spreads, Sauces, Ketchup": "https://images.unsplash.com/photo-1607301406259-dfb1a4144271?auto=format&fit=crop&w=400&q=80",
    "Stationery": "https://images.unsplash.com/photo-1542643503-4c9102434b9d?auto=format&fit=crop&w=400&q=80",
    "Steel Utensils": "https://images.unsplash.com/photo-1584990347449-a0846b1d4023?auto=format&fit=crop&w=400&q=80",
    "Storage & Accessories": "https://images.unsplash.com/photo-1595304958614-2d08018e6988?auto=format&fit=crop&w=400&q=80",
    "Tea": "https://images.unsplash.com/photo-1576092768241-dec231847233?auto=format&fit=crop&w=400&q=80",
    "Tinned & Processed Food": "https://images.unsplash.com/photo-1606214228965-d419d2fc8626?auto=format&fit=crop&w=400&q=80",
    "Water": "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&w=400&q=80"
}

def update_images():
    db = SessionLocal()
    try:
        # 1. Update Specific Sub-Category Mappings
        print("Applying Specific Mappings...")
        for sub_cat, img_url in IMAGE_MAPPING.items():
            db.execute(
                text("UPDATE products_v2 SET image_url = :url WHERE sub_category = :sc"),
                {"url": img_url, "sc": sub_cat}
            )
            
        # 2. General Fallback for Categories (if valid sub-category mapping missing)
        # We will map Main Category -> Image and update any product in that category 
        # that still has a NULL or low-quality image (if we could detect low quality, but here we just overwrite for now to be safe or use a different strategy)
        
        # Better Strategy: Get all distinct sub-categories from DB
        sub_cats_in_db = db.execute(text("SELECT DISTINCT sub_category FROM products_v2")).fetchall()
        sub_cats_in_db = [r[0] for r in sub_cats_in_db if r[0]]
        
        print(f"Found {len(sub_cats_in_db)} distinct sub-categories in DB.")
        
        # Identify missing mappings
        missing_mappings = set(sub_cats_in_db) - set(IMAGE_MAPPING.keys())
        print(f"Missing mappings for {len(missing_mappings)} sub-categories.")
        
        # Assign a default image from the same CATEGORY if possible, or a generic one
        for missing_sc in missing_mappings:
            # Find the main category for this sub-category
            # This is a bit expensive but accurate
            cat_row = db.execute(text("SELECT category FROM products_v2 WHERE sub_category = :sc LIMIT 1"), {"sc": missing_sc}).fetchone()
            if cat_row:
                main_cat = cat_row[0]
                # Try to find a match in our keys (roughly) or use a generic one
                # Simple fallback: Use "Groceries" generic image
                fallback_url = "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80" # Organic Staples
                
                # Try to match main category string in our dictionary keys
                for key, url in IMAGE_MAPPING.items():
                    if main_cat and key in main_cat: # Very rough string match
                        fallback_url = url
                        break
                
                print(f"Mapping missing '{missing_sc}' (Cat: {main_cat}) -> {fallback_url}")
                db.execute(
                    text("UPDATE products_v2 SET image_url = :url WHERE sub_category = :sc"),
                    {"url": fallback_url, "sc": missing_sc}
                )

        # 3. Handle NULL/Empty Sub-Categories (The missing link!)
        print("\nHandling NULL/Empty Sub-Categories...")
        # Get all categories that have products with NULL sub-category
        null_sub_cats = db.execute(text("SELECT DISTINCT category FROM products_v2 WHERE sub_category IS NULL OR sub_category = ''")).fetchall()
        null_sub_cats = [r[0] for r in null_sub_cats if r[0]]
        
        print(f"Found {len(null_sub_cats)} categories with products having NULL sub-category.")
        
        for cat in null_sub_cats:
            # Determine image for this CATEGORY
            fallback_url = "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80" # Default
            
            # Try to match Main Category to our dictionary keys
            found_match = False
            for key, url in IMAGE_MAPPING.items():
                if key in cat: 
                    fallback_url = url
                    found_match = True
                    break
            
            if not found_match:
                 # Specific overrides for known main categories if needed, or just let generic logic handle it
                 if "Fruits" in cat or "Vegetables" in cat:
                     fallback_url = "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=400&q=80"
                 elif "Meat" in cat:
                     fallback_url = "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=400&q=80"
            
            print(f"Mapping NULL sub-cat for Category '{cat}' -> {fallback_url}")
            db.execute(
                text("UPDATE products_v2 SET image_url = :url WHERE (sub_category IS NULL OR sub_category = '') AND category = :cat"),
                {"url": fallback_url, "cat": cat}
            )

        db.commit()
        print("Successfully updated ALL product images!")
        
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    update_images()
