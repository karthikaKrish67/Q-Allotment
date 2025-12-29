import { useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, ShieldCheck, ArrowRight, Phone, KeyRound, CheckCircle2 } from 'lucide-react';

const Login = () => {
    const [activeTab, setActiveTab] = useState('admin'); // 'admin' or 'resident'

    // Admin State
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Resident State
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Simulated OTP Handler
    const handleSendOtp = () => {
        if (!phoneNumber || phoneNumber.length < 10) {
            setError('Please enter a valid phone number');
            return;
        }
        setIsLoading(true);
        // Simulate API call delay
        setTimeout(() => {
            setOtpSent(true);
            setIsLoading(false);
            setError('');
            alert(`Development Mode: Your OTP is 1234`); // Simulation
        }, 1500);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            let res;
            if (activeTab === 'admin') {
                res = await axios.post('http://localhost:5000/api/auth/login', { username, password });
            } else {
                if (otp !== '1234') throw new Error('Invalid OTP'); // Client-side check for demo
                res = await axios.post('http://localhost:5000/api/auth/login-phone', { phoneNumber, otp });
            }

            const role = res.data.role;
            // Role check
            if (activeTab === 'admin' && role !== 'admin') {
                throw new Error('Unauthorized access for Admin Portal');
            }

            login(res.data.token, { username: res.data.username, role: role });

            if (role === 'user' || role === 'nonemployee') {
                navigate('/user-dashboard');
            } else {
                navigate('/');
            }

        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || err.message || 'Authentication failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden font-sans">
            {/* Full Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/assets/login_bg_residential.png"
                    alt="Background"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-blue-900/80 to-slate-900/90 backdrop-blur-[2px]"></div>
            </div>

            {/* Main Container */}
            <div className="relative z-10 w-full max-w-5xl h-auto md:h-[600px] flex rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500 mx-4">

                {/* Left Panel: Branding (Glass Effect) */}
                <div className="hidden md:flex w-1/2 flex-col justify-between p-12 bg-white/10 backdrop-blur-md border-r border-white/10 text-white">
                    <div>
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-900 shadow-lg">
                                <ShieldCheck size={28} strokeWidth={2.5} />
                            </div>
                            <span className="text-xl font-bold tracking-wide opacity-90">ResidencyHub</span>
                        </div>
                        <h1 className="text-4xl font-black leading-tight mb-6">
                            Smart Housing <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-200">
                                Management System
                            </span>
                        </h1>
                        <p className="text-lg text-blue-100/80 leading-relaxed font-medium max-w-sm">
                            Streamlined quarters allotment for government and private organizations.
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1 p-4 rounded-2xl bg-black/20 backdrop-blur-sm border border-white/5">
                            <h3 className="text-2xl font-black text-green-400 mb-1">24</h3>
                            <p className="text-xs font-bold uppercase tracking-wider opacity-70">Blocks Managed</p>
                        </div>
                        <div className="flex-1 p-4 rounded-2xl bg-black/20 backdrop-blur-sm border border-white/5">
                            <h3 className="text-2xl font-black text-cyan-400 mb-1">120+</h3>
                            <p className="text-xs font-bold uppercase tracking-wider opacity-70">Active Residents</p>
                        </div>
                    </div>
                </div>

                {/* Right Panel: Login Form (White Glass) */}
                <div className="w-full md:w-1/2 bg-white/95 backdrop-blur-xl p-8 md:p-12 flex flex-col justify-center">

                    {/* Simplified Tab Switcher */}
                    <div className="flex p-1.5 bg-gray-100 rounded-2xl mb-8">
                        <button
                            onClick={() => { setActiveTab('resident'); setError(''); }}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${activeTab === 'resident' ? 'bg-white text-blue-900 shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <Phone size={18} /> Resident
                        </button>
                        <button
                            onClick={() => { setActiveTab('admin'); setError(''); }}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${activeTab === 'admin' ? 'bg-white text-blue-900 shadow-md' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <ShieldCheck size={18} /> Admin
                        </button>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-2xl font-black text-gray-900">
                            {activeTab === 'admin' ? 'Administrative Access' : 'Resident Portal'}
                        </h2>
                        <p className="text-gray-500 font-medium text-sm mt-1">
                            {activeTab === 'admin' ? 'Secure login for system administrators.' : 'Login with your registered phone number.'}
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        {error && (
                            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold animate-in fade-in slide-in-from-top-2">
                                <ShieldCheck size={16} /> {error}
                            </div>
                        )}

                        {activeTab === 'admin' ? (
                            <>
                                <div className="space-y-4">
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                                        <input
                                            type="text"
                                            placeholder="Username"
                                            className="w-full bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white pl-12 pr-4 py-3.5 rounded-xl outline-none transition-all font-bold text-gray-700"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Password"
                                            className="w-full bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white pl-12 pr-12 py-3.5 rounded-xl outline-none transition-all font-bold text-gray-700"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-4 bg-blue-900 hover:bg-black text-white font-bold rounded-xl shadow-lg shadow-blue-900/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                                >
                                    {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <>Authenticate <ArrowRight size={18} /></>}
                                </button>
                            </>
                        ) : (
                            <>
                                <div className="space-y-4">
                                    <div className="relative group">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                                        <input
                                            type="tel"
                                            placeholder="Registered Phone Number"
                                            className="w-full bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white pl-12 pr-4 py-3.5 rounded-xl outline-none transition-all font-bold text-gray-700 disabled:opacity-50"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                            disabled={otpSent}
                                            required
                                        />
                                        {otpSent && <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500" size={20} />}
                                    </div>

                                    {otpSent && (
                                        <div className="relative group animate-in slide-in-from-bottom-2">
                                            <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                                            <input
                                                type="text"
                                                placeholder="Enter OTP (1234)"
                                                className="w-full bg-gray-50 border border-gray-200 focus:border-blue-500 focus:bg-white pl-12 pr-4 py-3.5 rounded-xl outline-none transition-all font-bold text-gray-700"
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value)}
                                                required
                                            />
                                        </div>
                                    )}
                                </div>

                                {!otpSent ? (
                                    <button
                                        type="button"
                                        onClick={handleSendOtp}
                                        disabled={isLoading}
                                        className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Send Validation OTP'}
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg shadow-green-500/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <>Verify & Access <ArrowRight size={18} /></>}
                                    </button>
                                )}

                                {otpSent && (
                                    <button
                                        type="button"
                                        onClick={() => { setOtpSent(false); setOtp(''); }}
                                        className="w-full text-center text-sm font-bold text-gray-500 hover:text-blue-600"
                                    >
                                        Change Phone Number
                                    </button>
                                )}
                            </>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
