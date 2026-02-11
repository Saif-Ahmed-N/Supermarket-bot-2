import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users as UsersIcon,
    BarChart3,
    Settings,
    LogOut,
    CreditCard,
    CalendarClock,
    ShieldCheck
} from 'lucide-react';

const Sidebar = ({ onLogout }) => {
    const navItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
        { name: 'Inventory', icon: Package, path: '/inventory' },
        { name: 'FEFO', icon: CalendarClock, path: '/fefo' },
        { name: 'Orders', icon: ShoppingCart, path: '/orders' },
        { name: 'Payments', icon: CreditCard, path: '/payments' },
        { name: 'Customers', icon: UsersIcon, path: '/customers' },
        { name: 'Users', icon: ShieldCheck, path: '/users' },
        { name: 'Analytics', icon: BarChart3, path: '/analytics' },
        { name: 'Settings', icon: Settings, path: '/settings' },
    ];

    return (
        <aside className="w-64 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">

            {/* LOGO SECTION FIX:
               1. Removed 'px-4' and 'mb-2' to kill the side & bottom gaps.
               2. Increased width to 'w-48' (approx 192px) to maximize size.
               3. Used 'py-6' for vertical balance. 
            */}
            <div className="w-full flex justify-center items-center py-6">
                <img
                    src="/logo/cosmocartt.png"
                    alt="CosmoCart"
                    className="w-48 h-auto object-contain hover:scale-105 transition-transform duration-300"
                />
            </div>

            <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors
              ${isActive
                                ? 'bg-[#7c3aed]/10 text-[#7c3aed] font-semibold'
                                : 'text-gray-600 hover:bg-gray-100 font-medium'}
            `}
                    >
                        <item.icon className="w-5 h-5" />
                        <span className="text-sm">{item.name}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-100 mt-auto">
                <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-xl">
                    <img
                        className="w-8 h-8 rounded-full object-cover border border-gray-200"
                        src="https://picsum.photos/seed/admin/100/100"
                        alt="Admin"
                    />
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-gray-900 truncate">Alex Rivera</p>
                        <p className="text-[10px] text-gray-500 truncate uppercase tracking-wider">Manager</p>
                    </div>
                    <button onClick={onLogout} className="text-gray-400 hover:text-red-500 transition-colors" title="Logout">
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;