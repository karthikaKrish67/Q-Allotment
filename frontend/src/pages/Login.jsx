import { useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { username, password });
            login(res.data.token, { username: res.data.username, role: res.data.role });
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Invalid username or password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-cover bg-center" style={{ backgroundImage: "url('/assets/login_bg.png')" }}>
            {/* Left Side: Branding/Visuals - with overlay */}
            <div className="hidden lg:flex flex-col justify-center p-20 bg-blue-900/80 backdrop-blur-sm text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400/10 rounded-full translate-y-1/4 -translate-x-1/4 blur-2xl"></div>

                <div className="relative z-10 max-w-lg">
                    <div className="bg-white/10 backdrop-blur-md w-16 h-16 rounded-3xl flex items-center justify-center mb-8 border border-white/20">
                        <ShieldCheck size={32} className="text-white" />
                    </div>
                    <h1 className="text-5xl font-black mb-6 tracking-tight leading-tight">
                        SmartQ <br /> Allotment System
                    </h1>
                    <p className="text-xl text-blue-100 font-medium leading-relaxed mb-12">
                        The definitive platform for organization housing management, automated billing, and maintenance tracking.
                    </p>

                    <div className="space-y-6">
                        {[
                            'Secure Admin Dashboard',
                            'Automated Billing Pipeline',
                            'Real-time Occupancy Analytics'
                        ].map((feature, i) => (
                            <div key={i} className="flex items-center gap-4 text-blue-50/80 font-bold uppercase tracking-widest text-xs">
                                <div className="w-6 h-6 rounded-full bg-blue-400/30 flex items-center justify-center">
                                    <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                                </div>
                                {feature}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Side: Login Form - with glass effect */}
            <div className="flex flex-col justify-center items-center p-8 md:p-20 relative bg-white/90 backdrop-blur-md">
                <div className="w-full max-w-sm">
                    <div className="mb-12">
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Admin Portal</h2>
                        <p className="text-gray-500 font-medium mt-2">Sign in to manage your organization's resources.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 animate-in fade-in slide-in-from-top-2 duration-300">
                                <ShieldCheck size={18} />
                                <p className="text-sm font-bold">{error}</p>
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="relative group">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                                    <User size={20} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Username"
                                    className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500/20 focus:bg-white pl-14 pr-6 py-4 rounded-2xl outline-none transition-all font-bold placeholder:text-gray-400"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="relative group">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                                    <Lock size={20} />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500/20 focus:bg-white pl-14 pr-14 py-4 rounded-2xl outline-none transition-all font-bold placeholder:text-gray-400"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-black rounded-2xl shadow-xl shadow-blue-100 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <span>Authenticate</span>
                                    <ArrowRight size={20} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-12 text-center text-sm font-medium text-gray-400">
                        <p>© 2024 SmartQ Management Systems</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
