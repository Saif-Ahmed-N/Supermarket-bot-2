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

      {/* 1. Daily Essentials (Updated to Fuchsia/Cosmic Theme) */}
      <div className="bg-fuchsia-50 rounded-xl p-3 border border-fuchsia-100">
        <div className="flex items-center gap-2 mb-2">
          <Star size={16} className="text-fuchsia-600" />
          <h3 className="font-bold text-purple-900 text-xs tracking-wide uppercase">Cosmic Picks</h3>
        </div>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide">
          {essentialItems.map((item) => (
            <button key={item.id} onClick={() => handleAddEssential(item)} className="flex-shrink-0 flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-fuchsia-100 shadow-sm hover:border-fuchsia-300 transition-colors">
              <SafeImage src={item.image} className="w-8 h-8 rounded-md bg-purple-50" />
              <span className="text-sm font-bold text-purple-800 whitespace-nowrap">{item.name}</span>
              <Plus size={14} className="text-fuchsia-600" />
            </button>
          ))}
        </div>
      </div>

      {/* 2. Last Order (Updated to Purple Theme) */}
      <div className="bg-white rounded-2xl border border-purple-200 overflow-hidden shadow-sm flex flex-col">
        <div className="bg-purple-50 px-4 py-3 border-b border-purple-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-purple-600" />
            <h3 className="font-bold text-purple-900 text-sm">PREVIOUS ORDER ({historyItems.length})</h3>
          </div>
          <button onClick={handleReorderHistory} className="text-xs font-bold bg-purple-900 text-white px-3 py-1.5 rounded-lg hover:bg-purple-800 transition-colors flex items-center gap-1">
            Reorder All <ChevronRight size={12} />
          </button>
        </div>

        {/* Horizontal Scrollable Grid */}
        <div className="p-3 overflow-x-auto">
          <div className="grid grid-rows-2 grid-flow-col gap-3 w-max">
            {historyItems.map((item) => (
              <div key={item.id} className="w-40 flex items-center gap-3 p-2 border border-purple-100 rounded-xl bg-purple-50/30">
                <SafeImage src={item.image} className="w-10 h-10 rounded-lg object-cover bg-white border border-purple-200 shadow-sm flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-purple-900 truncate">{item.name}</p>
                  <p className="text-[10px] text-purple-500">₹{item.price}</p>
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