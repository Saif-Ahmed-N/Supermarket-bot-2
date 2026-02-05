import React from 'react';
import { Plus, Minus, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import SafeImage from '../ui/SafeImage';

const ProductCard = ({ product }) => {
  const { cart, updateQuantity } = useCart();

  // Find if this specific item (id + unit) is already in the cart
  const cartItem = cart.find(item => item.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleIncrement = () => {
    updateQuantity(product, quantity + 1);
  };

  const handleDecrement = () => {
    updateQuantity(product, quantity - 1);
  };

  return (
    <div className="flex-shrink-0 w-48 bg-white border border-purple-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-purple-300 transition-all duration-300 flex flex-col group relative">
      
      {/* 1. Image Area */}
      <div className="h-32 relative overflow-hidden bg-purple-50">
        <SafeImage 
            src={product.image} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Veg/Non-Veg Indicator */}
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-1 rounded shadow-sm border border-purple-100">
            <div className={`w-2.5 h-2.5 rounded-full ${product.isVeg ? 'bg-green-600' : 'bg-red-600'}`}></div>
        </div>

        {/* Discount Badge */}
        {product.originalPrice > product.price && (
            <div className="absolute top-2 left-0 bg-fuchsia-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-r shadow-sm">
                OFF
            </div>
        )}
      </div>

      {/* 2. Content Area */}
      <div className="p-3 flex-1 flex flex-col">
        {/* Brand & Name */}
        <div className="mb-2">
            <p className="text-[10px] font-bold text-purple-400 uppercase tracking-wider truncate">{product.brand}</p>
            <h3 className="text-sm font-bold text-purple-900 leading-tight line-clamp-2 h-9" title={product.name}>
                {product.name}
            </h3>
        </div>

        {/* Unit & Price */}
        <div className="flex justify-between items-end mt-auto mb-3">
            <div className="flex flex-col">
                <span className="text-[10px] font-medium text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded w-max border border-slate-100">
                    {product.unit}
                </span>
                <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-sm font-extrabold text-slate-900">₹{product.price}</span>
                    {product.originalPrice > product.price && (
                        <span className="text-[10px] text-slate-400 line-through">₹{product.originalPrice}</span>
                    )}
                </div>
            </div>
        </div>

        {/* 3. Action Buttons (THE FIX) */}
        {quantity === 0 ? (
            <button 
                onClick={handleIncrement}
                className="w-full py-2 bg-purple-100 hover:bg-purple-900 hover:text-white text-purple-700 rounded-lg text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1 active:scale-95 border border-purple-200 hover:border-purple-900"
            >
                ADD <Plus size={14} strokeWidth={3}/>
            </button>
        ) : (
            <div className="flex items-center justify-between bg-purple-900 rounded-lg p-1 shadow-md text-white h-8">
                <button 
                    onClick={handleDecrement} 
                    className="w-7 h-full flex items-center justify-center hover:bg-purple-800 rounded transition-colors active:scale-90"
                >
                    <Minus size={14} strokeWidth={3}/>
                </button>
                
                <span className="text-xs font-bold w-6 text-center">{quantity}</span>
                
                <button 
                    onClick={handleIncrement} 
                    className="w-7 h-full flex items-center justify-center hover:bg-purple-800 rounded transition-colors active:scale-90"
                >
                    <Plus size={14} strokeWidth={3}/>
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;