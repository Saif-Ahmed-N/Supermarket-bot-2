
import React, { useState } from 'react';
import {
    MessageSquare,
    Clock,
    Smartphone,
    Shield,
    Eye,
    EyeOff,
    CheckCircle2,
    Save,
    ChevronRight
} from 'lucide-react';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('Chatbot');
    const [showToken, setShowToken] = useState(false);

    return (
        <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
            <header className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-500 font-medium">Settings</span>
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                    <span className="text-gray-900 font-semibold">{activeTab} Configuration</span>
                </div>
                <button className="bg-[#7c3aed] hover:bg-[#7c3aed]/90 text-white px-5 py-2 rounded-lg text-sm font-bold transition-all shadow-md shadow-blue-100 flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    Save Changes
                </button>
            </header>

            <div className="flex-1 flex overflow-hidden gap-12">
                <div className="flex-1 space-y-8 max-w-3xl">
                    <div>
                        <h2 className="text-3xl font-black tracking-tight">Settings</h2>
                        <p className="text-gray-500 mt-1">Configure how your AI-powered assistant interacts with customers.</p>
                    </div>

                    <div className="border-b border-gray-200">
                        <nav className="flex gap-8">
                            {['General', 'Chatbot', 'Notifications', 'Security'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`pb-4 text-sm font-bold transition-all relative ${activeTab === tab ? 'text-[#7c3aed]' : 'text-gray-500 hover:text-gray-900'}`}
                                >
                                    {tab}
                                    {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7c3aed] rounded-full" />}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-gray-100">
                                <h3 className="font-bold">Automation Controls</h3>
                                <p className="text-sm text-gray-500">Enable or disable core chatbot behaviors.</p>
                            </div>
                            <div className="p-6 space-y-6">
                                <ToggleRow
                                    title="Auto-Reply"
                                    desc="Automatically respond to common customer inquiries instantly."
                                    enabled={true}
                                />
                                <ToggleRow
                                    title="AI Assistance"
                                    desc="Use generative AI to handle complex questions about product inventory."
                                    enabled={true}
                                />
                                <ToggleRow
                                    title="Operating Hours"
                                    desc="Only trigger 'Out of Office' messages outside of 8 AM - 10 PM."
                                    enabled={false}
                                />
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-gray-100">
                                <h3 className="font-bold">Messaging Content</h3>
                                <p className="text-sm text-gray-500">Customize what customers see when they start a chat.</p>
                            </div>
                            <div className="p-6 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold">Welcome Message</label>
                                    <textarea
                                        className="w-full rounded-lg border-gray-200 text-sm focus:border-[#7c3aed] focus:ring-[#7c3aed] transition-all"
                                        rows={3}
                                        defaultValue="Hi there! 👋 Welcome to FreshMart. How can I help you find what you need today?"
                                    />
                                    <p className="text-[10px] text-right text-gray-400">74/160 characters</p>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold">Out of Office Message</label>
                                    <textarea
                                        className="w-full rounded-lg border-gray-200 text-sm focus:border-[#7c3aed] focus:ring-[#7c3aed] transition-all"
                                        rows={3}
                                        defaultValue="We're closed for the day, but we'll get back to you first thing tomorrow at 8:00 AM! 🍎"
                                    />
                                    <p className="text-[10px] text-right text-gray-400">102/160 characters</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                                <Smartphone className="w-5 h-5 text-green-600" />
                                <div>
                                    <h3 className="font-bold">WhatsApp Business API</h3>
                                    <p className="text-sm text-gray-500">Securely connect your store's WhatsApp number.</p>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold">API Access Token</label>
                                    <div className="relative">
                                        <input
                                            type={showToken ? 'text' : 'password'}
                                            className="w-full rounded-lg border-gray-200 text-sm focus:border-[#7c3aed] focus:ring-[#7c3aed] transition-all pr-12"
                                            defaultValue="EAAGm0PX4ZCpsBAK0fZAO789876ASDF897654321"
                                        />
                                        <button
                                            onClick={() => setShowToken(!showToken)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-400">Your key is encrypted and stored securely.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="hidden lg:flex flex-col items-center w-[400px] bg-gray-100/50 rounded-2xl p-10 border border-gray-200/50">
                    <div className="text-center mb-8">
                        <h4 className="text-sm font-bold text-gray-900">Customer Preview</h4>
                        <p className="text-xs text-gray-500">Live view of mobile interactions</p>
                    </div>

                    <div className="relative w-[280px] h-[580px] bg-slate-900 rounded-[3rem] p-3 shadow-2xl border-[8px] border-slate-800">
                        <div className="w-full h-full bg-[#f0f2f5] rounded-[2rem] overflow-hidden flex flex-col">
                            <div className="bg-[#075e54] text-white p-3 flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden shrink-0">
                                    <img src="https://picsum.photos/seed/store/100/100" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold leading-tight truncate">FreshMart Support</p>
                                    <p className="text-[9px] opacity-80">Online</p>
                                </div>
                            </div>

                            <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-[#e5ddd5] text-[11px]">
                                <div className="flex flex-col items-start">
                                    <div className="bg-white p-2.5 rounded-lg rounded-tl-none shadow-sm max-w-[85%]">
                                        <p>Hi there! 👋 Welcome to FreshMart. How can I help you find what you need today?</p>
                                        <p className="text-[8px] text-right text-gray-400 mt-1">10:42 AM</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <div className="bg-[#dcf8c6] p-2.5 rounded-lg rounded-tr-none shadow-sm max-w-[85%]">
                                        <p>Do you have fresh organic avocados in stock?</p>
                                        <p className="text-[8px] text-right text-gray-500 mt-1">10:43 AM</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-start">
                                    <div className="bg-white p-2.5 rounded-lg rounded-tl-none shadow-sm max-w-[85%] border-l-4 border-[#7c3aed]">
                                        <p className="text-[8px] font-bold text-[#7c3aed] mb-1 uppercase">AI Assistant</p>
                                        <p>Yes! 🥑 We received a fresh shipment this morning. They are in Aisle 4. Price: $1.99 each.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-2 bg-gray-100 flex items-center gap-2">
                                <div className="flex-1 bg-white rounded-full px-4 py-1.5 text-gray-400 text-[10px] shadow-sm">
                                    Type a message
                                </div>
                                <div className="w-8 h-8 bg-[#128c7e] rounded-full flex items-center justify-center text-white">
                                    <Smartphone className="w-4 h-4" />
                                </div>
                            </div>
                        </div>
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-20 h-1 bg-slate-700 rounded-full"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ToggleRow = ({ title, desc, enabled }) => (
    <div className="flex items-center justify-between">
        <div className="flex-1">
            <p className="text-sm font-bold">{title}</p>
            <p className="text-xs text-gray-500">{desc}</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" defaultChecked={enabled} />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7c3aed]"></div>
        </label>
    </div>
);

export default Settings;
