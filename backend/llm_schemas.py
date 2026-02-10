from pydantic import BaseModel, Field
from typing import Optional, List
from enum import Enum

class QueryType(str, Enum):
    """Enum for different types of user queries"""
    PRICE_QUERY = "PRICE_QUERY"
    CART_ADD = "CART_ADD"
    CATEGORY_FILTER = "CATEGORY_FILTER"
    PRODUCT_SEARCH = "PRODUCT_SEARCH"
    PRICE_FILTER = "PRICE_FILTER"
    CHECKOUT = "CHECKOUT"
    UNKNOWN = "UNKNOWN"


class PriceQuery(BaseModel):
    """Schema for price-related queries"""
    query_type: QueryType = Field(default=QueryType.PRICE_QUERY)
    product_name: str = Field(description="The product name to search for")
    category: Optional[str] = Field(default=None, description="Optional category filter")


class CartAddQuery(BaseModel):
    """Schema for adding items to cart"""
    query_type: QueryType = Field(default=QueryType.CART_ADD)
    product_name: str = Field(description="The product to add")
    quantity: int = Field(description="Number of items to add", ge=1)
    weight: Optional[str] = Field(default=None, description="Optional weight specification like 500g, 1kg")


class CategoryFilterQuery(BaseModel):
    """Schema for filtering products by category"""
    query_type: QueryType = Field(default=QueryType.CATEGORY_FILTER)
    category: str = Field(description="The category to filter by (beauty, grocery, dairy, etc.)")
    limit: int = Field(default=5, description="Number of products to return")


class BotResponse(BaseModel):
    """Unified response schema for LLM output"""
    query_type: QueryType
    action: str = Field(description="What action to take")
    product_name: Optional[str] = Field(default=None, description="Product name if applicable")
    brand: Optional[str] = Field(default=None, description="Brand name if mentioned by user")
    quantity: Optional[int] = Field(default=None, description="Quantity if adding to cart")
    category: Optional[str] = Field(default=None, description="Category if filtering")
    weight: Optional[str] = Field(default=None, description="Weight specification if mentioned")
    limit: Optional[int] = Field(default=None, description="Number of products to return")
    min_price: Optional[float] = Field(default=None, description="Minimum price filter")
    max_price: Optional[float] = Field(default=None, description="Maximum price filter")
    confidence: float = Field(description="Confidence score 0-1", ge=0.0, le=1.0)

    @classmethod
    def parse_obj(cls, obj):
        # normalize query_type to uppercase
        if isinstance(obj, dict) and "query_type" in obj:
            if obj["query_type"]:
                obj["query_type"] = obj["query_type"].upper()
                # If invalid ENUM after uppercase, fallback to UNKNOWN
                if obj["query_type"] not in QueryType.__members__:
                    obj["query_type"] = "UNKNOWN"
        return super().parse_obj(obj)
