// src/components/widgets/DashboardWidget.jsx
import React from 'react';
import { Clock, Star, ChevronRight, Plus } from 'lucide-react';
import SafeImage from '../ui/SafeImage';
import { useCart } from '../../context/CartContext';

const DashboardWidget = ({ historyItems, essentialItems }) => {
  const { cart, updateQuantity, setIsCartOpen } = useCart();

  const handleReorderHistory = () => {
    historyItems.forEach(item => {
      const existing = cart.find(c => c.id === item.id);
      const newQty = existing ? existing.quantity + 1 : 1;
      updateQuantity(item, newQty);
    });
    setIsCartOpen(true);
  };

  const handleAddEssential = (item) => {
      const existing = cart.find(c => c.id === item.id);
      const newQty = existing ? existing.quantity + 1 : 1;
      updateQuantity(item, newQty);
  };

  return (
    <div className="flex flex-col gap-4 w-full mt-2">
      
      {/* 1. Daily Essentials (Top Row for quick access) */}
      <div className="bg-emerald-50/50 rounded-xl p-3 border border-emerald-100">
         <div className="flex items-center gap-2 mb-2">
            <Star size={16} className="text-emerald-600"/>
            <h3 className="font-bold text-gray-800 text-xs tracking-wide uppercase">Quick Essentials</h3>
         </div>
         <div className="flex gap-3 overflow-x-auto scrollbar-hide">
            {essentialItems.map((item) => (
                <button key={item.id} onClick={() => handleAddEssential(item)} className="flex-shrink-0 flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-emerald-100 shadow-sm hover:border-emerald-300 transition-colors">
                    <SafeImage src={item.image} className="w-8 h-8 rounded-md bg-gray-100"/>
                    <span className="text-sm font-bold text-gray-700 whitespace-nowrap">{item.name}</span>
                    <Plus size={14} className="text-emerald-600"/>
                </button>
            ))}
         </div>
      </div>

      {/* 2. Last Order (The Huge List - Compact Grid) */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm flex flex-col">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-gray-600"/>
            <h3 className="font-bold text-gray-900 text-sm">PREVIOUS ORDER ({historyItems.length})</h3>
          </div>
          <button onClick={handleReorderHistory} className="text-xs font-bold bg-gray-900 text-white px-3 py-1.5 rounded-lg hover:bg-black transition-colors flex items-center gap-1">
             Reorder All <ChevronRight size={12}/>
          </button>
        </div>
        
        {/* Horizontal Scrollable Grid for 50 items */}
        <div className="p-3 overflow-x-auto">
            <div className="grid grid-rows-2 grid-flow-col gap-3 w-max"> 
            {/* grid-rows-2 makes it 2 rows high, flowing horizontally => compact */}
                {historyItems.map((item) => (
                    <div key={item.id} className="w-40 flex items-center gap-3 p-2 border border-gray-100 rounded-xl bg-gray-50/50">
                        <SafeImage src={item.image} className="w-10 h-10 rounded-lg object-cover bg-white border border-gray-200 shadow-sm flex-shrink-0" />
                        <div className="min-w-0">
                            <p className="text-xs font-bold text-gray-700 truncate">{item.name}</p>
                            <p className="text-[10px] text-gray-500">₹{item.price}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardWidget;