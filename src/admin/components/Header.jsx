
import React from 'react';
import { Search, Bell } from 'lucide-react';

const Header = ({ onNotificationClick, unreadCount = 3 }) => {
    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-20">
            <div className="flex items-center flex-1 max-w-xl">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        className="w-full bg-gray-100 border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-[#7c3aed] focus:bg-white transition-all placeholder:text-gray-400"
                        placeholder="Search products, orders, or customers..."
                    />
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onNotificationClick}
                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors relative group"
                    >
                        <Bell className="w-5 h-5 group-hover:text-[#7c3aed] transition-colors" />
                        {unreadCount > 0 && (
                            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        )}
                    </button>
                    <div className="h-8 w-px bg-gray-200"></div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-500">v2.4.0</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
