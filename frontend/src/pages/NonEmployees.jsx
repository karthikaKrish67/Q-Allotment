import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { UserPlus, Pencil, Trash2, Search, Phone, MapPin, Hash, User as UserIcon } from 'lucide-react';

const NonEmployees = () => {
    const { token } = useContext(AuthContext);
    const [nonEmployees, setNonEmployees] = useState([]);
    const [formData, setFormData] = useState({ name: '', privatePartyCode: '', address: '', phoneNumber: '' });
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchNonEmployees = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/nonEmployees', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNonEmployees(res.data);
        } catch (error) {
            console.error('Failed to fetch nonEmployees', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNonEmployees();
    }, [token]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await axios.put(`http://localhost:5000/api/nonEmployees/${editingId}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post('http://localhost:5000/api/nonEmployees', formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            setFormData({ name: '', privatePartyCode: '', address: '', phoneNumber: '' });
            setEditingId(null);
            fetchNonEmployees();
        } catch (error) {
            console.error('Failed to save nonEmployee', error);
        }
    };

    const handleEdit = (nonEmployee) => {
        setFormData({
            name: nonEmployee.name,
            privatePartyCode: nonEmployee.privatePartyCode,
            address: nonEmployee.address,
            phoneNumber: nonEmployee.phoneNumber
        });
        setEditingId(nonEmployee.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this resident?')) return;
        try {
            await axios.delete(`http://localhost:5000/api/nonEmployees/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchNonEmployees();
        } catch (error) {
            console.error('Failed to delete nonEmployee', error);
        }
    };

    const filteredNonEmployees = nonEmployees.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.privatePartyCode.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="p-8 min-h-full bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/assets/residents_bg.png')" }}>
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight text-shadow-strong">Non-Employee Management</h1>
                    <p className="text-blue-200 mt-1 font-bold text-shadow-strong">Register and manage township residents (Non-Employees).</p>
                </div>
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-400 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name or code..."
                        className="pl-12 pr-6 py-3 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl w-full md:w-80 focus:ring-2 focus:ring-blue-500/50 outline-none font-bold text-white placeholder:text-gray-400 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="lg:col-span-1">
                    <div className="glass-card premium-shadow p-8 rounded-3xl sticky top-28">
                        <div className="flex items-center gap-3 mb-6">
                            <div className={`p-2 rounded-xl ${editingId ? 'bg-amber-500/20 text-amber-300' : 'bg-blue-500/20 text-blue-300'}`}>
                                {editingId ? <Pencil size={20} /> : <UserPlus size={20} />}
                            </div>
                            <h2 className="text-xl font-black text-white">
                                {editingId ? 'Edit Resident' : 'Register Resident'}
                            </h2>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-blue-300 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                                <input
                                    name="name"
                                    placeholder="e.g. John Doe"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border-2 border-white/10 focus:border-blue-500/50 focus:bg-white/10 p-3.5 rounded-2xl outline-none transition-all font-bold text-white placeholder:text-gray-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-blue-300 uppercase tracking-widest mb-2 ml-1">Private Party Code</label>
                                <input
                                    name="privatePartyCode"
                                    placeholder="e.g. PP-10234"
                                    value={formData.privatePartyCode}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border-2 border-white/10 focus:border-blue-500/50 focus:bg-white/10 p-3.5 rounded-2xl outline-none transition-all font-bold text-white placeholder:text-gray-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-blue-300 uppercase tracking-widest mb-2 ml-1">Address</label>
                                <textarea
                                    name="address"
                                    placeholder="Complete residential address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border-2 border-white/10 focus:border-blue-500/50 focus:bg-white/10 p-3.5 rounded-2xl outline-none transition-all font-bold text-white placeholder:text-gray-500 min-h-[100px]"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-blue-300 uppercase tracking-widest mb-2 ml-1">Phone Number</label>
                                <input
                                    name="phoneNumber"
                                    placeholder="+91 00000 00000"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border-2 border-white/10 focus:border-blue-500/50 focus:bg-white/10 p-3.5 rounded-2xl outline-none transition-all font-bold text-white placeholder:text-gray-500"
                                />
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="submit"
                                    className={`flex-1 py-4 rounded-2xl font-bold text-white shadow-lg transition-transform hover:scale-[1.02] active:scale-95 ${editingId ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-200' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
                                        }`}
                                >
                                    {editingId ? 'Update Record' : 'Save Resident'}
                                </button>
                                {editingId && (
                                    <button
                                        type="button"
                                        onClick={() => { setEditingId(null); setFormData({ name: '', privatePartyCode: '', address: '', phoneNumber: '' }); }}
                                        className="px-6 bg-white/10 text-white font-bold rounded-2xl hover:bg-white/20 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

                {/* List Section */}
                <div className="lg:col-span-2 space-y-4">
                    {filteredNonEmployees.map((u) => (
                        <div key={u.id} className="glass-card premium-shadow p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:translate-x-1 transition-all duration-300">
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-blue-300 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 ring-1 ring-white/20">
                                    <UserIcon size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-white tracking-tight">{u.name}</h3>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className="flex items-center gap-1 text-xs font-bold text-blue-200 bg-white/10 px-2 py-1 rounded-lg uppercase tracking-wider border border-white/10">
                                            <Hash size={12} /> {u.privatePartyCode}
                                        </span>
                                        {u.phoneNumber && (
                                            <span className="flex items-center gap-1 text-xs font-bold text-emerald-300 bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20">
                                                <Phone size={12} /> {u.phoneNumber}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="hidden md:flex flex-col text-right">
                                    <div className="flex items-center gap-2 text-gray-300 text-sm justify-end font-medium">
                                        <MapPin size={14} className="text-gray-400" />
                                        <span>{u.address.length > 30 ? u.address.substring(0, 30) + '...' : u.address}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(u)}
                                        className="p-3 text-amber-600 hover:bg-amber-50 rounded-xl transition-colors"
                                        title="Edit Resident"
                                    >
                                        <Pencil size={20} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(u.id)}
                                        className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                        title="Delete Resident"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {filteredNonEmployees.length === 0 && (
                        <div className="glass-card premium-shadow p-12 rounded-3xl text-center">
                            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                                <Search size={32} className="text-gray-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white">No residents found</h3>
                            <p className="text-gray-400 mt-1">Try adjusting your search criteria.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NonEmployees;
