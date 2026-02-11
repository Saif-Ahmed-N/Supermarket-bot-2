
import React from 'react';
import {
    TrendingUp,
    Calendar,
    Download,
    FileText,
    PieChart as PieChartIcon,
    BarChart as BarChartIcon,
    Star
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar
} from 'recharts';

// TODO: Replace with FastAPI call to fetch revenue data
const revenueData = [
    { date: 'Oct 01', revenue: 420000 },
    { date: 'Oct 08', revenue: 580000 },
    { date: 'Oct 15', revenue: 480000 },
    { date: 'Oct 22', revenue: 720000 },
    { date: 'Oct 29', revenue: 950000 },
];

// TODO: Replace with FastAPI call to fetch category distribution
const categoryData = [
    { name: 'Fresh Produce', value: 42, color: '#7c3aed' },
    { name: 'Dairy & Eggs', value: 28, color: '#818cf8' },
    { name: 'Meat & Poultry', value: 18, color: '#34d399' },
    { name: 'Beverages', value: 12, color: '#fbbf24' },
];

// TODO: Replace with FastAPI call to fetch peak times
const peakTimesData = [
    { time: '8 AM', orders: 20 },
    { time: '10 AM', orders: 45 },
    { time: '12 PM', orders: 95 },
    { time: '2 PM', orders: 80 },
    { time: '4 PM', orders: 100 },
    { time: '6 PM', orders: 75 },
    { time: '8 PM', orders: 25 },
];

const Analytics = () => {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Reports & Analytics Deep-dive</h2>
                    <p className="text-gray-500 font-medium">Real-time insights for your chatbot sales and operations</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">Oct 1, 2023 - Oct 31, 2023</span>
                    </div>
                    <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 shadow-sm flex items-center gap-2 transition-colors">
                        <FileText className="w-4 h-4" />
                        Download PDF
                    </button>
                </div>
            </header>

            <section className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-base font-semibold">Revenue Growth</h3>
                        <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-3xl font-bold">₹12,84,300.00</span>
                            <span className="text-green-600 text-sm font-medium flex items-center gap-0.5">
                                <TrendingUp className="w-3 h-3" />
                                12.5%
                            </span>
                        </div>
                    </div>
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                        <button className="px-3 py-1 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors">Daily</button>
                        <button className="px-3 py-1 text-xs font-semibold bg-white text-[#7c3aed] rounded shadow-sm">Weekly</button>
                        <button className="px-3 py-1 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors">Monthly</button>
                    </div>
                </div>
                <div className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={revenueData}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af', fontWeight: 600 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af', fontWeight: 600 }} />
                            <Tooltip
                                formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Revenue']}
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                            />
                            <Area type="monotone" dataKey="revenue" stroke="#7c3aed" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <h3 className="text-base font-semibold mb-6">Sales by Category</h3>
                    <div className="flex items-center gap-8">
                        <div className="w-40 h-40">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        innerRadius={50}
                                        outerRadius={70}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="text-center">
                                    <span className="text-xl font-bold block">82%</span>
                                    <span className="text-[10px] text-gray-400 font-bold uppercase">Target</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 space-y-3">
                            {categoryData.map(cat => (
                                <div key={cat.name} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                                        <span className="text-sm text-gray-600">{cat.name}</span>
                                    </div>
                                    <span className="text-sm font-semibold">{cat.value}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <h3 className="text-base font-semibold mb-6">Peak Ordering Times</h3>
                    <div className="h-40">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={peakTimesData}>
                                <XAxis dataKey="time" hide />
                                <Tooltip cursor={{ fill: '#f8fafc' }} />
                                <Bar dataKey="orders" radius={[4, 4, 0, 0]}>
                                    {peakTimesData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.orders > 80 ? '#7c3aed' : '#e2e8f0'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-4">
                        {peakTimesData.map(d => <span key={d.time}>{d.time}</span>)}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatItem label="Average Order Value" value="₹450" trend="+4.2%" trendUp={true} />
                <StatItem label="Customer Retention Rate" value="78.4%" trend="Stable" trendUp={null} />
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                    <h3 className="text-sm font-bold flex items-center gap-2 mb-4">
                        <Star className="w-4 h-4 text-[#7c3aed]" />
                        Top Selling Products
                    </h3>
                    <div className="space-y-4">
                        <ProductRow name="Organic Gala Apples" sold="1.2k" price="₹400" img="https://picsum.photos/seed/apple/100/100" />
                        <ProductRow name="Fresh Whole Milk 1L" sold="980" price="₹65" img="https://picsum.photos/seed/milk2/100/100" />
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatItem = ({ label, value, trend, trendUp }) => (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-start justify-between mb-4">
            <div className="p-2 bg-blue-50 text-[#7c3aed] rounded-lg">
                <TrendingUp className="w-5 h-5" />
            </div>
            <span className={`text-xs font-bold px-2 py-1 rounded ${trendUp === true ? 'bg-green-50 text-green-600' :
                trendUp === false ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-500'
                }`}>
                {trend}
            </span>
        </div>
        <p className="text-gray-500 text-sm font-medium">{label}</p>
        <h4 className="text-2xl font-bold mt-1">{value}</h4>
    </div>
);

const ProductRow = ({ name, sold, price, img }) => (
    <div className="flex items-center gap-3">
        <img src={img} className="w-8 h-8 rounded object-cover flex-shrink-0" alt={name} />
        <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold truncate">{name}</p>
            <p className="text-[10px] text-gray-500">{sold} units sold</p>
        </div>
        <span className="text-xs font-bold text-[#7c3aed]">{price}</span>
    </div>
);

export default Analytics;
