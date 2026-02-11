
import React, { useState } from 'react';
import {
    Search,
    UserPlus,
    MoreVertical,
    Shield,
    Activity,
    ChevronLeft,
    ChevronRight,
    Download,
    RefreshCw,
} from 'lucide-react';
import InviteUserModal from '../components/InviteUserModal';

const TABS = ['Admin Users', 'Staff Users', 'Activity Logs'];

// TODO: Replace with FastAPI call to fetch all staff users
const MOCK_STAFF = [
    {
        id: '1',
        name: 'arun',
        email: 'arun@gmail.com',
        status: 'Active',
        accessLevel: 'Limited Access',
        permissions: ['Dashboard', 'Users', 'Orders', 'Settings'],
        joinDate: '2026-01-06'
    },
    {
        id: '2',
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        status: 'Active',
        accessLevel: 'Full Access',
        joinDate: '2026-02-14'
    }
];

// TODO: Replace with FastAPI call to fetch activity logs
const MOCK_LOGS = [
    {
        id: '1',
        timestamp: 'Oct 24, 2023 10:45:22 AM',
        user: 'Sarah Jenkins',
        actionType: 'Inventory Update',
        description: 'Updated stock for Amul Gold Milk from 10 to 50 units.',
        ip: '192.168.1.104',
        avatar: 'https://picsum.photos/seed/sarah1/100/100'
    },
    {
        id: '2',
        timestamp: 'Oct 24, 2023 09:12:05 AM',
        user: 'Marcus Thorne',
        actionType: 'User Invited',
        description: 'Invited j.doe@example.com as Store Manager.',
        ip: '102.45.12.89',
        avatar: 'https://picsum.photos/seed/marcus/100/100'
    },
    {
        id: '3',
        timestamp: 'Oct 23, 2023 04:55:41 PM',
        user: 'Elena Gilbert',
        actionType: 'Item Deleted',
        description: 'Removed SKU-4921 (Expired Bread) from inventory.',
        ip: '201.33.155.2',
        avatar: 'https://picsum.photos/seed/elena/100/100'
    },
    {
        id: '4',
        timestamp: 'Oct 23, 2023 02:15:10 PM',
        user: 'Alex Rivera',
        actionType: 'Status Change',
        description: "Changed Order #ORD-8822 from 'Processing' to 'Shipped'.",
        ip: '192.168.1.2',
        avatar: 'https://picsum.photos/seed/admin/100/100'
    }
];

const Users = () => {
    const [activeTab, setActiveTab] = useState('Staff Users');
    const [searchQuery, setSearchQuery] = useState('');
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-[#0e141b]">User Management</h1>
                    <p className="text-gray-500 mt-1 font-medium">
                        {activeTab === 'Activity Logs'
                            ? 'A detailed trail of all administrative actions within the system.'
                            : 'Manage admin and staff users'}
                    </p>
                </div>
                {activeTab === 'Activity Logs' && (
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-lg font-bold text-sm hover:bg-gray-50 shadow-sm transition-all">
                            <Download className="w-4 h-4" />
                            Export CSV
                        </button>
                        <button className="flex items-center gap-2 bg-[#7c3aed] text-white px-4 py-2.5 rounded-lg font-bold text-sm hover:bg-[#7c3aed]/90 shadow-lg shadow-blue-100 transition-all">
                            <RefreshCw className="w-4 h-4" />
                            Refresh Logs
                        </button>
                    </div>
                )}
            </header>

            {/* Tabs */}
            <div className="border-b border-gray-200 overflow-x-auto no-scrollbar">
                <nav className="flex gap-8 whitespace-nowrap">
                    {TABS.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-4 text-sm font-bold transition-all relative ${activeTab === tab
                                ? 'text-[#7c3aed]'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {tab}
                            {activeTab === tab && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7c3aed] rounded-full" />
                            )}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#7c3aed] focus:border-transparent outline-none text-sm font-medium text-slate-800 transition-all placeholder:text-gray-400"
                        placeholder={`Search ${activeTab.toLowerCase()}...`}
                    />
                </div>
                {activeTab !== 'Activity Logs' && (
                    <button
                        onClick={() => setIsInviteModalOpen(true)}
                        className="w-full sm:w-auto bg-[#7c3aed] text-white px-6 py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#7c3aed]/90 transition-all shadow-lg shadow-blue-100"
                    >
                        <UserPlus className="w-4 h-4" />
                        Add New User
                    </button>
                )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    {activeTab === 'Activity Logs' ? (
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50/50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-[11px] font-black text-gray-500 uppercase tracking-widest">Timestamp</th>
                                    <th className="px-6 py-4 text-[11px] font-black text-gray-500 uppercase tracking-widest">User</th>
                                    <th className="px-6 py-4 text-[11px] font-black text-gray-500 uppercase tracking-widest">Action Type</th>
                                    <th className="px-6 py-4 text-[11px] font-black text-gray-500 uppercase tracking-widest">Description</th>
                                    <th className="px-6 py-4 text-[11px] font-black text-gray-500 uppercase tracking-widest">IP Address</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {MOCK_LOGS.map((log) => (
                                    <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-[#0e141b]">{log.timestamp.split(' ').slice(0, 3).join(' ')}</div>
                                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{log.timestamp.split(' ').slice(3).join(' ')}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <img src={log.avatar} className="size-8 rounded-full border border-gray-100 shadow-sm" alt={log.user} />
                                                <span className="text-sm font-bold text-[#0e141b]">{log.user}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <LogActionBadge action={log.actionType} />
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-600 font-medium max-w-md line-clamp-2">{log.description}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <code className="text-[11px] bg-gray-100 px-2 py-1 rounded text-gray-500 font-bold border border-gray-200 font-mono">
                                                {log.ip}
                                            </code>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50/50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-[11px] font-black text-gray-500 uppercase tracking-widest">Name</th>
                                    <th className="px-6 py-4 text-[11px] font-black text-gray-500 uppercase tracking-widest">Email</th>
                                    <th className="px-6 py-4 text-[11px] font-black text-gray-500 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-4 text-[11px] font-black text-gray-500 uppercase tracking-widest">Access Level</th>
                                    <th className="px-6 py-4 text-[11px] font-black text-gray-500 uppercase tracking-widest">Join Date</th>
                                    <th className="px-6 py-4 text-[11px] font-black text-gray-500 uppercase tracking-widest text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {MOCK_STAFF.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-6 text-sm font-bold text-[#0e141b]">{user.name}</td>
                                        <td className="px-6 py-6 text-sm font-medium text-gray-500">{user.email}</td>
                                        <td className="px-6 py-6">
                                            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[11px] font-bold border border-emerald-100">
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex flex-col gap-2">
                                                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold w-fit border ${user.accessLevel === 'Full Access'
                                                    ? 'bg-purple-50 text-purple-700 border-purple-100'
                                                    : 'bg-orange-50 text-orange-700 border-orange-100'
                                                    }`}>
                                                    {user.accessLevel === 'Full Access' ? <Shield className="w-3.5 h-3.5" /> : <Activity className="w-3.5 h-3.5" />}
                                                    {user.accessLevel}
                                                </div>
                                                {user.permissions && (
                                                    <div className="flex flex-wrap gap-2">
                                                        {user.permissions.map(perm => (
                                                            <span key={perm} className="px-2 py-0.5 bg-blue-50 text-[#7c3aed] text-[10px] font-bold rounded border border-blue-100 uppercase tracking-wide">
                                                                {perm}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 text-sm font-medium text-gray-500">{user.joinDate}</td>
                                        <td className="px-6 py-6 text-right">
                                            <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-[#7c3aed]">
                                                <MoreVertical className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                        Showing {activeTab === 'Activity Logs' ? MOCK_LOGS.length : MOCK_STAFF.length} of 1,240 entries
                    </p>
                    <div className="flex gap-2">
                        <button className="p-2 text-gray-400 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-all disabled:opacity-50" disabled>
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button className="px-4 py-2 bg-[#7c3aed] text-white text-xs font-bold rounded-lg shadow-sm">1</button>
                        <button className="p-2 text-gray-400 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-all">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            <InviteUserModal
                isOpen={isInviteModalOpen}
                onClose={() => setIsInviteModalOpen(false)}
            />
        </div>
    );
};

const LogActionBadge = ({ action }) => {
    const styles = {
        'Inventory Update': 'bg-blue-100 text-[#7c3aed]',
        'User Invited': 'bg-emerald-100 text-emerald-600',
        'Item Deleted': 'bg-rose-100 text-rose-600',
        'Status Change': 'bg-blue-100 text-[#7c3aed]',
    };

    const dotStyles = {
        'Inventory Update': 'bg-[#7c3aed]',
        'User Invited': 'bg-emerald-500',
        'Item Deleted': 'bg-rose-500',
        'Status Change': 'bg-[#7c3aed]',
    };

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${styles[action] || 'bg-gray-100 text-gray-600'}`}>
            <span className={`size-1.5 rounded-full ${dotStyles[action] || 'bg-gray-400'}`} />
            {action}
        </span>
    );
};

export default Users;
