
import React, { useState } from 'react';
import {
    Download,
    TrendingUp,
    TrendingDown,
    CheckCircle2,
    Wallet,
    MessageSquare,
    CreditCard,
    MoreHorizontal,
    Search,
    ArrowUpRight,
    History
} from 'lucide-react';

const Payments = () => {
    const [activeTab, setActiveTab] = useState('All Transactions');

    // TODO: Replace with FastAPI call to fetch real payment transactions
    const transactions = [
        { id: '#PAY-9823', customer: 'John Doe', initial: 'JD', date: 'Oct 24, 2023', time: '14:20', method: 'WhatsApp Pay', methodIcon: MessageSquare, amount: 450, status: 'Success' },
        { id: '#PAY-9822', customer: 'Sarah Smith', initial: 'SS', date: 'Oct 24, 2023', time: '13:15', method: 'Credit Card', methodIcon: CreditCard, amount: 1200, status: 'Success' },
        { id: '#PAY-9821', customer: 'Mike Johnson', initial: 'MJ', date: 'Oct 24, 2023', time: '12:45', method: 'UPI', methodIcon: Wallet, amount: 120, status: 'Pending' },
        { id: '#PAY-9820', customer: 'Emma Wilson', initial: 'EW', date: 'Oct 24, 2023', time: '11:30', method: 'WhatsApp Pay', methodIcon: MessageSquare, amount: 899, status: 'Failed' },
        { id: '#PAY-9819', customer: 'Robert Brown', initial: 'RB', date: 'Oct 24, 2023', time: '10:05', method: 'Credit Card', methodIcon: CreditCard, amount: 552, status: 'Success' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-[#0e141b]">Payment Transactions</h1>
                    <p className="text-gray-500 mt-1 font-medium">Real-time overview of all financial activities processed via the chatbot system.</p>
                </div>
                <button className="flex items-center justify-center gap-2 px-4 py-2 bg-[#7c3aed] text-white rounded-lg text-sm font-bold shadow-lg shadow-blue-100 hover:bg-[#7c3aed]/90 transition-all">
                    <Download className="w-4 h-4" />
                    <span>Download CSV</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <PaymentStatCard
                    label="Total Revenue"
                    value="₹12,45,000"
                    trend="12.5%"
                    trendUp={true}
                    icon={<ArrowUpRight className="w-5 h-5" />}
                    subText="vs. last month"
                />
                <PaymentStatCard
                    label="Successful Payments"
                    value="1,284"
                    trend="5.2%"
                    trendUp={true}
                    icon={<CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                    subText="98.2% success rate"
                />
                <PaymentStatCard
                    label="Refunded Amount"
                    value="₹4,200"
                    trend="2.1%"
                    trendUp={false}
                    icon={<History className="w-5 h-5 text-rose-500" />}
                    subText="12 transactions this month"
                />
            </div>

            <div className="flex border-b border-gray-200 overflow-x-auto no-scrollbar">
                {['All Transactions', 'Success', 'Pending', 'Failed'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex items-center gap-2 px-6 pb-4 pt-2 text-sm font-bold transition-all relative whitespace-nowrap ${activeTab === tab ? 'text-[#7c3aed]' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                        {tab}
                        {tab === 'All Transactions' && (
                            <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === tab ? 'bg-blue-100 text-[#7c3aed]' : 'bg-gray-100 text-gray-500'}`}>
                                2,450
                            </span>
                        )}
                        {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7c3aed] rounded-full" />}
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-200">
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Payment ID</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date & Time</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Method</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Amount</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {transactions.map(item => (
                                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap font-mono text-sm font-semibold text-[#7c3aed]">{item.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 border border-gray-200">
                                                {item.initial}
                                            </div>
                                            <span className="text-sm font-semibold text-[#0e141b]">{item.customer}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                                        {item.date} • <span className="text-gray-400">{item.time}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                                            <item.methodIcon className={`w-4 h-4 ${item.method === 'WhatsApp Pay' ? 'text-emerald-500' : item.method === 'Credit Card' ? 'text-blue-500' : 'text-[#7c3aed]'}`} />
                                            {item.method}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-[#0e141b] text-right">₹{item.amount.toLocaleString('en-IN')}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${item.status === 'Success' ? 'bg-emerald-50 text-emerald-700' :
                                            item.status === 'Pending' ? 'bg-amber-50 text-amber-700' :
                                                'bg-rose-50 text-rose-700'
                                            }`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <button className="text-gray-400 hover:text-[#7c3aed] transition-colors p-1 rounded-md hover:bg-gray-100">
                                            <MoreHorizontal className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                    <p className="text-sm text-gray-500 font-medium">Showing 1 to 5 of 2,450 results</p>
                    <div className="flex gap-2">
                        <button className="px-3 py-1.5 border border-gray-200 rounded-lg bg-white text-gray-500 hover:bg-gray-100 text-sm font-bold disabled:opacity-50 transition-colors" disabled>Previous</button>
                        <button className="px-3 py-1.5 bg-[#7c3aed] text-white text-sm font-bold rounded-lg shadow-sm">1</button>
                        <button className="px-3 py-1.5 border border-gray-200 rounded-lg bg-white text-gray-500 hover:bg-gray-100 text-sm font-bold transition-colors">2</button>
                        <button className="px-3 py-1.5 border border-gray-200 rounded-lg bg-white text-gray-500 hover:bg-gray-100 text-sm font-bold transition-colors">3</button>
                        <span className="px-2 text-gray-400 font-bold self-center">...</span>
                        <button className="px-3 py-1.5 border border-gray-200 rounded-lg bg-white text-gray-500 hover:bg-gray-100 text-sm font-bold transition-colors">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const PaymentStatCard = ({ label, value, trend, trendUp, icon, subText }) => (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4 transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{label}</p>
            <div className="p-2 bg-gray-50 rounded-lg border border-gray-100">
                {icon}
            </div>
        </div>
        <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-[#0e141b]">{value}</h3>
            <span className={`text-xs font-bold flex items-center gap-0.5 ${trendUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                {trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {trend}
            </span>
        </div>
        <p className="text-gray-400 text-xs font-medium">{subText}</p>
    </div>
);

export default Payments;
