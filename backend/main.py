from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
from . import models, schemas, database
import random
from pydantic import BaseModel

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

# In-memory storage for OTPs
otp_storage = {}

class LoginRequest(BaseModel):
    mobile_number: str

class VerifyRequest(BaseModel):
    mobile_number: str
    otp: str
    name: str

@app.get("/")
def read_root():
    return {"message": "Welcome to Supermarket Bot API"}

@app.post("/send-otp")
def send_otp(request: LoginRequest):
    # 1. Generate 4 digit code
    otp = str(random.randint(1000, 9999))
    
    # 2. Store it
    otp_storage[request.mobile_number] = otp
    
    # 3. THE "CONSOLE LOG" TRICK
    print("\n" + "="*30)
    print(f" 📱 SMS SENT TO: {request.mobile_number}")
    print(f" 🔑 OTP CODE:    {otp}")
    print("="*30 + "\n")
    
    return {"message": "OTP sent successfully"}

@app.post("/verify-otp")
def verify_otp(request: VerifyRequest, db: Session = Depends(database.get_db)):
    stored_otp = otp_storage.get(request.mobile_number)
    
    if stored_otp and stored_otp == request.otp:
        otp_storage.pop(request.mobile_number, None) # Clear after use
        
        # PERSIST USER TO DATABASE
        db_user = db.query(models.User).filter(models.User.mobile_number == request.mobile_number).first()
        if not db_user:
            db_user = models.User(mobile_number=request.mobile_number, name=request.name)
            db.add(db_user)
        else:
            db_user.name = request.name # Update name if changed
        
        db.commit()
        db.refresh(db_user)
        
        return {"status": "Success", "token": "fake-jwt-token", "user": {"id": db_user.id, "name": db_user.name}}
    
    raise HTTPException(status_code=400, detail="Incorrect OTP")

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

@app.get("/cart/{user_id}", response_model=List[schemas.CartItem])
def get_cart(user_id: str, db: Session = Depends(database.get_db)):
    return db.query(models.CartItem).filter(models.CartItem.user_id == user_id).all()

@app.post("/cart")
def sync_cart(cart_sync: schemas.CartSync, db: Session = Depends(database.get_db)):
    # 1. Clear existing cart for user
    db.query(models.CartItem).filter(models.CartItem.user_id == cart_sync.user_id).delete()
    
    # 2. Add new items
    for item in cart_sync.items:
        db_item = models.CartItem(
            user_id=cart_sync.user_id,
            product_id=item.product_id,
            product_name=item.product_name,
            quantity=item.quantity,
            price=item.price,
            weight=item.weight,
            image_url=item.image_url
        )
        db.add(db_item)
    
    db.commit()
    return {"status": "Success"}
