
import React, { useMemo } from 'react';
import { ShoppingCart, Package, AlertTriangle, Users, TrendingUp, MessageSquare, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// TODO: Replace with FastAPI call to fetch hourly order frequency
const chartData = [
    { hour: '8am', orders: 12 }, { hour: '9am', orders: 24 }, { hour: '10am', orders: 56 },
    { hour: '11am', orders: 32 }, { hour: '12pm', orders: 88 }, { hour: '1pm', orders: 120 },
    { hour: '2pm', orders: 95 }, { hour: '3pm', orders: 82 }, { hour: '4pm', orders: 128 },
    { hour: '5pm', orders: 142 }, { hour: '6pm', orders: 110 }, { hour: '7pm', orders: 50 },
];

const Dashboard = ({ orders, products }) => {
    const stats = useMemo(() => {
        // TODO: Ideally these stats should come directly from a FastAPI analytics endpoint
        const revenue = orders.filter(o => o.status === 'Delivered').reduce((acc, curr) => acc + curr.total, 0);
        const pending = orders.filter(o => o.status === 'Pending').length;
        const lowStock = products.filter(p => p.stock <= 20).length;
        return { revenue, pending, lowStock };
    }, [orders, products]);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h2 className="text-3xl font-black tracking-tight text-[#0e141b]">Dashboard Overview</h2>
                <p className="text-gray-500 font-medium">Welcome back! Here's what's happening today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    label="Today's Revenue"
                    value={`₹${stats.revenue.toLocaleString('en-IN')}`}
                    trend="+12%" trendUp={true}
                    icon={<div className="p-2 bg-purple-50 text-[#7c3aed] rounded-lg"><ShoppingCart className="w-5 h-5" /></div>}
                />
                <StatCard
                    label="Pending Orders"
                    value={stats.pending.toString()}
                    trend="Needs Action" trendUp={false}
                    subText={`${orders.length} TOTAL`}
                    icon={<div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><Package className="w-5 h-5" /></div>}
                />
                <StatCard
                    label="Low Stock Alerts"
                    value={stats.lowStock.toString()}
                    trend={stats.lowStock > 5 ? "Critical" : "Stable"}
                    trendUp={stats.lowStock < 5}
                    isCritical={stats.lowStock > 10}
                    icon={<div className="p-2 bg-red-50 text-red-500 rounded-lg"><AlertTriangle className="w-5 h-5" /></div>}
                />
                <StatCard
                    label="Total Customers"
                    value="2,840" trend="+8%" trendUp={true}
                    icon={<div className="p-2 bg-purple-50 text-[#7c3aed] rounded-lg"><Users className="w-5 h-5" /></div>}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-8">
                        <div><h4 className="text-lg font-bold">Orders per Hour</h4><p className="text-gray-500 text-sm">Real-time frequency</p></div>
                        <select className="text-xs font-bold bg-gray-100 border-none rounded-lg px-3 py-1.5"><option>Last 24 Hours</option></select>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af' }} />
                                <YAxis hide />
                                <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '8px', border: 'none' }} />
                                <Bar dataKey="orders" radius={[4, 4, 0, 0]}>
                                    {chartData.map((entry, index) => <Cell key={`c-${index}`} fill={entry.orders > 100 ? '#7c3aed' : '#e5e7eb'} />)}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col">
                    <div className="mb-6"><h4 className="text-lg font-bold">Recent Activity</h4><p className="text-gray-500 text-sm">Latest bot actions</p></div>
                    <div className="flex-1 space-y-6">
                        {/* TODO: Replace with FastAPI call to fetch recent bot interactions */}
                        <ActivityItem icon={<MessageSquare className="w-4 h-4" />} color="text-[#7c3aed]" bgColor="bg-purple-50" title="Bot assisted User #402" desc='Resolved item inquiry' time="2 mins ago" />
                        <ActivityItem icon={<CheckCircle className="w-4 h-4" />} color="text-green-500" bgColor="bg-green-50" title="Order #992 Delivered" desc="Standard delivery successful" time="14 mins ago" />
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ label, value, trend, trendUp, icon, subText, isCritical }) => (
    <div className={`bg-white p-6 rounded-xl shadow-sm border ${isCritical ? 'border-red-200 bg-red-50/10' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between mb-4">{icon} <span className={`${trendUp ? 'text-green-600' : 'text-amber-600'} text-xs font-bold`}>{trend}</span></div>
        <p className="text-gray-500 text-sm font-medium mb-1">{label}</p>
        <h3 className="text-2xl font-black text-[#0e141b]">{value}</h3>
        {subText && <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-400">{subText}</div>}
    </div>
);

const ActivityItem = ({ icon, color, bgColor, title, desc, time }) => (
    <div className="flex gap-4">
        <div className={`w-8 h-8 rounded-full ${bgColor} ${color} flex items-center justify-center shrink-0`}>{icon}</div>
        <div><p className="text-sm font-bold">{title}</p><p className="text-xs text-gray-500">{desc}</p><p className="text-[10px] text-gray-400 font-bold uppercase mt-1">{time}</p></div>
    </div>
);

export default Dashboard;
