from backend.database import engine
from sqlalchemy import text

def test_connection():
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            print("Connection successful:", result.scalar())
            
            # Try creating a dummy table
            conn.execute(text("CREATE TABLE IF NOT EXISTS test_table (id serial PRIMARY KEY, name text)"))
            print("Test table created.")
            
            conn.execute(text("DROP TABLE test_table"))
            print("Test table dropped.")
            
    except Exception as e:
        print("Connection failed:", e)

if __name__ == "__main__":
    test_connection()
