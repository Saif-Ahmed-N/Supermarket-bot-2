import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, Send, ShoppingBag, Plus, Minus, X, Search, ArrowRight, Clock, Grid, Sparkles, LayoutGrid, HelpCircle, CheckCircle, Store, Truck, Mic, Leaf, ChefHat, MapPin, Scale } from 'lucide-react';
import { CartProvider, useCart } from './context/CartContext';
import { useChatLogic } from './hooks/useChatLogic';
import { PRODUCT_DB, CATEGORIES } from './data/mockData';
import SafeImage from './components/ui/SafeImage';
import ProductCard from './components/widgets/ProductCard';
import DashboardWidget from './components/widgets/DashboardWidget';
// --- IMPORT LOGO ---
import logo from './assets/cosmocartt_logo.png';
import { User, Users } from 'lucide-react';

// --- STYLES ---
const FontStyles = () => (
  <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    body { font-family: 'Inter', sans-serif; background-color: #f3e8ff; margin: 0; } /* Light purple bg */
    .scrollbar-hide::-webkit-scrollbar { display: none; }
    .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
    @keyframes slide-up { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes slide-down { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
    .animate-message { animation: slide-up 0.3s ease-out forwards; }
    .animate-toast { animation: slide-down 0.3s ease-out forwards; }
  `}</style>
);

const AppWrapper = ({ children }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-purple-50 p-4">
    <FontStyles />
    <div className="w-full max-w-6xl h-[95vh] bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col relative border border-purple-200 ring-1 ring-purple-900/5">
      {children}
    </div>
  </div>
);

// --- 1. NEW WIDGET: STORE MAP ---
const MapWidget = ({ data }) => (
    <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 w-full max-w-xs shadow-sm">
        <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-purple-600 uppercase tracking-wide flex items-center gap-1"><MapPin size={12}/> Store Guide</span>
            <span className="text-xs font-bold text-purple-700 bg-purple-200 px-2 py-0.5 rounded">{data.aisle}</span>
        </div>
        <div className="h-40 bg-white rounded-lg border border-purple-100 relative flex items-center justify-center overflow-hidden">
            {/* SVG Store Layout Representation */}
            <svg viewBox="0 0 200 100" className="w-full h-full opacity-20">
                <rect x="10" y="10" width="30" height="80" fill="#6b21a8" rx="2"/>
                <rect x="50" y="10" width="30" height="80" fill="#6b21a8" rx="2"/>
                <rect x="90" y="10" width="30" height="80" fill="#6b21a8" rx="2"/>
                <rect x="130" y="10" width="30" height="80" fill="#6b21a8" rx="2"/>
                <rect x="170" y="10" width="20" height="80" fill="#6b21a8" rx="2"/>
                <path d="M 10 50 L 190 50" stroke="#a855f7" strokeWidth="2" strokeDasharray="4"/>
            </svg>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center animate-bounce">
                <MapPin size={32} className="text-fuchsia-600 fill-fuchsia-600 drop-shadow-md"/>
                <span className="text-[10px] font-bold text-purple-900 bg-white px-2 py-0.5 rounded shadow-sm border border-purple-100 mt-1 whitespace-nowrap">{data.category}</span>
            </div>
        </div>
    </div>
);

// --- 2. NEW WIDGET: COMPARISON TABLE ---
const ComparisonWidget = ({ products }) => (
    <div className="bg-white border border-purple-100 rounded-xl overflow-hidden mt-4 w-full max-w-md shadow-sm">
        <div className="bg-purple-50 px-4 py-3 border-b border-purple-100 flex items-center gap-2">
            <Scale size={16} className="text-purple-500"/>
            <span className="text-xs font-bold text-purple-800 uppercase">Cosmic Comparison</span>
        </div>
        <div className="grid grid-cols-3 bg-purple-50/50 border-b border-purple-100 p-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            <span>Feature</span>
            <span className="text-center truncate px-1">{products[0].name.split(' ')[0]}</span>
            <span className="text-center truncate px-1">{products[1].name.split(' ')[0]}</span>
        </div>
        <div className="divide-y divide-purple-50 text-sm">
            <div className="grid grid-cols-3 p-3 hover:bg-purple-50">
                <span className="text-slate-500 font-medium">Price</span>
                <span className="text-center font-bold text-purple-900">₹{products[0].price}</span>
                <span className="text-center font-bold text-purple-900">₹{products[1].price}</span>
            </div>
            <div className="grid grid-cols-3 p-3 hover:bg-purple-50">
                <span className="text-slate-500 font-medium">Calories</span>
                <span className="text-center text-slate-700">{products[0].nutrition?.cal || '-'}</span>
                <span className="text-center text-slate-700">{products[1].nutrition?.cal || '-'}</span>
            </div>
            <div className="grid grid-cols-3 p-3 hover:bg-purple-50">
                <span className="text-slate-500 font-medium">Sugar</span>
                <span className="text-center text-slate-700">{products[0].nutrition?.sugar || '-'}</span>
                <span className="text-center text-slate-700">{products[1].nutrition?.sugar || '-'}</span>
            </div>
        </div>
    </div>
);

// --- 3. NEW WIDGET: RECIPE CARD ---
const RecipeCard = ({ recipe, onAdd }) => {
    const [servings, setServings] = useState(recipe.baseServings || 2);

    const handleServingChange = (delta) => {
        setServings(prev => Math.max(1, prev + delta));
    };

    return (
        <div className="flex-shrink-0 w-72 bg-white border border-purple-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group">
            <div className="h-32 relative overflow-hidden">
                <SafeImage src={recipe.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"/>
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/90 via-transparent to-transparent"/>
                <span className="absolute bottom-2 left-3 text-white font-bold text-lg leading-tight shadow-black drop-shadow-md">{recipe.name}</span>
            </div>
            <div className="p-4">
                {/* Meta Tags */}
                <div className="flex justify-between text-xs text-slate-500 mb-4 font-medium bg-purple-50 p-2 rounded-lg border border-purple-100">
                    <span className="flex items-center gap-1"><Clock size={12}/> {recipe.time}</span>
                    <span className="flex items-center gap-1"><Sparkles size={12} className="text-fuchsia-500"/> {parseInt(recipe.calories)*servings} kcal</span>
                </div>

                {/* Servings Control - NEW FEATURE */}
                <div className="flex items-center justify-between mb-4 bg-slate-50 rounded-lg p-2 border border-slate-100">
                    <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1"><Users size={12}/> Servings</span>
                    <div className="flex items-center gap-3">
                        <button onClick={() => handleServingChange(-1)} className="w-6 h-6 flex items-center justify-center bg-white rounded border border-slate-200 shadow-sm hover:text-red-500"><Minus size={12}/></button>
                        <span className="font-bold text-purple-900 w-4 text-center">{servings}</span>
                        <button onClick={() => handleServingChange(1)} className="w-6 h-6 flex items-center justify-center bg-white rounded border border-slate-200 shadow-sm hover:text-green-600"><Plus size={12}/></button>
                    </div>
                </div>

                <p className="text-[11px] text-slate-500 mb-4 line-clamp-2 h-8">
                    <span className="font-bold text-purple-900">Items:</span> {recipe.ingredients.map(i => i.searchTerm).join(', ')}
                </p>

                <button 
                    onClick={() => onAdd(recipe, servings)} 
                    className="w-full py-3 bg-purple-900 text-white rounded-xl text-xs font-bold hover:bg-purple-800 flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md"
                >
                    Add Items for {servings} People <Plus size={14}/>
                </button>
            </div>
        </div>
    );
};

// --- TOAST NOTIFICATION ---
const ToastNotification = () => {
    const { toast, updateQuantity } = useCart();
    if (!toast) return null;
    return (
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-50 animate-toast w-max max-w-sm">
            <div className="bg-purple-900 text-white pl-4 pr-3 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-purple-700">
                <CheckCircle size={20} className="text-fuchsia-400" />
                <div className="flex flex-col">
                    <span className="font-semibold text-sm mr-2">{toast.message}</span>
                </div>
                {toast.action && (
                    <button 
                        onClick={() => updateQuantity(toast.action.product, 1)}
                        className="bg-fuchsia-600 hover:bg-fuchsia-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ml-2"
                    >
                        {toast.action.label}
                    </button>
                )}
            </div>
        </div>
    );
};

// --- ORDER SUMMARY CARD ---
const OrderSummaryCard = ({ data, onConfirm, onAbort }) => {
    return (
        <div className="bg-white border border-purple-200 rounded-xl overflow-hidden mt-4 w-full max-w-lg shadow-lg ring-1 ring-black/5">
            <div className="bg-purple-100 px-5 py-4 border-b border-purple-200 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-200 rounded-lg text-purple-800">
                        {data.mode === 'Store Pickup' ? <Store size={20}/> : <Truck size={20}/>}
                    </div>
                    <div>
                        <h3 className="font-bold text-sm text-purple-900 uppercase tracking-wide">{data.mode}</h3>
                        <p className="text-[11px] text-purple-600 font-semibold">{data.details}</p>
                    </div>
                </div>
            </div>
            <div className="max-h-60 overflow-y-auto bg-white p-0">
                <table className="w-full text-sm text-left">
                    <thead className="bg-purple-50 text-purple-500 font-bold text-xs uppercase tracking-wide border-b border-purple-100 sticky top-0">
                        <tr>
                            <th className="py-3 px-4">Product</th>
                            <th className="py-3 px-4">Spec</th>
                            <th className="py-3 px-4 text-center">Qty</th>
                            <th className="py-3 px-4 text-right">Price</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-purple-50">
                        {data.items.map((item, idx) => (
                            <tr key={idx} className="hover:bg-purple-50/50 transition-colors">
                                <td className="py-3 px-4 font-semibold text-slate-800">{item.name}</td>
                                <td className="py-3 px-4 text-slate-600 font-medium">
                                    <span className="bg-slate-100 px-2 py-0.5 rounded text-xs border border-slate-200">{item.selectedWeight || 'Std'}</span>
                                </td>
                                <td className="py-3 px-4 text-center font-bold text-purple-900">{item.quantity}</td>
                                <td className="py-3 px-4 text-right font-bold text-purple-700">₹{(item.price * item.quantity).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="bg-purple-50 p-4 border-t border-purple-200">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-semibold text-purple-500">Grand Total</span>
                    <span className="text-2xl font-extrabold text-purple-900">₹{data.total.toLocaleString()}</span>
                </div>
                <div className="flex gap-3">
                    <button onClick={onAbort} className="flex-1 py-3 border border-purple-300 rounded-lg text-purple-700 font-bold text-sm hover:bg-white hover:text-red-600 hover:border-red-200 transition-colors">
                        Edit Order
                    </button>
                    <button onClick={onConfirm} className="flex-1 py-3 bg-purple-700 text-white rounded-lg font-bold text-sm shadow-md hover:bg-purple-800 transition-transform active:scale-95 flex justify-center items-center gap-2">
                        Confirm & Pay
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- PREVIEW TABLE ---
const OrderPreviewTable = ({ initialItems, onConfirm }) => {
    const [items, setItems] = useState(initialItems);
    const handleQty = (id, delta) => {
        setItems(prev => prev.map(item => item.id === id ? { ...item, quantity: Math.max(0, (Number(item.quantity) || 0) + delta) } : item));
    };
    const handleWeightChange = (id, newWeight) => {
        setItems(prev => prev.map(item => {
            if (item.id === id) {
                let multiplier = 1;
                if (newWeight.includes('500')) multiplier = 0.55;
                if (newWeight.includes('250')) multiplier = 0.30;
                const newSellingPrice = Math.floor(item.perUnitSellingPrice * multiplier);
                const newOriginalPrice = Math.floor(item.perUnitOriginalPrice * multiplier);
                return { ...item, selectedWeight: newWeight, price: newSellingPrice, originalPrice: newOriginalPrice };
            }
            return item;
        }));
    };
    const totalCost = items.reduce((acc, item) => acc + (item.price * (item.quantity || 0)), 0);
    const totalCount = items.reduce((acc, item) => acc + (item.quantity || 0), 0);
    
    const WeightPill = ({ item, val, label }) => (
        <button onClick={() => handleWeightChange(item.id, val)} className={`px-2 py-1 rounded text-[10px] font-bold transition-all border ${item.selectedWeight === val ? 'bg-white text-purple-700 border-purple-200 shadow-sm' : 'text-slate-400 border-transparent hover:text-purple-600'}`}>{label}</button>
    );

    return (
        <div className="bg-white border border-purple-200 rounded-xl overflow-hidden mt-4 w-full max-w-xl shadow-lg ring-1 ring-black/5">
            <div className="bg-purple-50 px-5 py-3 border-b border-purple-200 flex justify-between items-center"><div className="flex items-center gap-2"><Clock size={16} className="text-purple-600"/><span className="font-bold text-xs text-purple-800 uppercase tracking-wider">Smart Reorder</span></div></div>
            <div className="max-h-80 overflow-y-auto bg-white">
                {items.map((item) => (
                    <div key={item.id} className={`flex items-center gap-3 p-3 border-b border-purple-50 transition-colors ${item.quantity === 0 ? 'opacity-50 bg-slate-50' : 'hover:bg-purple-50/50'}`}>
                        <div className="relative"><SafeImage src={item.image} className="w-14 h-14 rounded-lg object-cover bg-white border border-purple-100"/><div className="absolute -top-1 -right-1 bg-white border border-slate-200 p-0.5 rounded-sm"><div className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-700'}`}></div></div></div>
                        <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                            <div className="flex justify-between items-start">
                                <div><p className="text-xs font-bold text-purple-400 uppercase">{item.brand}</p><p className="text-sm font-bold text-slate-900 truncate w-32">{item.baseName}</p></div>
                                {(item.unitType === 'kg' || item.unitType === 'l') && (
                                    <div className="flex bg-slate-50 rounded-lg p-0.5 border border-purple-100">
                                        <WeightPill item={item} val={item.unitType === 'kg' ? '250g' : '250ml'} label="250" />
                                        <WeightPill item={item} val={item.unitType === 'kg' ? '500g' : '500ml'} label="500" />
                                        <WeightPill item={item} val={item.unitType === 'kg' ? '1kg' : '1L'} label={item.unitType === 'kg' ? '1kg' : '1L'} />
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-2"><span className="text-sm font-bold text-purple-900">₹{item.price}</span>{item.discount > 0 && <span className="text-xs text-slate-400 line-through">₹{item.originalPrice}</span>}</div>
                        </div>
                        <div className="flex items-center gap-2 bg-purple-50 rounded-lg p-1">
                            <button onClick={() => handleQty(item.id, -1)} className="w-7 h-7 flex items-center justify-center bg-white rounded border border-purple-200 shadow-sm hover:text-red-600 disabled:opacity-50"><Minus size={14}/></button>
                            <span className="w-6 text-center text-sm font-bold text-purple-900">{item.quantity}</span>
                            <button onClick={() => handleQty(item.id, 1)} className="w-7 h-7 flex items-center justify-center bg-white rounded border border-purple-200 shadow-sm hover:text-purple-600"><Plus size={14}/></button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="bg-purple-50 p-4 border-t border-purple-200">
                <div className="flex justify-between items-end mb-4"><div><p className="text-xs text-purple-500 font-semibold">Estimated Cost</p><p className="text-2xl font-extrabold text-purple-900">₹{totalCost.toLocaleString()}</p></div><div className="text-right"><p className="text-xs text-purple-500 font-semibold">{totalCount} items selected</p></div></div>
                <button onClick={() => onConfirm(items.filter(i => i.quantity > 0))} disabled={totalCount === 0} className="w-full py-3 bg-purple-700 text-white rounded-lg font-bold text-sm shadow-md hover:bg-purple-800 flex justify-center items-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"><ShoppingBag size={18}/> Add Selected to Cart</button>
            </div>
        </div>
    );
};

// --- QUICK ACTIONS BAR ---
const QuickActions = ({ onAction }) => (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide w-full px-6 pt-2 border-t border-purple-100 bg-purple-50/50">
        {[
            { label: 'Browse Store', icon: <LayoutGrid size={15}/>, action: 'Show Categories' },
            { label: 'Meal Ideas', icon: <ChefHat size={15}/>, action: 'Show Recipes' },
            { label: 'Order History', icon: <Clock size={15}/>, action: 'Show Last Order' },
            { label: 'Shopping Cart', icon: <ShoppingBag size={15}/>, action: 'View Cart' },
            { label: 'Support', icon: <HelpCircle size={15}/>, action: 'Help' },
        ].map((btn, idx) => (
            <button key={idx} onClick={() => onAction({ action: btn.action, label: btn.label })} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-purple-200 rounded-lg shadow-sm hover:border-purple-600 hover:text-purple-700 hover:shadow-md transition-all text-sm font-semibold text-purple-800 whitespace-nowrap active:scale-[0.98]">
                {btn.icon} {btn.label}
            </button>
        ))}
    </div>
);

const LoginScreen = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-purple-50 relative">
      <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-xl border border-purple-100">
        <div className="mb-8 text-center">
            {/* LOGO REPLACEMENT */}
            <img src={logo} alt="CosmoCart Logo" className="w-56 mx-auto mb-4 drop-shadow-lg" />
            <h1 className="text-xl font-bold text-purple-900 tracking-tight hidden">CosmoCart</h1>
            <p className="text-purple-500 mt-2 font-medium">Please authenticate to continue</p>
        </div>
        <div className="space-y-5">
            <input className="w-full bg-purple-50 border border-purple-200 p-4 rounded-lg outline-none focus:border-purple-600 font-semibold text-purple-900 placeholder:text-purple-300" placeholder="First Name (e.g. Sarah)" value={name} onChange={e => setName(e.target.value)} />
            <input className="w-full bg-purple-50 border border-purple-200 p-4 rounded-lg outline-none focus:border-purple-600 font-semibold text-purple-900 placeholder:text-purple-300" placeholder="Member ID (e.g. 101)" value={id} onChange={e => setId(e.target.value)} />
            <button onClick={() => onLogin(name, id)} className="w-full py-4 bg-purple-900 text-white rounded-lg font-bold text-lg shadow-lg hover:bg-purple-950 transition-all flex items-center justify-center gap-2">Access Dashboard <ArrowRight size={20} /></button>
        </div>
        <div className="mt-8 pt-6 border-t border-purple-100 flex justify-center"><span className="px-3 py-1 bg-purple-100 rounded text-xs font-mono text-purple-500 font-medium">DEMO: Sarah / 101</span></div>
      </div>
    </div>
  );
};

const ChatView = ({ user, onLogout }) => {
  const { messages, isTyping, isListening, startListening, handleUserMessage, initializeChat, handleOptionSelect, handleTableConfirm, handleRecipeAdd } = useChatLogic(user);
  const { cart, updateQuantity, isCartOpen, setIsCartOpen, cartCount, cartTotal, dietMode, setDietMode } = useCart();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isTyping]);
  useEffect(() => { initializeChat(); }, []);

  const onSend = (text) => { handleUserMessage(text); setInput(''); };

  return (
    <>
      <header className="px-6 h-20 border-b border-purple-100 flex justify-between items-center bg-white sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-4">
            {/* LOGO REPLACEMENT IN HEADER */}
            <img src={logo} alt="CosmoCart" className="h-10 w-auto object-contain" />
            <div>
                <button onClick={() => setDietMode(dietMode === 'all' ? 'veg' : 'all')} className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 transition-all ${dietMode === 'veg' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-purple-100 text-purple-500'}`}><Leaf size={10}/> {dietMode === 'veg' ? 'VEG ONLY' : 'ALL ITEMS'}</button>
            </div>
        </div>
        <div className="flex items-center gap-3">
             <button onClick={()=>setIsSearchOpen(true)} className="w-10 h-10 flex items-center justify-center rounded-lg border border-purple-100 hover:border-purple-500 hover:text-purple-600 text-purple-400 transition-colors"><Search size={20}/></button>
             <button onClick={()=>setIsCartOpen(true)} className="w-10 h-10 flex items-center justify-center rounded-lg bg-purple-900 hover:bg-purple-800 text-white shadow-lg transition-all relative"><ShoppingBag size={20}/>{cartCount > 0 && <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-fuchsia-600 rounded-full border-2 border-white text-[10px] flex items-center justify-center font-bold shadow-sm">{cartCount}</span>}</button>
             <button onClick={onLogout} className="ml-4 px-4 py-2 border border-purple-200 rounded-lg text-xs font-bold text-purple-600 hover:bg-purple-50 hover:text-purple-900 transition-colors">LOGOUT</button>
        </div>
      </header>

      <ToastNotification />

      <main className="flex-1 overflow-y-auto p-6 bg-purple-50/50 scroll-smooth">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.sender==='user' ? 'justify-end' : 'justify-start'} mb-8 animate-message`}> 
            {msg.sender === 'bot' && <div className="w-9 h-9 rounded-full bg-white border border-purple-200 flex items-center justify-center mr-4 flex-shrink-0 shadow-sm mt-1"><Sparkles size={16} className="text-purple-600"/></div>}
            <div className={`max-w-[85%] flex flex-col ${msg.sender==='user' ? 'items-end' : 'items-start'}`}>
              
              {/* MESSAGE BUBBLES */}
              {msg.content && <div className={`py-3.5 px-6 text-[15px] font-medium leading-relaxed shadow-sm ${msg.sender==='user' ? 'bg-purple-900 text-white rounded-2xl rounded-tr-sm' : 'bg-white text-slate-800 border border-purple-100 rounded-2xl rounded-tl-sm'}`}>{msg.content}</div>}

              {/* DYNAMIC WIDGET RENDERER */}
              {msg.type === 'map_view' && <MapWidget data={msg.data} />}
              {msg.type === 'comparison_card' && <ComparisonWidget products={msg.data} />}
              {msg.type === 'order_preview' && <OrderPreviewTable initialItems={msg.data} onConfirm={handleTableConfirm} />}
              {msg.type === 'order_summary' && <OrderSummaryCard data={msg.data} onConfirm={() => handleOptionSelect({ id: 'confirm_order', label: 'Confirming...' })} onAbort={() => handleOptionSelect({ id: 'abort_order', label: 'Edit Order' })} />}
              {msg.type === 'recipe_list' && <div className="mt-4 w-full flex gap-4 overflow-x-auto pb-4 px-1 scrollbar-hide">{msg.data.map(recipe => <RecipeCard key={recipe.id} recipe={recipe} onAdd={handleRecipeAdd} />)}</div>}
              {msg.type === 'options' && <div className="flex flex-wrap gap-2 mt-3">{msg.data.map(opt => <button key={opt.id} onClick={() => handleOptionSelect(opt)} className="px-6 py-3 bg-white border-2 border-purple-100 rounded-xl text-sm font-bold text-purple-800 hover:border-purple-600 hover:text-purple-900 hover:shadow-md transition-all active:scale-[0.98]">{opt.label}</button>)}</div>}
              {msg.type === 'carousel' && <div className="mt-4 w-full flex gap-4 overflow-x-auto pb-4 px-1 scrollbar-hide">{msg.data.map(p => <ProductCard key={p.id} product={p} />)}</div>}
              {msg.type === 'grid' && <div className="grid grid-cols-4 gap-3 mt-4 w-full">{CATEGORIES.map(c => <button key={c.id} onClick={() => onSend(`Show ${c.id}`)} className="group relative h-28 rounded-lg overflow-hidden bg-purple-200 shadow-sm border border-purple-200 hover:shadow-md hover:border-fuchsia-400 transition-all"><SafeImage src={c.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90" /><div className="absolute inset-0 bg-gradient-to-t from-purple-900/90 via-purple-900/20 to-transparent" /><span className="absolute bottom-3 left-3 text-white font-bold text-sm tracking-wide shadow-black/50 drop-shadow-md">{c.label}</span></button>)}</div>}
              {msg.type === 'dashboard' && <DashboardWidget historyItems={msg.data.history} essentialItems={msg.data.essentials} />}
            </div>
          </div>
        ))}
        {isTyping && <div className="ml-14 mb-4 flex gap-1.5"><div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"/><div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100"/><div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-200"/></div>}
        <div ref={messagesEndRef} className="h-4" />
      </main>

      <footer className="bg-white border-t border-purple-100 z-20 pb-6 pt-2">
        <QuickActions onAction={handleOptionSelect} />
        <div className="px-6 mt-3">
            <div className="flex gap-3 items-center bg-purple-50 rounded-xl px-2 py-2 border-2 border-purple-100 focus-within:bg-white focus-within:border-purple-600 focus-within:shadow-lg transition-all">
                <input className="flex-1 bg-transparent px-4 outline-none text-base text-purple-900 font-semibold h-11 placeholder:text-purple-300" placeholder={isListening ? "Listening..." : "Type 'Add Milk' or 'Recipes'..."} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && onSend(input)} />
                <button onClick={startListening} className={`w-11 h-11 rounded-lg flex items-center justify-center transition-all ${isListening ? 'bg-fuchsia-500 text-white animate-pulse' : 'text-purple-300 hover:text-purple-600 hover:bg-purple-100'}`}><Mic size={20}/></button>
                <button onClick={() => onSend(input)} disabled={!input.trim()} className="w-11 h-11 bg-purple-900 text-white rounded-lg shadow-md hover:bg-purple-800 transition-all flex items-center justify-center disabled:opacity-50 disabled:bg-slate-300"><ArrowRight size={20}/></button>
            </div>
        </div>
      </footer>

      {/* SEARCH OVERLAY */}
      {isSearchOpen && (
        <div className="absolute inset-0 z-50 bg-white/98 backdrop-blur-xl flex flex-col animate-message">
           <div className="p-6 flex gap-4 items-center border-b border-purple-100">
              <button onClick={()=>setIsSearchOpen(false)} className="w-10 h-10 rounded-full bg-purple-50 hover:bg-purple-100 flex items-center justify-center transition-colors"><ArrowRight className="rotate-180 text-purple-900" size={20}/></button>
              <input autoFocus value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder="Search catalogue..." className="flex-1 outline-none text-2xl font-bold text-purple-900 bg-transparent placeholder:text-purple-300"/>
          </div>
          <div className="flex-1 overflow-y-auto px-6 pb-6 pt-4">
              {searchQuery && <div className="grid grid-cols-1 gap-2">{PRODUCT_DB.filter(p=>p.name.toLowerCase().includes(searchQuery.toLowerCase())).map(p => <div key={p.id} onClick={()=>{onSend(`Add ${p.name}`); setIsSearchOpen(false); setSearchQuery('');}} className="flex items-center gap-4 p-4 border border-purple-100 rounded-xl hover:bg-purple-50 hover:border-purple-300 cursor-pointer transition-all bg-white shadow-sm"><SafeImage src={p.image} className="w-14 h-14 rounded-lg object-cover bg-purple-50 border border-purple-100"/><div><p className="font-bold text-purple-900 text-lg">{p.name}</p><p className="text-sm font-bold text-purple-700">₹{p.price}</p></div></div>)}</div>}
          </div>
        </div>
      )}

      {/* CART DRAWER */}
      {isCartOpen && (
        <div className="absolute inset-0 z-50 flex justify-end bg-purple-900/40 backdrop-blur-sm" onClick={()=>setIsCartOpen(false)}>
            <div className="w-full max-w-md h-full bg-white shadow-2xl flex flex-col animate-message p-0 border-l border-purple-200" onClick={e=>e.stopPropagation()}>
                <div className="p-6 border-b border-purple-100 flex justify-between items-center bg-purple-50/50"><h2 className="font-extrabold text-2xl text-purple-900 flex items-center gap-2"><ShoppingBag className="text-purple-700"/> Cart</h2><button onClick={()=>setIsCartOpen(false)} className="w-8 h-8 rounded-full bg-white border border-purple-200 hover:bg-purple-100 flex items-center justify-center text-purple-500"><X size={18}/></button></div>
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {cart.map(item => (
                        <div key={`${item.id}-${item.selectedWeight}`} className="flex gap-4 p-3 border border-purple-100 rounded-xl hover:border-purple-300 transition-colors bg-white shadow-sm">
                            <SafeImage src={item.image} className="w-20 h-20 rounded-lg object-cover bg-purple-50 border border-purple-100"/>
                            <div className="flex-1 flex flex-col justify-between py-1">
                                <div><p className="font-bold text-purple-900">{item.name} <span className="text-xs text-purple-400">({item.selectedWeight || 'Std'})</span></p><p className="text-sm font-semibold text-purple-500">Unit: ₹{item.price}</p></div>
                                <div className="flex items-center gap-3">
                                    <button onClick={() => updateQuantity(item, (item.quantity||1)-1)} className="w-8 h-8 rounded-lg border border-purple-200 flex items-center justify-center hover:bg-purple-50 hover:border-purple-300 transition-colors"><Minus size={14}/></button>
                                    <span className="font-bold w-6 text-center text-purple-900">{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item, (item.quantity||1)+1)} className="w-8 h-8 rounded-lg border border-purple-200 flex items-center justify-center hover:bg-purple-50 hover:border-purple-300 transition-colors"><Plus size={14}/></button>
                                </div>
                            </div>
                            <div className="font-extrabold text-purple-700 self-end text-lg">₹{(item.price * item.quantity).toLocaleString()}</div>
                        </div>
                    ))}
                </div>
                {cart.length > 0 && <div className="border-t border-purple-200 p-6 bg-purple-50"><div className="flex justify-between items-end mb-6"><span className="text-purple-500 font-bold uppercase text-sm tracking-wide">Total Amount</span><span className="text-3xl font-extrabold text-purple-900">₹{cartTotal.toLocaleString()}</span></div><button onClick={() => { setIsCartOpen(false); onSend("Proceed to Checkout"); }} className="w-full py-4 bg-purple-900 text-white rounded-xl font-bold text-lg shadow-lg hover:bg-purple-800 transition-all flex justify-between px-6 items-center active:scale-[0.99]"><span>Secure Checkout</span><ArrowRight size={22}/></button></div>}
            </div>
        </div>
      )}
    </>
  );
};

export default function App() {
  const [user, setUser] = useState(null);
  const handleLogin = (name, id) => { if (!name || !id) return alert('Please enter Name and ID'); setUser({ name, id }); };
  return <CartProvider><AppWrapper>{!user ? <LoginScreen onLogin={handleLogin} /> : <ChatView user={user} onLogout={() => setUser(null)} />}</AppWrapper></CartProvider>;
}