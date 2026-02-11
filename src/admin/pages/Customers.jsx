
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, UserPlus, Filter, MoreHorizontal, Mail, MapPin } from 'lucide-react';

// TODO: Replace with FastAPI call to fetch all customers
const INITIAL_CUSTOMERS = [
    {
        id: '1',
        name: 'Rahul Sharma',
        email: 'rahul.s@example.in',
        mobile: '+91 98765 43210',
        location: 'Mumbai, Maharashtra',
        memberSince: 'Jan 12, 2023',
        lifetimeSpend: 42850,
        totalOrders: 42,
        lastActivity: '2 hours ago',
        avatar: 'https://picsum.photos/seed/rahul/100/100'
    },
    {
        id: '2',
        name: 'Priya Patel',
        email: 'priya.p@example.in',
        mobile: '+91 81234 56789',
        location: 'Ahmedabad, Gujarat',
        memberSince: 'Mar 05, 2023',
        lifetimeSpend: 12500,
        totalOrders: 15,
        lastActivity: '1 day ago',
        avatar: 'https://picsum.photos/seed/priya/100/100'
    },
    {
        id: '3',
        name: 'Anish Kumar',
        email: 'anish.k@example.in',
        mobile: '+91 70123 45678',
        location: 'Bangalore, Karnataka',
        memberSince: 'Jun 20, 2023',
        lifetimeSpend: 8400,
        totalOrders: 8,
        lastActivity: '3 hours ago',
        avatar: 'https://picsum.photos/seed/anish/100/100'
    },
];

const Customers = () => {
    const navigate = useNavigate();

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-black tracking-tight">Customer Management</h2>
                    <p className="text-gray-500 mt-1">Manage and view detailed profiles of your supermarket shoppers.</p>
                </div>
                <button className="bg-[#7c3aed] hover:bg-[#7c3aed]/90 text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 shadow-lg shadow-[#7c3aed]/20 transition-all">
                    <UserPlus className="w-5 h-5" />
                    Add Customer
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        className="w-full bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-[#7c3aed] outline-none transition-all"
                        placeholder="Search by name, email, or mobile..."
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors">
                        <Filter className="w-4 h-4" />
                        Filters
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {INITIAL_CUSTOMERS.map(customer => (
                    <div
                        key={customer.id}
                        onClick={() => navigate(`/customers/${customer.id}`)}
                        className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:border-[#7c3aed]/30 hover:shadow-md transition-all cursor-pointer group"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <img src={customer.avatar} className="w-14 h-14 rounded-full border-2 border-gray-50" alt={customer.name} />
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-[#0e141b] truncate group-hover:text-[#7c3aed] transition-colors">{customer.name}</h4>
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                    <MapPin className="w-3 h-3" />
                                    {customer.location}
                                </div>
                            </div>
                            <button className="text-gray-400 hover:text-gray-600">
                                <MoreHorizontal className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Spend</p>
                                <p className="text-sm font-bold text-[#7c3aed]">₹{customer.lifetimeSpend.toLocaleString('en-IN')}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Orders</p>
                                <p className="text-sm font-bold text-gray-900">{customer.totalOrders}</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-500">Mobile</span>
                                <span className="font-semibold">{customer.mobile}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-500">Last Active</span>
                                <span className="font-semibold">{customer.lastActivity}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Customers;
