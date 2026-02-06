from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class OrderItemBase(BaseModel):
    product_id: int
    product_name: str
    quantity: int
    price: float
    weight: Optional[str] = None
    image_url: Optional[str] = None

class OrderItemCreate(OrderItemBase):
    pass

class OrderItem(OrderItemBase):
    id: int
    order_id: int
    class Config:
        from_attributes = True

class OrderBase(BaseModel):
    user_id: str
    user_name: str
    total_amount: float

class OrderCreate(OrderBase):
    items: List[OrderItemCreate]

class Order(OrderBase):
    id: int
    created_at: datetime
    status: str
    items: List[OrderItem] = []
    class Config:
        from_attributes = True

class ProductBase(BaseModel):
    product: str
    category: str
    sub_category: str
    brand: str
    sale_price: float
    market_price: float
    type: str
    rating: Optional[float] = None
    description: Optional[str] = None
    
    # New Fields
    weight_str: Optional[str] = None
    unit_type: Optional[str] = None
    is_veg: Optional[bool] = True
    image_url: Optional[str] = None

class Product(ProductBase):
    index: int

    class Config:
        from_attributes = True
