
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    ChevronRight,
    MapPin,
    MessageCircle,
    Edit,
    Mail,
    Phone,
    Download,
    Eye,
    Bot,
    User,
    ShoppingBag
} from 'lucide-react';

const CustomerDetails = () => {
    const { id } = useParams();

    // Mock data for Rahul Sharma
    // TODO: Replace with FastAPI call to fetch detailed customer profile by id
    const customer = {
        id: '1',
        name: 'Rahul Sharma',
        email: 'rahul.s@example.in',
        mobile: '+91 98765 43210',
        location: 'Mumbai, Maharashtra',
        memberSince: 'Jan 12, 2023',
        lifetimeSpend: 42850,
        totalOrders: 42,
        lastActivity: '2 hours ago',
        avatar: 'https://picsum.photos/seed/rahul/200/200'
    };

    // TODO: Replace with FastAPI call to fetch order history for this customer
    const orders = [
        { id: '#ORD-94285', date: 'Oct 24, 2023', amount: 1425, status: 'Completed' },
        { id: '#ORD-94112', date: 'Oct 22, 2023', amount: 650, status: 'Processing' },
        { id: '#ORD-93988', date: 'Oct 18, 2023', amount: 2104, status: 'Completed' },
        { id: '#ORD-93521', date: 'Oct 12, 2023', amount: 129, status: 'Cancelled' },
    ];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                <Link to="/customers" className="hover:text-[#7c3aed] transition-colors">Customers</Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-gray-900 font-bold">{customer.name}</span>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                <aside className="w-full lg:w-1/3 flex flex-col gap-6">
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                        <div className="p-8 flex flex-col items-center text-center">
                            <img
                                className="w-32 h-32 rounded-full border-4 border-gray-50 mb-4 object-cover"
                                src={customer.avatar}
                                alt={customer.name}
                            />
                            <h1 className="text-2xl font-bold text-gray-900">{customer.name}</h1>
                            <p className="text-gray-500 flex items-center gap-1 mb-6">
                                <MapPin className="w-4 h-4" />
                                {customer.location}
                            </p>

                            <div className="w-full grid grid-cols-2 gap-4 mb-8">
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-left">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Lifetime Spend</p>
                                    <p className="text-xl font-bold text-[#7c3aed]">₹{customer.lifetimeSpend.toLocaleString('en-IN')}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-left">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Total Orders</p>
                                    <p className="text-xl font-bold text-gray-900">{customer.totalOrders}</p>
                                </div>
                            </div>

                            <div className="w-full space-y-3">
                                <button className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-3 px-4 rounded-lg transition-all shadow-md">
                                    <MessageCircle className="w-5 h-5" />
                                    Message on WhatsApp
                                </button>
                                <button className="w-full flex items-center justify-center gap-2 bg-[#7c3aed]/10 hover:bg-[#7c3aed]/20 text-[#7c3aed] font-bold py-3 px-4 rounded-lg transition-all">
                                    <Edit className="w-4 h-4" />
                                    Edit Profile
                                </button>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 p-6 space-y-4">
                            <InfoRow label="Mobile Number" value={customer.mobile} />
                            <InfoRow label="Email" value={customer.email} />
                            <InfoRow label="Member Since" value={customer.memberSince} />
                            <InfoRow label="Last Activity" value={customer.lastActivity} />
                        </div>
                    </div>
                </aside>

                <section className="flex-1 flex flex-col gap-6">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="text-xl font-bold">Order History</h2>
                            <div className="flex gap-2">
                                <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                                    <Download className="w-4 h-4" />
                                    Export
                                </button>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                                        <th className="px-6 py-4">Order ID</th>
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4">Amount</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {orders.map(order => (
                                        <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 text-sm font-bold text-[#7c3aed]">{order.id}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{order.date}</td>
                                            <td className="px-6 py-4 text-sm font-bold text-gray-900">₹{order.amount.toLocaleString('en-IN')}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                                    order.status === 'Processing' ? 'bg-blue-100 text-[#7c3aed]' :
                                                        'bg-red-100 text-red-700'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="text-gray-400 hover:text-[#7c3aed]"><Eye className="w-4 h-4" /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <h3 className="text-lg font-bold mb-4">Latest Chat Interactions</h3>
                        <div className="space-y-4">
                            <ChatItem
                                sender="Chatbot Assistant"
                                time="2h ago"
                                msg={`"Your order ${orders[0].id} is out for delivery. You can track it here..."`}
                                isBot={true}
                            />
                            <ChatItem
                                sender={customer.name}
                                time="2h ago"
                                msg='"Great, thank you. What is the estimated arrival time?"'
                                isBot={false}
                            />
                        </div>
                        <button className="mt-6 w-full text-center text-[#7c3aed] text-sm font-bold hover:underline">
                            View Full Conversation History
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
};

const InfoRow = ({ label, value }) => (
    <div className="flex justify-between items-center text-sm">
        <span className="text-gray-500 font-medium">{label}</span>
        <span className="text-gray-900 font-bold">{value}</span>
    </div>
);

const ChatItem = ({ sender, time, msg, isBot }) => (
    <div className={`flex gap-4 items-start p-3 rounded-lg ${isBot ? 'bg-blue-50/50' : 'bg-gray-50'}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isBot ? 'bg-blue-100 text-[#7c3aed]' : 'bg-gray-200 text-gray-500'}`}>
            {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
        </div>
        <div className="flex-1">
            <div className="flex justify-between mb-1">
                <p className="text-xs font-bold">{sender}</p>
                <span className="text-[10px] text-gray-400">{time}</span>
            </div>
            <p className="text-sm text-gray-600 italic">{msg}</p>
        </div>
    </div>
);

export default CustomerDetails;
