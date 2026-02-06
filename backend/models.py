from sqlalchemy import Column, Integer, String, Float, Text, Boolean
from .database import Base

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
    
    # New Fields for Enhanced Frontend
    weight_str = Column(String, index=True)
    unit_type = Column(String)
    is_veg = Column(Boolean, default=True)
    image_url = Column(String)

from sqlalchemy import ForeignKey, DateTime
from sqlalchemy.orm import relationship
import datetime

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True)
    user_name = Column(String)
    total_amount = Column(Float)
    status = Column(String, default="Completed")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    items = relationship("OrderItem", back_populates="order")

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    product_id = Column(Integer)
    product_name = Column(String)
    quantity = Column(Integer)
    price = Column(Float)
    weight = Column(String)
    image_url = Column(String)

    order = relationship("Order", back_populates="items")
