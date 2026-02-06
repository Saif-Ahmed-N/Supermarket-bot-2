from sqlalchemy import create_engine, text
from backend.database import DATABASE_URL
import time

def clear_locks():
    print("Attempting to clear database locks...")
    # Use the direct connection logic, but we need to be careful.
    # We will try to connect and run the terminate command.
    
    engine = create_engine(DATABASE_URL)
    
    try:
        with engine.connect() as conn:
            # PostgreSQL specific command to kill all other connections to this DB
            sql = text("""
                SELECT pg_terminate_backend(pg_stat_activity.pid)
                FROM pg_stat_activity
                WHERE pg_stat_activity.datname = 'postgres'
                  AND pid <> pg_backend_pid();
            """)
            print("Executing kill command...")
            conn.execute(sql)
            print("All other connections killed.")
            
    except Exception as e:
        print(f"Error clearing locks: {e}")

if __name__ == "__main__":
    clear_locks()
