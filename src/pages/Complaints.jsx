import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import {
    MessageSquare,
    Clock,
    CheckCircle2,
    AlertCircle,
    Plus,
    User,
    Calendar,
    ChevronRight,
    Search,
    Filter,
    Activity
} from 'lucide-react';

const Complaints = () => {
    const { token } = useContext(AuthContext);
    const [complaints, setComplaints] = useState([]);
    const [nonEmployees, setNonEmployees] = useState([]);
    const [description, setDescription] = useState('');
    const [selectedNonEmployee, setSelectedNonEmployee] = useState('');
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('All');

    const fetchComplaints = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/complaints', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setComplaints(res.data);
        } catch (error) {
            console.error('Failed to fetch complaints', error);
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
            await Promise.all([fetchComplaints(), fetchNonEmployees()]);
            setLoading(false);
        };
        load();
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/complaints', {
                description,
                nonEmployeeId: selectedNonEmployee
            }, { headers: { Authorization: `Bearer ${token}` } });
            setDescription('');
            setSelectedNonEmployee('');
            fetchComplaints();
        } catch (error) {
            console.error('Failed to raise complaint', error);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await axios.put(`http://localhost:5000/api/complaints/${id}/status`, { status }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchComplaints();
        } catch (error) {
            console.error('Failed to update status', error);
        }
    };

    const filteredComplaints = complaints.filter(c =>
        activeTab === 'All' ? true : c.status === activeTab
    );

    const stats = {
        Pending: complaints.filter(c => c.status === 'Pending').length,
        'In Progress': complaints.filter(c => c.status === 'In Progress').length,
        Completed: complaints.filter(c => c.status === 'Completed').length
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="p-8 min-h-full bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/assets/maintenance_bg.png')" }}>
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight text-shadow-strong">Maintenance Pipeline</h1>
                    <p className="text-cyan-200 mt-1 font-bold text-shadow-strong">Coordinate resolution of resident-reported issues.</p>
                </div>
                <div className="flex gap-4">
                    {['Pending', 'In Progress', 'Completed'].map(status => (
                        <div key={status} className="glass-card premium-shadow px-6 py-3 rounded-2xl flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${status === 'Pending' ? 'bg-amber-100 text-amber-600' :
                                status === 'In Progress' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                                }`}>
                                {status === 'Pending' ? <Clock size={18} /> :
                                    status === 'In Progress' ? <Activity size={18} /> : <CheckCircle2 size={18} />}
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-cyan-200 uppercase tracking-widest leading-none">{status}</p>
                                <p className="text-lg font-black text-white">{stats[status]}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Submit Ticket */}
                <div className="lg:col-span-1">
                    <div className="glass-card premium-shadow p-8 rounded-[40px] sticky top-28 border border-white/50">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-red-100 text-red-600 rounded-2xl">
                                <Plus size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-white">Raise Ticket</h2>
                                <p className="text-cyan-200 text-sm font-bold">Record a new maintenance request.</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-xs font-bold text-cyan-200 uppercase tracking-widest ml-1">
                                    <User size={14} /> Affected Resident
                                </label>
                                <select
                                    className="w-full bg-white/10 border-2 border-white/20 focus:border-cyan-400/50 focus:bg-white/20 p-4 rounded-2xl outline-none transition-all font-bold appearance-none text-white"
                                    value={selectedNonEmployee}
                                    onChange={(e) => setSelectedNonEmployee(e.target.value)}
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
                                    <MessageSquare size={14} /> Issue Description
                                </label>
                                <textarea
                                    placeholder="Describe the problem in detail..."
                                    className="w-full bg-white/10 border-2 border-white/20 focus:border-cyan-400/50 focus:bg-white/20 p-4 rounded-2xl outline-none transition-all font-bold min-h-[120px] resize-none text-white placeholder:text-gray-400"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                ></textarea>
                            </div>

                            <button type="submit" className="w-full py-5 bg-red-600 hover:bg-red-700 text-white font-black rounded-2xl shadow-xl shadow-red-100 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 uppercase tracking-widest text-xs">
                                Submit Maintenance Request
                            </button>
                        </form>
                    </div>
                </div>

                {/* Ticket Feed */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-2xl w-fit">
                        {['All', 'Pending', 'In Progress', 'Completed'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="space-y-4">
                        {filteredComplaints.map(c => (
                            <div key={c.id} className="glass-card premium-shadow p-6 rounded-[32px] group hover:translate-x-1 transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400">
                                            <User size={20} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-black text-white leading-none">{c.NonEmployee?.name}</h3>
                                            <div className="flex items-center gap-2 mt-2 text-[10px] font-bold text-cyan-200 uppercase tracking-widest">
                                                <Calendar size={12} />
                                                {new Date(c.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                                            </div>
                                        </div>
                                    </div>
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${c.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                                        c.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                                        }`}>
                                        {c.status}
                                    </span>
                                </div>

                                <p className="text-white font-bold px-1 mb-6 leading-relaxed bg-white/10 p-4 rounded-2xl border border-white/20 italic">
                                    "{c.description}"
                                </p>

                                <div className="flex items-center justify-between pt-2 border-t border-gray-100/50">
                                    <div className="flex gap-2">
                                        {c.status !== 'In Progress' && c.status !== 'Completed' && (
                                            <button
                                                onClick={() => handleStatusUpdate(c.id, 'In Progress')}
                                                className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-xl transition-colors"
                                            >
                                                Start Work
                                            </button>
                                        )}
                                        {c.status !== 'Completed' && (
                                            <button
                                                onClick={() => handleStatusUpdate(c.id, 'Completed')}
                                                className="text-[10px] font-black uppercase tracking-widest text-green-600 hover:bg-green-50 px-4 py-2 rounded-xl transition-colors"
                                            >
                                                Complete
                                            </button>
                                        )}
                                    </div>
                                    <button className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors">
                                        View History <ChevronRight size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}

                        {filteredComplaints.length === 0 && (
                            <div className="glass-card premium-shadow p-20 rounded-[40px] text-center">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle2 size={32} className="text-gray-300" />
                                </div>
                                <h3 className="text-xl font-black text-white">No tickets found</h3>
                                <p className="text-cyan-200 mt-1 font-bold italic">Everything seems to be running smoothly.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Complaints;
