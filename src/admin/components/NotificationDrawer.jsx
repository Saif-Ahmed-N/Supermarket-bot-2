
import React, { useState } from 'react';
import { X, CheckCheck, ShoppingCart, Package, AlertTriangle, Settings, Bell } from 'lucide-react';

const NotificationDrawer = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState('All');

    // TODO: Replace with FastAPI call to fetch real notifications
    const notifications = [
        {
            id: 1,
            type: 'Order',
            time: '2 mins ago',
            title: 'New order received via Chatbot',
            description: 'Customer requested express delivery for 15 items.',
            status: 'unread',
            icon: <ShoppingCart className="w-5 h-5" />,
            color: 'bg-blue-100 text-[#7c3aed]',
            actionLabel: 'View Order'
        },
        {
            id: 2,
            type: 'Inventory',
            time: '15 mins ago',
            title: 'Low Stock: Fresh Milk',
            description: 'Only 5 units left in main aisle. Predicted to run out in 2 hours.',
            status: 'unread',
            icon: <Package className="w-5 h-5" />,
            color: 'bg-amber-100 text-amber-600',
            actionLabel: 'Add Stock'
        },
        {
            id: 3,
            type: 'Inventory',
            time: '1 hour ago',
            title: 'Expiry Alert: Amul Butter',
            description: '10 units expiring in 2 days. Suggested action: apply discount to clear stock.',
            status: 'read',
            icon: <AlertTriangle className="w-5 h-5" />,
            color: 'bg-red-100 text-red-600',
            actionLabel: 'Apply Discount'
        },
        {
            id: 4,
            type: 'System',
            time: '4 hours ago',
            title: 'Chatbot Model v2.1 Deployed',
            description: 'Improvements to natural language understanding for dietary queries.',
            status: 'read',
            icon: <Settings className="w-5 h-5" />,
            color: 'bg-gray-100 text-gray-600',
            actionLabel: null
        }
    ];

    const filteredNotifications = activeTab === 'All'
        ? notifications
        : notifications.filter(n => n.type === activeTab);

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-gray-200 bg-white shadow-2xl animate-in slide-in-from-right duration-300">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
                    <div>
                        <h2 className="text-xl font-black text-[#0e141b]">Notifications</h2>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Chatbot Activity Center</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-2 text-gray-400 hover:text-[#7c3aed] hover:bg-gray-100 rounded-lg transition-colors" title="Mark all as read">
                            <CheckCheck className="w-5 h-5" />
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-100 px-6 overflow-x-auto scrollbar-hide">
                    {['All', 'Order', 'Inventory', 'System'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`border-b-2 px-4 py-4 text-sm font-bold transition-all relative ${activeTab === tab ? 'border-[#7c3aed] text-[#7c3aed]' : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {tab === 'Order' ? 'Orders' : tab}
                        </button>
                    ))}
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto bg-gray-50/30">
                    {filteredNotifications.map((notif) => (
                        <div
                            key={notif.id}
                            className={`relative border-b border-gray-100 bg-white p-5 transition-colors hover:bg-gray-50 ${notif.status === 'read' ? 'opacity-70' : ''}`}
                        >
                            <div className="flex items-start gap-4">
                                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${notif.color}`}>
                                    {notif.icon}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{notif.time} • {notif.type}</p>
                                        {notif.status === 'unread' && (
                                            <div className="w-2 h-2 rounded-full bg-[#7c3aed]"></div>
                                        )}
                                    </div>
                                    <h4 className="mt-1 text-sm font-bold text-[#0e141b] leading-snug">{notif.title}</h4>
                                    <p className="mt-1 text-xs text-gray-600 font-medium leading-relaxed">{notif.description}</p>

                                    {notif.actionLabel && (
                                        <div className="mt-4 flex gap-2">
                                            <button className="inline-flex items-center justify-center rounded-lg bg-[#7c3aed] px-4 py-2 text-[11px] font-bold text-white shadow-sm hover:bg-[#7c3aed]/90 transition-all">
                                                {notif.actionLabel}
                                            </button>
                                            <button className="inline-flex items-center justify-center rounded-lg border border-gray-200 px-3 py-2 text-[11px] font-bold text-gray-500 hover:bg-gray-50 transition-all">
                                                Dismiss
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {filteredNotifications.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-300 mb-4">
                                <Bell className="w-8 h-8" />
                            </div>
                            <p className="text-sm font-bold text-gray-400">No {activeTab.toLowerCase()} notifications found</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-100 bg-white p-4 text-center">
                    <button className="text-sm font-bold text-[#7c3aed] hover:underline transition-all">
                        See all activity history
                    </button>
                </div>
            </div>
        </>
    );
};

export default NotificationDrawer;
