from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
from . import models, schemas, database

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

# Trigger Reload V2


# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development, allow all. In production, specify frontend URL.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to Supermarket Bot API"}

@app.get("/products", response_model=List[schemas.Product])
def read_products(skip: int = 0, limit: int = 100, search: Optional[str] = None, category: Optional[str] = None, db: Session = Depends(database.get_db)):
    query = db.query(models.Product)
    if search:
        query = query.filter(models.Product.product.ilike(f"%{search}%"))
    if category:
        query = query.filter(models.Product.category == category)
    
    return query.offset(skip).limit(limit).all()

@app.get("/products/{product_id}", response_model=schemas.Product)
def read_product(product_id: int, db: Session = Depends(database.get_db)):
    db_product = db.query(models.Product).filter(models.Product.index == product_id).first()
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product

@app.get("/categories")
def read_categories(db: Session = Depends(database.get_db)):
    # Distinct categories
    return [r[0] for r in db.query(models.Product.category).distinct()]

# ============= LangChain Chat Integration =============
from pydantic import BaseModel
from .llm_service import ChatbotLLMService
from .llm_schemas import QueryType
from .langchain_agents import create_agent

# Initialize LLM service (singleton pattern)
llm_service = None

def get_llm_service():
    global llm_service
    if llm_service is None:
        try:
            llm_service = ChatbotLLMService()
        except ValueError as e:
            print(f"Warning: LLM service not initialized - {str(e)}")
            return None
    return llm_service

class ChatQuery(BaseModel):
    message: str = "User query to process"

@app.post("/api/chat")
def process_chat_query(query: ChatQuery, db: Session = Depends(database.get_db)):
    """
    Process user query using LangChain LLM and return structured response.
    
    Supports three types of queries:
    1. PRICE_QUERY: What is the price of tomato?
    2. CART_ADD: Add 5 tomatoes to the cart
    3. CATEGORY_FILTER: Give me beauty products
    
    Returns JSON with query_type, action, and relevant data
    """
    
    service = get_llm_service()
    if service is None:
        return {
            "error": "LLM service not available",
            "query_type": "UNKNOWN",
            "message": "Chat service is temporarily unavailable. Please try the regular search."
        }
    
    try:
        # Get available categories and products for context
        categories = [r[0] for r in db.query(models.Product.category).distinct().all()]
        sample_products = [r[0] for r in db.query(models.Product.product).limit(30).all()]

        # Create DB-aware agent and delegate the query
        agent = create_agent(service, db, categories, sample_products)
        agent_result = agent.run_query(query.message)

        # Return agent result directly (already contains messages and product rows)
        return agent_result
    
    except Exception as e:
        print(f"Error in chat endpoint: {str(e)}")
        return {
            "error": str(e),
            "query_type": "UNKNOWN",
            "message": "An error occurred while processing your request. Please try again."
        }

# ======================================================

@app.post("/orders", response_model=schemas.Order)
def create_order(order: schemas.OrderCreate, db: Session = Depends(database.get_db)):
    db_order = models.Order(
        user_id=order.user_id,
        user_name=order.user_name,
        total_amount=order.total_amount,
        status="Completed"
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)

    for item in order.items:
        db_item = models.OrderItem(
            order_id=db_order.id,
            product_id=item.product_id,
            product_name=item.product_name,
            quantity=item.quantity,
            price=item.price,
            weight=item.weight,
            image_url=item.image_url
        )
        db.add(db_item)
    
    db.commit()
    db.refresh(db_order)
    return db_order

@app.get("/orders/{user_id}", response_model=List[schemas.Order])
def read_orders(user_id: str, db: Session = Depends(database.get_db)):
    # Get last 5 orders, newest first
    return db.query(models.Order).filter(models.Order.user_id == user_id).order_by(models.Order.created_at.desc()).limit(5).all()
