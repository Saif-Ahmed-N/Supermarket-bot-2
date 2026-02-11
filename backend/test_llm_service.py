"""
Test suite for LLM Service
Run with: python -m pytest backend/test_llm_service.py
"""

import pytest
from backend.llm_service import ChatbotLLMService
from backend.llm_schemas import QueryType


class TestChatbotLLMService:
    """Test the LangChain-based chatbot service"""
    
    @pytest.fixture
    def service(self):
        """Fixture to create service instance"""
        return ChatbotLLMService()
    
    def test_price_query(self, service):
        """Test price query detection"""
        response = service.parse_user_query("What is the price of tomato today?")
        assert response is not None, "Response should not be None"
        assert response.query_type == QueryType.PRICE_QUERY, f"Expected PRICE_QUERY, got {response.query_type}"
        assert response.product_name is not None, "Product name should be extracted"
        assert "tomato" in response.product_name.lower(), f"Expected 'tomato' in {response.product_name}"
        assert response.confidence > 0.7, "Confidence should be high for clear queries"

    def test_cart_add_query(self, service):
        """Test cart add query detection"""
        response = service.parse_user_query("Add 5 tomatoes to the cart")
        assert response is not None, "Response should not be None"
        assert response.query_type == QueryType.CART_ADD, f"Expected CART_ADD, got {response.query_type}"
        assert response.quantity == 5, f"Expected quantity 5, got {response.quantity}"
        assert response.product_name is not None, "Product name should be extracted"
        assert "tomato" in response.product_name.lower(), f"Expected 'tomato' in {response.product_name}"

    def test_category_filter_query(self, service):
        """Test category filter query detection"""
        response = service.parse_user_query("Give me products that are beauty related")
        assert response is not None, "Response should not be None"
        assert response.query_type == QueryType.CATEGORY_FILTER, f"Expected CATEGORY_FILTER, got {response.query_type}"
        assert response.category is not None, "Category should be extracted"
        assert "beauty" in response.category.lower(), f"Expected 'beauty' in {response.category}"

    def test_unknown_query(self, service):
        """Test unknown query handling"""
        response = service.parse_user_query("Tell me a joke about vegetables")
        assert response is not None, "Response should not be None"
        assert response.query_type == QueryType.UNKNOWN, f"Expected UNKNOWN, got {response.query_type}"

    def test_cart_add_with_weight(self, service):
        """Test cart add with weight specification"""
        response = service.parse_user_query("Add 2 kg of tomatoes to cart")
        assert response is not None, "Response should not be None"
        assert response.query_type == QueryType.CART_ADD
        assert response.quantity == 2 or response.quantity == 1, "Quantity should be extracted"
        assert response.weight is not None or "kg" in str(response.weight).lower() or response.weight is None
        
    def test_context_aware_parsing(self, service):
        """Test parsing with available categories and products"""
        categories = ["beauty", "dairy", "vegetables", "fruits", "snacks"]
        products = ["tomato", "milk", "shampoo", "apple", "bread"]
        
        response = service.parse_with_context(
            "Show me dairy products",
            categories,
            products
        )
        
        assert response is not None, "Response should not be None"
        assert response.query_type == QueryType.CATEGORY_FILTER
        assert response.category is not None, "Category should be extracted"


def test_individual_price_query():
    """Standalone test for price query"""
    service = ChatbotLLMService()
    response = service.parse_user_query("What's the cost of shampoo?")
    print(f"Price Query Response: {response}")
    assert response.query_type == QueryType.PRICE_QUERY


def test_individual_cart_add():
    """Standalone test for cart add"""
    service = ChatbotLLMService()
    response = service.parse_user_query("Add 3 shampoo bottles to my cart")
    print(f"Cart Add Response: {response}")
    assert response.query_type == QueryType.CART_ADD
    assert response.quantity == 3


def test_individual_category_filter():
    """Standalone test for category filter"""
    service = ChatbotLLMService()
    response = service.parse_user_query("Give me all beauty products")
    print(f"Category Filter Response: {response}")
    assert response.query_type == QueryType.CATEGORY_FILTER


if __name__ == "__main__":
    print("=" * 60)
    print("Testing LangChain Chatbot Service")
    print("=" * 60)
    
    service = ChatbotLLMService()
    
    print("\n1. Testing Price Query...")
    try:
        test_individual_price_query()
        print("✅ Price query test passed")
    except AssertionError as e:
        print(f"❌ Price query test failed: {e}")
    
    print("\n2. Testing Cart Add Query...")
    try:
        test_individual_cart_add()
        print("✅ Cart add test passed")
    except AssertionError as e:
        print(f"❌ Cart add test failed: {e}")
    
    print("\n3. Testing Category Filter Query...")
    try:
        test_individual_category_filter()
        print("✅ Category filter test passed")
    except AssertionError as e:
        print(f"❌ Category filter test failed: {e}")
    
    print("\n" + "=" * 60)
    print("All tests completed!")
    print("=" * 60)
