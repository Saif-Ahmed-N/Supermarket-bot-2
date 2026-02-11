from database import engine
from sqlalchemy import text

def fix():
    try:
        with engine.connect() as conn:
            print("Adding missing columns to 'orders' table...")
            conn.execute(text("ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method VARCHAR DEFAULT 'cod';"))
            conn.execute(text("ALTER TABLE orders ADD COLUMN IF NOT EXISTS rzp_order_id VARCHAR;"))
            conn.execute(text("ALTER TABLE orders ADD COLUMN IF NOT EXISTS rzp_payment_id VARCHAR;"))
            conn.execute(text("ALTER TABLE orders ADD COLUMN IF NOT EXISTS rzp_signature VARCHAR;"))
            conn.commit()
            print("Successfully updated database schema.")
    except Exception as e:
        print(f"Error updating database: {e}")

if __name__ == "__main__":
    fix()
