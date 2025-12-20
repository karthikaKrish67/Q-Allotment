import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import {
    Receipt,
    Calendar,
    DollarSign,
    User,
    CheckCircle,
    XCircle,
    Search,
    ArrowUpRight,
    TrendingUp,
    Clock
} from 'lucide-react';

const Billing = () => {
    const { token } = useContext(AuthContext);
    const [bills, setBills] = useState([]);
    const [nonEmployees, setNonEmployees] = useState([]);
    const [formData, setFormData] = useState({ nonEmployeeId: '', month: '', rentAmount: '', maintenanceAmount: '' });
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchBills = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/bills', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBills(res.data);
        } catch (error) {
            console.error('Failed to fetch bills', error);
        }
    };

    const fetchNonEmployees = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/nonEmployees', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNonEmployees(res.data);
        } catch (error) {
            console.error('Failed to fetch nonEmployees', error);
        }
    };

    useEffect(() => {
        const load = async () => {
            await Promise.all([fetchBills(), fetchNonEmployees()]);
            setLoading(false);
        };
        load();
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/bills', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFormData({ nonEmployeeId: '', month: '', rentAmount: '', maintenanceAmount: '' });
            fetchBills();
        } catch (error) {
            console.error('Failed to generate bill', error);
        }
    };

    const handlePay = async (id) => {
        try {
            await axios.put(`http://localhost:5000/api/bills/${id}/pay`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchBills();
        } catch (error) {
            console.error('Failed to pay bill', error);
        }
    };

    const filteredBills = bills.filter(b =>
        b.NonEmployee?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.month.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalRevenue = bills.filter(b => b.isPaid).reduce((acc, curr) => acc + curr.totalAmount, 0);
    const pendingAmount = bills.filter(b => !b.isPaid).reduce((acc, curr) => acc + curr.totalAmount, 0);

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="p-8 min-h-full bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/assets/billing_bg.png')" }}>
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight text-shadow-strong">Billing & Finance</h1>
                    <p className="text-cyan-200 mt-1 font-bold text-shadow-strong">Manage rent, maintenance, and payment tracking.</p>
                </div>
                <div className="flex gap-4">
                    <div className="glass-card premium-shadow px-6 py-3 rounded-2xl flex items-center gap-3">
                        <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                            <TrendingUp size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-cyan-200 uppercase tracking-widest leading-none">Collected</p>
                            <p className="text-lg font-black text-white">${totalRevenue}</p>
                        </div>
                    </div>
                    <div className="glass-card premium-shadow px-6 py-3 rounded-2xl flex items-center gap-3">
                        <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                            <Clock size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-cyan-200 uppercase tracking-widest leading-none">Pending</p>
                            <p className="text-lg font-black text-white">${pendingAmount}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Generation Form */}
                <div className="xl:col-span-1">
                    <div className="glass-card premium-shadow p-8 rounded-[40px] sticky top-28 border border-white/40">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
                                <Receipt size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-white">Generate Invoice</h2>
                                <p className="text-cyan-200 text-sm font-bold">Create monthly bills for residents.</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-xs font-bold text-cyan-200 uppercase tracking-widest ml-1">
                                    <User size={14} /> Resident
                                </label>
                                <select
                                    className="w-full bg-white/10 border-2 border-white/20 focus:border-cyan-400/50 focus:bg-white/20 p-4 rounded-2xl outline-none transition-all font-bold appearance-none text-white"
                                    value={formData.nonEmployeeId}
                                    onChange={(e) => setFormData({ ...formData, nonEmployeeId: e.target.value })}
                                    required
                                >
                                    <option value="" className="text-gray-900">Select Resident</option>
                                    {nonEmployees.map(u => (
                                        <option key={u.id} value={u.id} className="text-gray-900">{u.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-xs font-bold text-cyan-200 uppercase tracking-widest ml-1">
                                    <Calendar size={14} /> Billing Month
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. June 2024"
                                    value={formData.month}
                                    onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                                    className="w-full bg-white/10 border-2 border-white/20 focus:border-cyan-400/50 focus:bg-white/20 p-4 rounded-2xl outline-none transition-all font-bold text-white placeholder:text-gray-400"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-xs font-bold text-cyan-200 uppercase tracking-widest ml-1">
                                        <DollarSign size={14} /> Rent
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        value={formData.rentAmount}
                                        onChange={(e) => setFormData({ ...formData, rentAmount: e.target.value })}
                                        className="w-full bg-white/10 border-2 border-white/20 focus:border-cyan-400/50 focus:bg-white/20 p-4 rounded-2xl outline-none transition-all font-bold text-white placeholder:text-gray-400"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-xs font-bold text-cyan-200 uppercase tracking-widest ml-1">
                                        <DollarSign size={14} /> Maint.
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        value={formData.maintenanceAmount}
                                        onChange={(e) => setFormData({ ...formData, maintenanceAmount: e.target.value })}
                                        className="w-full bg-white/10 border-2 border-white/20 focus:border-cyan-400/50 focus:bg-white/20 p-4 rounded-2xl outline-none transition-all font-bold text-white placeholder:text-gray-400"
                                        required
                                    />
                                </div>
                            </div>

                            <button type="submit" className="w-full py-5 bg-gray-900 hover:bg-black text-white font-black rounded-[20px] shadow-xl shadow-gray-200 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3">
                                <Receipt size={20} />
                                Generate & Send
                            </button>
                        </form>
                    </div>
                </div>

                {/* History Table */}
                <div className="xl:col-span-2 space-y-6">
                    <div className="relative group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Search by resident name or month..."
                            className="w-full pl-14 pr-8 py-5 bg-white glass-card premium-shadow rounded-[30px] focus:ring-4 focus:ring-blue-500/5 border-none outline-none font-bold text-gray-700"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="glass-card premium-shadow rounded-[40px] overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50">
                                    <th className="px-8 py-6 text-xs font-black text-cyan-200 uppercase tracking-widest">Resident</th>
                                    <th className="px-8 py-6 text-xs font-black text-cyan-200 uppercase tracking-widest">Billing Period</th>
                                    <th className="px-8 py-6 text-xs font-black text-cyan-200 uppercase tracking-widest">Amount</th>
                                    <th className="px-8 py-6 text-xs font-black text-cyan-200 uppercase tracking-widest">Status</th>
                                    <th className="px-8 py-6 text-xs font-black text-cyan-200 uppercase tracking-widest">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBills.map((b) => (
                                    <tr key={b.id} className="border-t border-gray-100 hover:bg-blue-50/30 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs">
                                                    {b.NonEmployee?.name?.charAt(0)}
                                                </div>
                                                <span className="font-bold text-white">{b.NonEmployee?.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-white font-bold">{b.month}</td>
                                        <td className="px-8 py-6 font-black text-white">${b.totalAmount}</td>
                                        <td className="px-8 py-6">
                                            <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${b.isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                {b.isPaid ? <CheckCircle size={10} /> : <XCircle size={10} />}
                                                {b.isPaid ? 'Paid' : 'Unpaid'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            {!b.isPaid ? (
                                                <button
                                                    onClick={() => handlePay(b.id)}
                                                    className="flex items-center gap-2 bg-green-600 text-white px-5 py-2 rounded-xl text-xs font-black hover:bg-green-700 shadow-lg shadow-green-100 transition-all hover:scale-105"
                                                >
                                                    Mark Paid
                                                    <ArrowUpRight size={14} />
                                                </button>
                                            ) : (
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Completed</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {filteredBills.length === 0 && (
                            <div className="p-20 text-center">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Receipt size={32} className="text-gray-300" />
                                </div>
                                <h3 className="text-xl font-black text-white italic">No billing records found</h3>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Billing;
