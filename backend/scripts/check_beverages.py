from backend.database import SessionLocal
from backend.models import Product

db = SessionLocal()

# Get total count
total = db.query(Product).filter(Product.category == 'Beverages').count()

# Get sample products
beverages = db.query(Product).filter(Product.category == 'Beverages').limit(30).all()

# Check subcategories
subcats = db.query(Product.sub_category).filter(Product.category == 'Beverages').distinct().all()

with open('beverage_analysis.txt', 'w', encoding='utf-8') as f:
    f.write(f'Total Beverages in DB: {total}\n\n')
    f.write('Subcategories in DB:\n')
    for s in subcats:
        f.write(f'  - {s[0]}\n')
    
    f.write('\n\nSample beverage products:\n')
    for p in beverages:
        f.write(f'  - {p.product} (sub_category: {p.sub_category})\n')

db.close()

print(f'Analysis saved to beverage_analysis.txt')
print(f'Total: {total} beverages')
print(f'Subcategories: {len(subcats)}')
