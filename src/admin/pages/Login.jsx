
import React, { useState } from 'react';
import { ArrowRight, AlertCircle } from 'lucide-react';

const Login = ({ onLogin }) => {
    // Keeping the Admin logic (Email/Password) instead of Member ID
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simple validation logic
        // TODO: Replace with FastAPI call to authenticate user
        if (email === 'demo' && password === '123') {
            onLogin();
        } else {
            setError('Invalid credentials. Try demo / 123');
        }
    };

    return (
        // 1. Main Container (using your snippet's bg-purple-50)
        <div className="min-h-screen flex flex-col items-center justify-center bg-purple-50 relative font-sans">

            {/* 2. Card Container (Exact match to your snippet) */}
            <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-xl border border-purple-100">

                {/* Header Section */}
                <div className="mb-8 text-center">
                    {/* Logo with your snippet's styling */}
                    <img
                        src="/logo/Cosmocartt_login.png"
                        alt="CosmoCart Logo"
                        className="w-56 mx-auto mb-4 drop-shadow-lg object-contain"
                    />
                    <h1 className="text-xl font-bold text-purple-900 tracking-tight hidden">CosmoCart</h1>
                    <p className="text-purple-500 mt-2 font-medium">Please authenticate to continue</p>
                </div>

                {/* Form Section */}
                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Error Message (Kept this for functionality, styled to match) */}
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 text-red-600 text-sm font-semibold">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
                        </div>
                    )}

                    {/* Input 1: Full Name */}
                    <input
                        className="w-full bg-purple-50 border border-purple-200 p-4 rounded-lg outline-none focus:border-purple-600 font-semibold text-purple-900 placeholder:text-purple-300 transition-colors"
                        placeholder="Full Name"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />

                    {/* Input 2: Password (Changed type to 'password' for security) */}
                    <input
                        type="password"
                        className="w-full bg-purple-50 border border-purple-200 p-4 rounded-lg outline-none focus:border-purple-600 font-semibold text-purple-900 placeholder:text-purple-300 transition-colors"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />

                    {/* Button (Exact match to your snippet) */}
                    <button
                        type="submit"
                        className="w-full py-4 bg-purple-900 text-white rounded-lg font-bold text-lg shadow-lg hover:bg-purple-950 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                    >
                        Access Dashboard <ArrowRight size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
