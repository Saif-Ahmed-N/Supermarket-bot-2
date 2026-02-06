// src/components/widgets/ProductCard.jsx
import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import SafeImage from '../ui/SafeImage';
import { useCart } from '../../context/CartContext';

const ProductCard = ({ product }) => {
  const { cart, updateQuantity } = useCart();
  
  const defaultWeight = product.unitType === 'kg' ? '1kg' : (product.unitType === 'l' ? '1L' : 'Pack');
  const [selectedWeight, setSelectedWeight] = useState(defaultWeight);

  // --- VARIANT MATCHING FIX ---
  // We must find the specific variant in the cart to show correct quantity
  const variantId = `${product.id}-${selectedWeight}`;
  const cartItem = cart.find(c => `${c.id}-${c.selectedWeight || 'std'}` === variantId);

  const calculatePrice = (weight) => {
      if (product.unitType === 'pc') return product.price;
      const base = product.perUnitSellingPrice || product.price; 
      let multiplier = 1;
      if (weight === '500g' || weight === '500ml') multiplier = 0.55;
      if (weight === '250g' || weight === '250ml') multiplier = 0.30;
      return Math.floor(base * multiplier);
  };

  const currentPrice = calculatePrice(selectedWeight);

  const handleAddToCart = () => {
      const productToAdd = {
          ...product,
          selectedWeight: selectedWeight,
          price: currentPrice
      };
      updateQuantity(productToAdd, 1);
  };

  const handleIncrement = () => {
      const productToUpdate = {
          ...product,
          selectedWeight: selectedWeight,
          price: currentPrice
      };
      updateQuantity(productToUpdate, (cartItem?.quantity || 0) + 1);
  };

  const handleDecrement = () => {
      const productToUpdate = {
          ...product,
          selectedWeight: selectedWeight,
          price: currentPrice
      };
      updateQuantity(productToUpdate, (cartItem?.quantity || 0) - 1);
  };

  const WeightPill = ({ label, val }) => (
      <button 
          onClick={(e) => { e.stopPropagation(); setSelectedWeight(val); }}
          className={`flex-1 py-1 text-[10px] font-bold rounded transition-all ${
              selectedWeight === val 
              ? 'bg-white text-blue-700 shadow-sm border border-blue-100' 
              : 'text-slate-400 hover:text-slate-600'
          }`}
      >
          {label}
      </button>
  );

  return (
    <div className="flex-shrink-0 w-52 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden group hover:shadow-md transition-all hover:border-blue-200">
      <div className="h-32 bg-slate-50 relative overflow-hidden">
        <SafeImage src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-1 rounded shadow-sm border border-slate-100">
             <div className={`w-2.5 h-2.5 rounded-full ${product.isVeg ? 'bg-green-600' : 'bg-red-600'}`}></div>
        </div>

        {product.discount > 0 && (
            <div className="absolute bottom-2 left-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                {product.discount}% OFF
            </div>
        )}
      </div>

      <div className="p-3.5 flex flex-col gap-2">
        <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{product.brand}</p>
            <h4 className="font-bold text-slate-900 text-sm truncate leading-tight">{product.baseName}</h4>
        </div>

        {(product.unitType === 'kg' || product.unitType === 'l') && (
            <div className="flex bg-slate-100 p-0.5 rounded-lg">
                <WeightPill label="250" val={product.unitType === 'kg' ? '250g' : '250ml'} />
                <WeightPill label="500" val={product.unitType === 'kg' ? '500g' : '500ml'} />
                <WeightPill label={product.unitType === 'kg' ? '1kg' : '1L'} val={product.unitType === 'kg' ? '1kg' : '1L'} />
            </div>
        )}

        <div className="flex items-center justify-between mt-1">
            <div className="flex flex-col">
                <span className="text-lg font-extrabold text-slate-900">₹{currentPrice}</span>
                {product.discount > 0 && (
                    <span className="text-[10px] text-slate-400 line-through">
                        ₹{Math.floor(product.perUnitOriginalPrice * (currentPrice/product.perUnitSellingPrice))}
                    </span>
                )}
            </div>

            {cartItem ? (
                <div className="flex items-center bg-blue-700 rounded-lg p-1 shadow-md">
                    <button onClick={handleDecrement} className="w-6 h-6 flex items-center justify-center text-white hover:bg-blue-600 rounded"><Minus size={14}/></button>
                    <span className="font-bold text-white text-xs w-5 text-center">{cartItem.quantity}</span>
                    <button onClick={handleIncrement} className="w-6 h-6 flex items-center justify-center text-white hover:bg-blue-600 rounded"><Plus size={14}/></button>
                </div>
            ) : (
                <button 
                    onClick={handleAddToCart} 
                    className="px-3 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-1.5"
                >
                    ADD <Plus size={14}/>
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;