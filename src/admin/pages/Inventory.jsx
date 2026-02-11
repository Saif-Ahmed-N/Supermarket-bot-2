
import React, { useState } from 'react';
import { Plus, Edit, Trash2, Check, X, CheckCircle2, AlertTriangle } from 'lucide-react';

const Inventory = ({ products, onUpdateProduct }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [toast, setToast] = useState(null);

    // Row editing state
    const [editingId, setEditingId] = useState(null);
    const [editValues, setEditValues] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const startEditing = (product) => {
        setEditingId(product.id);
        setEditValues({ stock: product.stock, price: product.price });
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditValues(null);
    };

    // TODO: Replace with FastAPI call to update product stock and price
    const saveEditing = (id) => {
        if (editValues) {
            onUpdateProduct(id, { stock: editValues.stock, price: editValues.price });
            showToast('Product details updated successfully');
            setEditingId(null);
            setEditValues(null);
        }
    };

    const handleEditValueChange = (field, value) => {
        if (!editValues) return;
        const num = field === 'price' ? parseFloat(value) : parseInt(value);
        setEditValues({ ...editValues, [field]: isNaN(num) ? 0 : num });
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 relative">
            {toast && (
                <div className={`fixed top-20 right-8 z-[100] ${toast.type === 'success' ? 'bg-[#7c3aed]' : 'bg-slate-900'} text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right duration-300`}>
                    {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <AlertTriangle className="w-5 h-5 text-amber-400" />}
                    <span className="text-sm font-bold">{toast.message}</span>
                </div>
            )}

            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-black tracking-tight text-[#0e141b]">Product Inventory</h2>
                    <p className="text-gray-500 mt-1">Real-time stock control for all BotMart items.</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="bg-[#7c3aed] text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 shadow-lg shadow-blue-100 hover:bg-[#7c3aed]/90 transition-all">
                    <Plus className="w-5 h-5" />
                    Add Product
                </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr className="text-xs font-bold uppercase tracking-wider text-gray-500">
                                <th className="px-6 py-4 w-16">Item</th>
                                <th className="px-6 py-4">Details</th>
                                <th className="px-6 py-4">Price</th>
                                <th className="px-6 py-4 w-32 text-center">Stock</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {products.map(product => {
                                const isEditing = editingId === product.id;
                                return (
                                    <tr key={product.id} className={`transition-colors ${isEditing ? 'bg-blue-50/30' : 'hover:bg-gray-50/50'}`}>
                                        <td className="px-6 py-4">
                                            <img src={product.image} className="w-10 h-10 rounded-lg object-cover border" alt={product.name} />
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-sm text-[#0e141b]">{product.name}</p>
                                            <p className="text-[11px] text-gray-400">{product.sku}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            {isEditing ? (
                                                <div className="relative">
                                                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">₹</span>
                                                    <input
                                                        type="number"
                                                        step="1"
                                                        value={editValues?.price}
                                                        onChange={(e) => handleEditValueChange('price', e.target.value)}
                                                        className="w-24 pl-5 pr-2 py-1.5 bg-white border border-[#7c3aed] rounded-lg text-sm font-black focus:ring-2 focus:ring-[#7c3aed]/20 outline-none transition-all"
                                                    />
                                                </div>
                                            ) : (
                                                <span className="font-bold text-sm text-[#7c3aed]">₹{product.price.toFixed(2)}</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col items-center gap-1">
                                                {isEditing ? (
                                                    <input
                                                        type="number"
                                                        value={editValues?.stock}
                                                        onChange={(e) => handleEditValueChange('stock', e.target.value)}
                                                        className="w-20 bg-white border border-[#7c3aed] rounded-lg px-2 py-1.5 text-sm font-black text-center focus:ring-2 focus:ring-[#7c3aed]/20 outline-none transition-all"
                                                    />
                                                ) : (
                                                    <div className="w-20 bg-gray-50 border border-gray-100 rounded-lg px-2 py-1 text-sm font-black text-center text-slate-700">
                                                        {product.stock}
                                                    </div>
                                                )}
                                                {product.stock <= 20 && product.stock > 0 && !isEditing && (
                                                    <span className="text-[9px] font-black text-amber-500 uppercase tracking-tighter">Low Stock</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${product.stock > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {isEditing ? (
                                                    <>
                                                        <button
                                                            onClick={() => saveEditing(product.id)}
                                                            className="p-1.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all shadow-sm"
                                                            title="Save Changes"
                                                        >
                                                            <Check className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={cancelEditing}
                                                            className="p-1.5 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition-all"
                                                            title="Cancel"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() => startEditing(product)}
                                                            className="p-1.5 text-gray-400 hover:text-[#7c3aed] hover:bg-[#7c3aed]/10 rounded-lg transition-all"
                                                            title="Edit Details"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                            title="Delete Product"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Inventory;
