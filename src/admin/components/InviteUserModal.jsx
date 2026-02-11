
import React from 'react';
import { X, Mail, ChevronDown, Package, ShoppingCart, CreditCard, Bot } from 'lucide-react';

const InviteUserModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0e141b]/60 backdrop-blur-[2px] p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-[640px] max-h-[90vh] flex flex-col rounded-xl shadow-2xl overflow-hidden border border-gray-200 animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-black text-[#0e141b]">Invite New User</h2>
                        <p className="text-xs text-gray-500 font-medium mt-0.5">Set up access for a new supermarket staff member.</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-red-500 transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Scrollable Body */}
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
                    {/* General Info Section */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-[#0e141b] uppercase tracking-wider">Full Name</label>
                            <input
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] outline-none transition-all placeholder:text-gray-400 text-sm font-medium"
                                placeholder="e.g. Alex Rivera"
                                type="text"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-[#0e141b] uppercase tracking-wider">Email Address</label>
                            <input
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] outline-none transition-all placeholder:text-gray-400 text-sm font-medium"
                                placeholder="alex@supermarket.com"
                                type="email"
                            />
                        </div>
                    </section>

                    {/* Role Selection Section */}
                    <section className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-[#0e141b] uppercase tracking-wider">Default Role</label>
                        <div className="relative group">
                            <select className="w-full appearance-none px-4 py-3 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed] outline-none transition-all pr-10 cursor-pointer text-sm font-bold text-[#0e141b]">
                                <option value="staff">Staff - Basic access to inventory and orders</option>
                                <option defaultValue="supervisor">Supervisor - Full control over shop floor ops</option>
                                <option value="admin">Admin - Full system & billing access</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 w-4 h-4" />
                        </div>
                        <p className="text-[11px] text-gray-500 italic font-medium">Selecting a role applies a set of recommended permissions below.</p>
                    </section>

                    {/* Detailed Permissions Section */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Fine-grained Permissions</h3>
                            <div className="h-px flex-1 bg-gray-100"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                            {/* Permission Group: Inventory */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2.5 text-[#7c3aed]">
                                    <Package className="w-5 h-5" />
                                    <h4 className="font-bold text-[#0e141b] text-sm">Inventory Access</h4>
                                </div>
                                <div className="space-y-3 ml-7">
                                    <PermissionItem
                                        label="View Stock Levels"
                                        desc="See current item counts and locations"
                                        checked={true}
                                    />
                                    <PermissionItem
                                        label="Update Quantities"
                                        desc="Edit stock levels manually"
                                        checked={true}
                                    />
                                </div>
                            </div>

                            {/* Permission Group: Orders */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2.5 text-[#7c3aed]">
                                    <ShoppingCart className="w-5 h-5" />
                                    <h4 className="font-bold text-[#0e141b] text-sm">Order Processing</h4>
                                </div>
                                <div className="space-y-3 ml-7">
                                    <PermissionItem
                                        label="Manage Orders"
                                        desc="Process refunds and fulfillment"
                                        checked={true}
                                    />
                                    <PermissionItem
                                        label="Order Deletion"
                                        desc="Permanently remove records"
                                        checked={false}
                                    />
                                </div>
                            </div>

                            {/* Permission Group: Finance */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2.5 text-[#7c3aed]">
                                    <CreditCard className="w-5 h-5" />
                                    <h4 className="font-bold text-[#0e141b] text-sm">Finance Reports</h4>
                                </div>
                                <div className="space-y-3 ml-7">
                                    <PermissionItem
                                        label="Export Financials"
                                        desc="Download revenue and tax data"
                                        checked={false}
                                    />
                                    <PermissionItem
                                        label="Daily Summary"
                                        desc="View today's sales dashboards"
                                        checked={true}
                                    />
                                </div>
                            </div>

                            {/* Permission Group: Chatbot */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2.5 text-[#7c3aed]">
                                    <Bot className="w-5 h-5" />
                                    <h4 className="font-bold text-[#0e141b] text-sm">Chatbot Settings</h4>
                                </div>
                                <div className="space-y-3 ml-7">
                                    <PermissionItem
                                        label="Triage Inquiries"
                                        desc="Take over from chatbot live"
                                        checked={true}
                                    />
                                    <PermissionItem
                                        label="Bot Training"
                                        desc="Modify NLP and responses"
                                        checked={false}
                                    />
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <div className="px-6 py-5 bg-gray-50 border-t border-gray-100 flex flex-col md:flex-row gap-3 justify-end items-center">
                    <button
                        onClick={onClose}
                        className="w-full md:w-auto px-6 py-2.5 text-sm font-bold text-gray-500 hover:text-[#0e141b] hover:bg-gray-100 rounded-lg transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        className="w-full md:w-auto px-8 py-2.5 bg-[#7c3aed] hover:bg-[#7c3aed]/90 text-white text-sm font-bold rounded-lg shadow-lg shadow-blue-100 transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                        <Mail className="w-4 h-4" />
                        Send Invitation
                    </button>
                </div>
            </div>
        </div>
    );
};

const PermissionItem = ({ label, desc, checked }) => (
    <label className="flex items-start gap-3 cursor-pointer group">
        <div className="relative flex items-center h-5">
            <input
                defaultChecked={checked}
                className="w-4 h-4 rounded text-[#7c3aed] border-gray-300 focus:ring-[#7c3aed]/30 transition-all"
                type="checkbox"
            />
        </div>
        <div>
            <p className="text-sm font-bold text-[#0e141b] group-hover:text-[#7c3aed] transition-colors">{label}</p>
            <p className="text-[11px] text-gray-500 font-medium leading-relaxed">{desc}</p>
        </div>
    </label>
);

export default InviteUserModal;
