import json
import os
from sqlalchemy import create_engine, Column, Integer, String, Float, Text, Boolean, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# 1. Setup Database Connection (Standalone)
load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    print("ERROR: DATABASE_URL not found in .env")
    exit(1)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# 2. Define Model locally to avoid import issues
class Product(Base):
    __tablename__ = "products_v2"
    index = Column(Integer, primary_key=True, index=True)
    product = Column(String, index=True)
    category = Column(String, index=True)
    sub_category = Column(String, index=True)
    brand = Column(String, index=True)
    sale_price = Column(Float)
    market_price = Column(Float)
    type = Column(String)
    rating = Column(Float, nullable=True)
    description = Column(Text)
    weight_str = Column(String, index=True)
    unit_type = Column(String)
    is_veg = Column(Boolean, default=True)
    image_url = Column(String)
    packed_date = Column(String, index=True)
    expiry_date = Column(String, index=True)
    stock = Column(Integer, default=0)

# MOVED: Now pointing to JSON file
JSON_FILE_PATH = r"c:\Users\Acer\Desktop\Supermarket-bot-2\cosmocartt_Bot\mock_products.json"

def migrate():
    # Ensure tables exist (for fresh DB)
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        print("--- COMMENCING STANDALONE DATABASE MIGRATION (JSON MODE) ---")
        
        # 1. Update schema
        print("Applying SQL schema updates... SKIPPED (Handled by create_all)")
        # with engine.connect() as conn:
        #     conn.execute(text("ALTER TABLE products_v2 ADD COLUMN IF NOT EXISTS packed_date VARCHAR;"))
        #     conn.execute(text("ALTER TABLE products_v2 ADD COLUMN IF NOT EXISTS expiry_date VARCHAR;"))
        #     conn.execute(text("ALTER TABLE products_v2 ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 0;"))
        #     # Ensure index is there
        #     conn.execute(text("CREATE INDEX IF NOT EXISTS ix_products_v2_packed_date ON products_v2 (packed_date);"))
        #     conn.execute(text("CREATE INDEX IF NOT EXISTS ix_products_v2_expiry_date ON products_v2 (expiry_date);"))
        #     conn.commit()
        
        # 2. Clear data
        print("Clearing existing products...")
        # Try TRUNCATE first (faster for Postgres), fallback to DELETE if it fails (e.g. SQLite)
        try:
            db.execute(text("TRUNCATE TABLE products_v2 RESTART IDENTITY CASCADE"))
        except Exception:
            db.rollback()
            print("TRUNCATE failed, using DELETE FROM...")
            db.execute(text("DELETE FROM products_v2"))
        
        db.commit()
        
        # 3. Import
        print(f"Reading {JSON_FILE_PATH}...")
        with open(JSON_FILE_PATH, mode='r', encoding='utf-8') as f:
            data = json.load(f)
            count = 0
            batch = []
            
            print(f"Found {len(data)} items in JSON file.")
            
            for row in data:
                try:
                    product = Product(
                        product=row.get('product_name'),
                        brand=row.get('brand'),
                        category=row.get('category'),
                        sub_category=row.get('sub_category'),
                        market_price=float(row.get('market_price', 0.0)),
                        sale_price=float(row.get('sale_price', 0.0)),
                        packed_date=row.get('packed_date'),
                        expiry_date=row.get('expiry_date'),
                        rating=float(row.get('ratings', 0.0)),
                        image_url=row.get('image_url'),
                        stock=int(row.get('stock', 0)),
                        type="General",
                        description=f"{row.get('product_name')} by {row.get('brand')}",
                        weight_str="Standard", # Fallback
                        unit_type="pcs" # Fallback
                    )
                    batch.append(product)
                    count += 1
                    
                    if len(batch) >= 1000:
                        db.bulk_save_objects(batch)
                        db.commit()
                        batch = []
                        print(f"Progress: {count} items imported...")
                except Exception as row_error:
                    print(f"Error processing row {count}: {row_error}")
                    continue

            if batch:
                db.bulk_save_objects(batch)
                db.commit()
        
        print(f"--- SUCCESS: {count} PRODUCTS IMPORTED ---")
        
        # Verification
        row_count = db.execute(text("SELECT COUNT(*) FROM products_v2")).scalar()
        print(f"VERIFICATION: Total rows in products_v2 table: {row_count}")

    except Exception as e:
        print(f"CRITICAL ERROR: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    migrate()
