import React, { useState } from 'react';
import { ArrowRight, AlertCircle, Smartphone, Lock } from 'lucide-react';
import logo from '../assets/cosmocartt_logo.png';

const Login = ({ onLogin }) => {
    // State to track the current step: 'MOBILE' or 'OTP'
    const [step, setStep] = useState('MOBILE');

    // Form Inputs
    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // --- STEP 1: SEND OTP ---
    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            // Updated to use relative path if possible or absolute for dev
            const response = await fetch('http://localhost:8000/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mobile_number: mobile }),
            });

            if (response.ok) {
                setStep('OTP'); // Move to next screen
            } else {
                setError('Failed to send OTP. Is the backend running?');
            }
        } catch (err) {
            setError('Connection error. Check backend terminal.');
        } finally {
            setLoading(false);
        }
    };

    // --- STEP 2: VERIFY OTP ---
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const response = await fetch('http://localhost:8000/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mobile_number: mobile, otp: otp, name: name }),
            });

            const data = await response.json();

            if (response.ok) {
                // Modified to pass user info back to parent
                onLogin(name || mobile, 'UID-' + mobile.slice(-4));
            } else {
                setError(data.detail || 'Invalid OTP. Check your terminal!');
            }
        } catch (err) {
            setError('Verification failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-center bg-purple-50 relative font-sans">
            <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-xl border border-purple-100">

                {/* Header */}
                <div className="mb-8 text-center">
                    <img
                        src={logo}
                        alt="CosmoCart Logo"
                        className="w-56 mx-auto mb-4 drop-shadow-lg object-contain"
                    />
                    <p className="text-purple-500 mt-2 font-medium">
                        {step === 'MOBILE' ? 'Enter number to login' : 'Enter the OTP sent to you'}
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 text-red-600 text-sm font-semibold">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
                    </div>
                )}

                {/* --- STEP 1 FORM (Mobile) --- */}
                {step === 'MOBILE' && (
                    <form onSubmit={handleSendOtp} className="space-y-5">
                        <div className="relative">
                            <input
                                type="text"
                                className="w-full bg-purple-50 border border-purple-200 p-4 pl-12 rounded-lg outline-none focus:border-purple-600 font-semibold text-purple-900 placeholder:text-purple-300 transition-colors"
                                placeholder="Full Name"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                required
                            />
                            <ArrowRight className="absolute left-4 top-4 text-purple-300" size={20} />
                        </div>

                        <div className="relative">
                            <input
                                type="tel"
                                className="w-full bg-purple-50 border border-purple-200 p-4 pl-12 rounded-lg outline-none focus:border-purple-600 font-semibold text-purple-900 placeholder:text-purple-300 transition-colors"
                                placeholder="Mobile Number"
                                value={mobile}
                                onChange={e => setMobile(e.target.value)}
                                required
                            />
                            <Smartphone className="absolute left-4 top-4 text-purple-300" size={20} />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-purple-900 text-white rounded-lg font-bold text-lg shadow-lg hover:bg-purple-950 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50"
                        >
                            {loading ? 'Sending...' : 'Get OTP'} <ArrowRight size={20} />
                        </button>
                    </form>
                )}

                {/* --- STEP 2 FORM (OTP) --- */}
                {step === 'OTP' && (
                    <form onSubmit={handleVerifyOtp} className="space-y-5">
                        <div className="relative">
                            <input
                                type="text"
                                className="w-full bg-purple-50 border border-purple-200 p-4 pl-12 rounded-lg outline-none focus:border-purple-600 font-bold text-purple-900 placeholder:text-purple-300 transition-colors text-center text-xl tracking-widest"
                                placeholder="X X X X"
                                value={otp}
                                onChange={e => setOtp(e.target.value)}
                                maxLength={4}
                                required
                            />
                            <Lock className="absolute left-4 top-4 text-purple-300" size={20} />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-purple-900 text-white rounded-lg font-bold text-lg shadow-lg hover:bg-purple-950 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                        >
                            {loading ? 'Verifying...' : 'Login Securely'} <ArrowRight size={20} />
                        </button>

                        {/* Back Button */}
                        <button
                            type="button"
                            onClick={() => setStep('MOBILE')}
                            className="w-full text-purple-400 text-sm font-semibold hover:text-purple-600 mt-4"
                        >
                            Wrong number? Go Back
                        </button>
                    </form>
                )}

            </div>
        </div>
    );
};

export default Login;
