import sys
import os
import io

# Set encoding to utf-8 for stdout/stderr
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

# Add parent directory to path
sys.path.append(os.getcwd())

from backend.llm_service import ChatbotLLMService

def debug_llm():
    log_file = "backend/debug_log_utf8.txt"
    with open(log_file, "w", encoding="utf-8") as f:
        def log(msg):
            print(msg)
            f.write(msg + "\n")

        log("Initializing ChatbotLLMService...")
        try:
            service = ChatbotLLMService()
            log("Service initialized successfully.")
        except Exception as e:
            log(f"Error initializing service: {e}")
            return

        log("\n--- Test 1: Simple Price Query ---")
        query = "What is the price of tomato?"
        log(f"Query: {query}")
        try:
            response = service.parse_user_query(query)
            log(f"Response: {response}")
        except Exception as e:
            log(f"Error parse_user_query: {e}")

        log("\n--- Test 2: Context Aware Query ---")
        query = "Show Fruits & Vegetables"
        categories = ["Fruits & Vegetables", "Beverages", "Snacks"]
        products = ["Tomato", "Apple", "Banana"]
        log(f"Query: {query}")
        try:
            response = service.parse_with_context(query, categories, products)
            log(f"Response: {response}")
            if response:
                log(f"Query Type: {response.query_type}")
        except Exception as e:
            log(f"Error parse_with_context: {e}")

if __name__ == "__main__":
    debug_llm()
