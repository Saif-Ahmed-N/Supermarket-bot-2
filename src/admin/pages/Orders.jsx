
import React, { useState } from 'react';
import { Download, Filter, MoreVertical, Home, Store, CheckCircle, Package, Truck, Clock } from 'lucide-react';

const Orders = ({ orders, onUpdateStatus }) => {
    const [activeTab, setActiveTab] = useState('All Orders');

    const filteredOrders = orders.filter(o => {
        if (activeTab === 'New') return o.status === 'Pending';
        if (activeTab === 'Processing') return o.status === 'Packed';
        if (activeTab === 'Completed') return o.status === 'Delivered';
        return true;
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div><h2 className="text-3xl font-black tracking-tight text-[#0e141b]">Order Management</h2><p className="text-gray-500 mt-1">Review and manage automated chatbot orders.</p></div>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#7c3aed] text-white rounded-lg text-sm font-bold shadow-lg shadow-blue-100 hover:bg-[#7c3aed]/90 transition-all"><Download className="w-4 h-4" />Export Orders</button>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
                    {['All Orders', 'New', 'Processing', 'Completed'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-5 py-1.5 text-sm font-bold rounded-md transition-all ${activeTab === tab ? 'bg-[#7c3aed] text-white' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                <th className="px-6 py-4">Order ID</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4 text-right">Total</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-center">Workflow Action</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredOrders.map(order => (
                                <tr key={order.id} className="hover:bg-gray-50/30 transition-colors group">
                                    <td className="px-6 py-4 font-bold text-sm text-[#7c3aed]">{order.id}</td>
                                    <td className="px-6 py-4 text-sm font-medium">{order.customerMobile}</td>
                                    <td className="px-6 py-4 text-sm font-bold text-right">₹{order.total.toLocaleString('en-IN')}</td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={order.status} />
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <WorkflowButtons status={order.status} onUpdate={(s) => onUpdateStatus(order.id, s)} />
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-gray-300 hover:text-[#7c3aed] p-1.5 hover:bg-gray-100 rounded-md transition-all"><MoreVertical className="w-5 h-5" /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const WorkflowButtons = ({ status, onUpdate }) => {
    // TODO: Replace with FastAPI call to update order status
    if (status === 'Pending') return (
        <button onClick={() => onUpdate('Packed')} className="flex items-center gap-1.5 mx-auto px-3 py-1.5 bg-blue-50 text-[#7c3aed] rounded-lg text-[11px] font-black uppercase hover:bg-blue-100 transition-all border border-blue-100">
            <Package className="w-3.5 h-3.5" /> Accept & Pack
        </button>
    );
    if (status === 'Packed') return (
        <button onClick={() => onUpdate('Delivered')} className="flex items-center gap-1.5 mx-auto px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-[11px] font-black uppercase hover:bg-emerald-100 transition-all border border-emerald-100">
            <Truck className="w-3.5 h-3.5" /> Ship Now
        </button>
    );
    if (status === 'Delivered') return (
        <span className="flex items-center gap-1.5 mx-auto text-emerald-500 text-[10px] font-black uppercase tracking-widest">
            <CheckCircle className="w-3.5 h-3.5" /> Fulfilled
        </span>
    );
    return null;
};

const StatusBadge = ({ status }) => {
    const styles = {
        Pending: 'bg-amber-100 text-amber-700',
        Packed: 'bg-blue-100 text-[#7c3aed]',
        Delivered: 'bg-emerald-100 text-emerald-700',
        Cancelled: 'bg-red-100 text-red-700'
    };
    return <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${styles[status]}`}>{status}</span>;
};

export default Orders;
