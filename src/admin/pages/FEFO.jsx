
import React, { useState } from 'react';
import { Download, AlertTriangle, DollarSign, CheckCircle2, Zap, Percent, Trash2, ArrowDownWideNarrow } from 'lucide-react';

const FEFO = ({ products, onApplyDiscount }) => {
    const [discountedIds, setDiscountedIds] = useState(new Set());
    const [toast, setToast] = useState(null);

    // Filter products for demo: Items with stock < 20 are "expiring"
    // TODO: Replace logic with actual expiry date from FastAPI backend
    const criticalItems = products.filter(p => p.stock > 0 && p.stock <= 20 && !discountedIds.has(p.id));

    const handleDiscount = (id) => {
        onApplyDiscount(id, 30);
        setDiscountedIds(prev => new Set([...prev, id]));
        setToast('30% Discount Applied Successfully');
        setTimeout(() => setToast(null), 3000);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 relative">
            {toast && (
                <div className="fixed top-20 right-8 z-[100] bg-[#7c3aed] text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right duration-300">
                    <Percent className="w-5 h-5" />
                    <span className="text-sm font-bold">{toast}</span>
                </div>
            )}

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div><h1 className="text-3xl font-black tracking-tight text-[#0e141b]">Expiry & Waste Management</h1><p className="text-gray-500 mt-1 font-medium">Prioritize products by Expiry (First-Expired, First-Out).</p></div>
                <button className="flex items-center gap-2 bg-[#7c3aed] text-white px-4 py-2.5 rounded-lg font-bold text-sm shadow-lg shadow-blue-100 hover:bg-[#7c3aed]/90 transition-all"><Download className="w-4 h-4" />Export Waste Report</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KpiCard label="Critical Risk" value={`${criticalItems.length} Items`} trend="+2 today" trendType="bad" icon={<AlertTriangle className="w-8 h-8 text-red-500" />} bgColor="bg-red-50" />
                <KpiCard label="Potential Waste Loss" value={`₹${(criticalItems.length * 450).toLocaleString('en-IN')}`} trend="Estimated" trendType="bad" icon={<DollarSign className="w-8 h-8 text-gray-500" />} bgColor="bg-gray-50" />
                <KpiCard label="Waste Reduction" value="12%" trend="Last 7 days" trendType="good" icon={<CheckCircle2 className="w-8 h-8 text-emerald-500" />} bgColor="bg-emerald-50" />
            </div>

            {criticalItems.length > 0 && (
                <div className="rounded-xl border-l-8 border-amber-500 bg-amber-50/50 p-6 shadow-sm border border-gray-100 overflow-hidden animate-pulse-once">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                        <div className="flex items-start gap-4">
                            <div className="bg-amber-500 text-white p-2.5 rounded-lg mt-0.5"><Zap className="w-6 h-6" /></div>
                            <div className="space-y-1">
                                <h3 className="text-[#0e141b] text-lg font-black leading-tight">Smart Alert: {criticalItems[0].name} expires soon</h3>
                                <p className="text-gray-600 text-sm font-medium">Immediate action recommended. The chatbot can auto-notify loyal dairy customers if discounted.</p>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0">
                            <button onClick={() => handleDiscount(criticalItems[0].id)} className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-emerald-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-md shadow-emerald-100 hover:bg-emerald-700 transition-all whitespace-nowrap"><Percent className="w-4 h-4" />Apply 30% Discount</button>
                            <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 border-2 border-red-500 text-red-500 px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-red-50 transition-all whitespace-nowrap"><Trash2 className="w-4 h-4" />Mark as Waste</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center gap-2"><ArrowDownWideNarrow className="w-5 h-5 text-[#7c3aed]" /><h2 className="text-[#0e141b] text-lg font-bold">FEFO Management Queue</h2></div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 text-gray-500 text-[10px] font-bold uppercase tracking-widest border-b border-gray-100">
                            <tr><th className="px-6 py-4">Product</th><th className="px-6 py-4">Batch</th><th className="px-6 py-4">Expiry</th><th className="px-6 py-4 text-center">Stock</th><th className="px-6 py-4">Actions</th></tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {criticalItems.map(item => (
                                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4"><div className="flex items-center gap-3"><img src={item.image} className="h-8 w-8 rounded-lg object-cover" /><span className="font-bold text-sm text-[#0e141b]">{item.name}</span></div></td>
                                    <td className="px-6 py-4 font-mono text-xs text-gray-400">#BT-99{item.id}0</td>
                                    <td className="px-6 py-4"><span className="text-sm font-bold text-red-600">In 2 Days</span></td>
                                    <td className="px-6 py-4 text-center font-black text-sm">{item.stock}</td>
                                    <td className="px-6 py-4"><button onClick={() => handleDiscount(item.id)} className="text-[#7c3aed] text-xs font-bold hover:underline">Apply Discount</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {criticalItems.length === 0 && <div className="p-12 text-center text-gray-400 font-bold uppercase text-xs tracking-widest">No Critical Expiry Alerts</div>}
                </div>
            </div>
        </div>
    );
};

const KpiCard = ({ label, value, trend, trendType, icon, bgColor }) => (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
        <div className={`absolute -right-3 -top-3 ${bgColor} p-6 rounded-full group-hover:scale-110 transition-transform`}>{icon}</div>
        <div className="relative z-10"><p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">{label}</p><p className="text-[#0e141b] text-3xl font-black mb-2">{value}</p><p className={`text-xs font-bold ${trendType === 'bad' ? 'text-red-500' : 'text-emerald-500'}`}>{trend}</p></div>
    </div>
);

export default FEFO;
