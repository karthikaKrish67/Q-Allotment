import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import {
    Home,
    Plus,
    UserPlus,
    X,
    Trash2,
    Edit3,
    CheckCircle2,
    AlertCircle,
    Search,
    Building2,
    Hash,
    Layers,
    ArrowRight,
    BarChart3
} from 'lucide-react';

const Quarters = () => {
    const { token } = useContext(AuthContext);
    const [quarters, setQuarters] = useState([]);
    const [nonEmployees, setNonEmployees] = useState([]);
    const [allotmentData, setAllotmentData] = useState({ quarterId: '', nonEmployeeId: '' });
    const [showAllotModal, setShowAllotModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedQuarter, setSelectedQuarter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeView, setActiveView] = useState('blocks'); // 'blocks' or 'quarters'
    const [selectedBlock, setSelectedBlock] = useState(null);

    // Form data for creation
    const [formData, setFormData] = useState({
        mainQuarter: '',
        subQuarter: '',
        block: 'Block 1',
        type: 'Type I',
        status: 'Vacant'
    });

    const [showAddBlockModal, setShowAddBlockModal] = useState(false);
    const [newBlockName, setNewBlockName] = useState('');
    const [blocks, setBlocks] = useState([]); // Dynamic fetch

    const [showDeleteBlockModal, setShowDeleteBlockModal] = useState(false);
    const [blockToDelete, setBlockToDelete] = useState(null);

    const types = ['Type I', 'Type II', 'Type III', 'Type IV']; // Moved here to avoid re-declaration

    const fetchQuarters = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/quarters', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setQuarters(res.data);
        } catch (error) {
            console.error('Failed to fetch quarters', error);
        }
    };

    // ... existing functions ...

    const handleDeleteBlock = async () => {
        if (!blockToDelete) return;
        try {
            await axios.delete(`http://localhost:5000/api/blocks/${blockToDelete}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowDeleteBlockModal(false);
            setBlockToDelete(null);
            fetchBlocks();
        } catch (error) {
            alert('Delete failed: ' + (error.response?.data?.error || error.message));
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

    const fetchBlocks = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/blocks', {
                headers: { Authorization: `Bearer ${token}` }
            });
            // We expect res.data to be an array of objects {id, name}. We map to just names for the string array expected by current UI
            // Wait, existing UI expects strings. Let's keep it simple and map to names.
            setBlocks(res.data.map(b => b.name));
            // Also ensure default block in form is valid if possible, but 'Block 1' is hardcoded default. 
        } catch (error) {
            console.error('Failed to fetch blocks', error);
        }
    };

    const handleAddBlock = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/blocks', { name: newBlockName }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNewBlockName('');
            setShowAddBlockModal(false);
            fetchBlocks(); // Refresh list
        } catch (error) {
            alert('Failed to add block: ' + (error.response?.data?.error || error.message));
        }
    };

    useEffect(() => {
        const load = async () => {
            await Promise.all([fetchQuarters(), fetchNonEmployees(), fetchBlocks()]);
            setLoading(false);
        };
        load();
    }, [token]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const quarterNumber = `${formData.mainQuarter}${formData.subQuarter}`.trim();
            if (!quarterNumber) {
                alert('Quarter number is required');
                return;
            }

            await axios.post('http://localhost:5000/api/quarters', {
                quarterNumber,
                block: formData.block,
                type: formData.type,
                status: formData.status
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFormData({ ...formData, mainQuarter: '', subQuarter: '' });
            fetchQuarters();
        } catch (error) {
            console.error('Failed to create quarter', error);
            alert('Failed to create quarter: ' + (error.response?.data?.error || error.message));
        }
    };

    const handleAllotmentSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/allotments/allot', allotmentData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowAllotModal(false);
            setAllotmentData({ quarterId: '', nonEmployeeId: '' });
            fetchQuarters();
        } catch (error) {
            alert('Allotment failed: ' + (error.response?.data?.error || error.message));
        }
    };

    const handleDeleteQuarter = async () => {
        if (!selectedQuarter) return;
        try {
            await axios.delete(`http://localhost:5000/api/quarters/${selectedQuarter.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowDeleteModal(false);
            setSelectedQuarter(null);
            fetchQuarters();
        } catch (error) {
            alert('Delete failed: ' + (error.response?.data?.error || error.message));
        }
    };

    const handleVacateQuarter = async (quarterId) => {
        try {
            await axios.put(`http://localhost:5000/api/quarters/${quarterId}/vacate`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchQuarters();
        } catch (error) {
            alert('Vacate failed: ' + (error.response?.data?.error || error.message));
        }
    };

    const handleEditQuarter = async (e) => {
        e.preventDefault();
        if (!selectedQuarter) return;
        try {
            await axios.put(`http://localhost:5000/api/quarters/${selectedQuarter.id}`, {
                quarterNumber: selectedQuarter.quarterNumber,
                block: selectedQuarter.block,
                type: selectedQuarter.type,
                status: selectedQuarter.status
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowEditModal(false);
            setSelectedQuarter(null);
            fetchQuarters();
        } catch (error) {
            alert('Update failed: ' + (error.response?.data?.error || error.message));
        }
    };

    const handleBlockClick = (block) => {
        setSelectedBlock(block);
        setFormData(prev => ({ ...prev, block }));
        setActiveView('quarters');
    };

    const handleBackToBlocks = () => {
        setActiveView('blocks');
        setSelectedBlock(null);
    };

    const filteredQuarters = quarters.filter(q => {
        const matchesSearch = q.quarterNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            q.type.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesBlock = !selectedBlock || q.block === selectedBlock;
        return matchesSearch && matchesBlock;
    });

    // Detailed grouping logic for the block view
    const getGroupedQuarters = (blockQuarters) => {
        const groupedByViewType = {};

        blockQuarters.forEach(q => {
            if (!groupedByViewType[q.type]) groupedByViewType[q.type] = {};

            // Parse main and sub: e.g., "1A", "10", "15C"
            const match = q.quarterNumber.match(/^(\d+)([a-zA-Z]*)$/);
            const main = match ? match[1] : q.quarterNumber;
            const sub = match ? match[2] : '';

            if (!groupedByViewType[q.type][main]) {
                groupedByViewType[q.type][main] = [];
            }
            groupedByViewType[q.type][main].push({ ...q, sub });
        });

        // Sort main numbers numerically and subs alphabetically
        Object.keys(groupedByViewType).forEach(type => {
            const sortedMains = {};
            Object.keys(groupedByViewType[type])
                .sort((a, b) => parseInt(a) - parseInt(b))
                .forEach(main => {
                    sortedMains[main] = groupedByViewType[type][main].sort((a, b) => a.sub.localeCompare(b.sub));
                });
            groupedByViewType[type] = sortedMains;
        });

        return groupedByViewType;
    };

    // Calculate stats for each block
    const getBlockStats = (blockName) => {
        const blockQuarters = quarters.filter(q => q.block === blockName);
        return {
            total: blockQuarters.length,
            vacant: blockQuarters.filter(q => q.status === 'Vacant').length,
            occupied: blockQuarters.filter(q => q.status === 'Occupied').length,
            typeI: blockQuarters.filter(q => q.type === 'Type I').length,
            typeII: blockQuarters.filter(q => q.type === 'Type II').length,
            typeIII: blockQuarters.filter(q => q.type === 'Type III').length,
            typeIV: blockQuarters.filter(q => q.type === 'Type IV').length
        };
    };

    // Calculate overall stats
    const totalQuarters = quarters.length;
    const occupiedCount = quarters.filter(q => q.status === 'Occupied').length;
    const vacantCount = quarters.filter(q => q.status === 'Vacant').length;



    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="p-8 min-h-full bg-cover bg-center bg-fixed transition-all duration-500" style={{ backgroundImage: "url('/assets/quarters_bg.png')" }}>
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        {activeView === 'quarters' && (
                            <button
                                onClick={handleBackToBlocks}
                                className="text-cyan-200 hover:text-white flex items-center gap-1 font-bold text-sm transition-colors"
                            >
                                <ArrowRight className="rotate-180" size={16} />
                                Blocks
                            </button>
                        )}
                        {activeView === 'quarters' && <span className="text-white/30 text-sm">/</span>}
                        <h1 className="text-3xl font-black text-white tracking-tight text-shadow-strong">
                            {activeView === 'blocks' ? 'Quarters Management' : selectedBlock}
                        </h1>
                    </div>
                    <p className="text-cyan-200 font-bold text-shadow-strong">
                        {activeView === 'blocks'
                            ? `${blocks.length} Blocks • ${quarters.length} Total Quarters`
                            : `${getBlockStats(selectedBlock).total} Quarters in ${selectedBlock}`
                        }
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowAddBlockModal(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/30 transition-all hover:scale-105 active:scale-95"
                    >
                        <Plus size={20} />
                        <span className="hidden sm:inline">Add Block</span>
                    </button>
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search quarters..."
                            className="pl-12 pr-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl focus:ring-2 focus:ring-blue-500/50 outline-none font-bold text-white placeholder:text-gray-400 w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar - Creation Form (Only shown when a block is selected or in All view if we want, but user said 'within selected block context') */}
                <div className="lg:col-span-1">
                    <div className="glass-card premium-shadow p-8 rounded-3xl sticky top-28">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-xl bg-green-500/20 text-green-300">
                                <Plus size={20} />
                            </div>
                            <h2 className="text-xl font-black text-white">New Quarter</h2>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-cyan-200 uppercase tracking-widest mb-2 ml-1">Main (Num)</label>
                                    <input
                                        name="mainQuarter"
                                        placeholder="1, 10..."
                                        value={formData.mainQuarter}
                                        onChange={handleChange}
                                        className="w-full bg-white/10 border-2 border-white/20 focus:border-cyan-400/50 focus:bg-white/20 p-3.5 rounded-2xl outline-none transition-all font-bold text-white placeholder:text-gray-400"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-cyan-200 uppercase tracking-widest mb-2 ml-1">Sub (Alpha)</label>
                                    <input
                                        name="subQuarter"
                                        placeholder="A, B..."
                                        value={formData.subQuarter}
                                        onChange={handleChange}
                                        className="w-full bg-white/10 border-2 border-white/20 focus:border-cyan-400/50 focus:bg-white/20 p-3.5 rounded-2xl outline-none transition-all font-bold text-white placeholder:text-gray-400"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-cyan-200 uppercase tracking-widest mb-2 ml-1">Block</label>
                                <select
                                    name="block"
                                    value={formData.block}
                                    onChange={handleChange}
                                    className="w-full bg-white/10 border-2 border-white/20 focus:border-cyan-400/50 focus:bg-white/20 p-3.5 rounded-2xl outline-none transition-all font-bold appearance-none text-white"
                                    required
                                >
                                    {blocks.map(b => (
                                        <option key={b} value={b} className="text-gray-900">{b}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-cyan-200 uppercase tracking-widest mb-2 ml-1">Housing Type</label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="w-full bg-white/10 border-2 border-white/20 focus:border-cyan-400/50 focus:bg-white/20 p-3.5 rounded-2xl outline-none transition-all font-bold appearance-none text-white"
                                    required
                                >
                                    {types.map(t => (
                                        <option key={t} value={t} className="text-gray-900">{t}</option>
                                    ))}
                                </select>
                            </div>
                            <button
                                type="submit"
                                className="w-full py-4 mt-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-2xl shadow-lg shadow-green-100 transition-all hover:scale-[1.02] active:scale-95"
                            >
                                Create Quarter
                            </button>
                        </form>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-3">
                    {activeView === 'blocks' && !searchTerm ? (
                        /* Blocks List View */
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {blocks.map(block => {
                                const stats = getBlockStats(block);
                                return (
                                    <div
                                        key={block}
                                        onClick={() => handleBlockClick(block)}
                                        className="glass-card premium-shadow p-8 rounded-[32px] text-left group hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer relative"
                                    >
                                        <div className="absolute top-6 right-6 z-10">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setBlockToDelete(block);
                                                    setShowDeleteBlockModal(true);
                                                }}
                                                className="p-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all"
                                                title="Delete Block"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-2xl shadow-lg group-hover:rotate-6 transition-transform">
                                                {block.replace('Block ', '')}
                                            </div>
                                            <div className="text-right mt-8">
                                                <p className="text-[10px] font-black text-cyan-200 uppercase tracking-widest">Total</p>
                                                <p className="text-2xl font-black text-white">{stats.total}</p>
                                            </div>
                                        </div>
                                        <h3 className="text-2xl font-black text-white mb-4">{block}</h3>
                                        <div className="grid grid-cols-2 gap-2 mt-4">
                                            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-2 text-center">
                                                <p className="text-[9px] font-bold text-emerald-300 uppercase">Vacant</p>
                                                <p className="text-sm font-black text-emerald-400">{stats.vacant}</p>
                                            </div>
                                            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-2 text-center">
                                                <p className="text-[9px] font-bold text-red-300 uppercase">Allocated</p>
                                                <p className="text-sm font-black text-red-400">{stats.occupied}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 mt-6 text-blue-400 font-bold text-sm group-hover:gap-4 transition-all">
                                            View Quarters <ArrowRight size={16} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        /* Quarters Detailed View Grouped by Type and Main Quarter */
                        <div className="space-y-12">
                            {Object.entries(getGroupedQuarters(filteredQuarters)).map(([type, mains]) => (
                                <div key={type} className="glass-card premium-shadow p-8 rounded-[32px] border-t-4 border-blue-500/30">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="p-3 bg-blue-500/20 rounded-2xl text-blue-300">
                                            <Layers size={24} />
                                        </div>
                                        <h3 className="text-2xl font-black text-white">{type}</h3>
                                    </div>

                                    <div className="space-y-8">
                                        {Object.entries(mains).map(([main, subQuarters]) => (
                                            <div key={main} className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                                <h4 className="text-sm font-black text-cyan-200 uppercase tracking-widest mb-4 flex items-center gap-2">
                                                    <Hash size={14} /> Main Quarter {main}
                                                </h4>
                                                <div className="flex flex-wrap gap-4">
                                                    {subQuarters.map(q => (
                                                        <div
                                                            key={q.id}
                                                            className={`
                                                                w-28 h-32 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all duration-300 relative group
                                                                ${q.status === 'Occupied'
                                                                    ? 'bg-red-500 text-white shadow-lg shadow-red-200'
                                                                    : 'bg-emerald-500 text-white shadow-lg shadow-emerald-200 hover:scale-105 hover:-translate-y-1 hover:shadow-xl'
                                                                }
                                                            `}
                                                        >
                                                            <Home size={28} fill="currentColor" strokeWidth={1.5} />
                                                            <span className="font-bold text-sm tracking-wide">{q.quarterNumber}</span>
                                                            {!selectedBlock && (
                                                                <span className="text-[9px] font-bold text-white/80 bg-black/20 px-2 py-0.5 rounded-full">
                                                                    {q.block}
                                                                </span>
                                                            )}
                                                            <span className={`text-[10px] font-bold uppercase ${q.status === 'Occupied' ? 'text-white/70' : 'text-white/80'}`}>
                                                                {q.status}
                                                            </span>

                                                            {/* Action buttons overlay */}
                                                            <div className="absolute inset-0 bg-black/60 rounded-2xl opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2">
                                                                {q.status === 'Vacant' && (
                                                                    <button
                                                                        onClick={() => {
                                                                            setAllotmentData({ ...allotmentData, quarterId: q.id });
                                                                            setShowAllotModal(true);
                                                                        }}
                                                                        className="p-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
                                                                        title="Allot"
                                                                    >
                                                                        <UserPlus size={16} />
                                                                    </button>
                                                                )}
                                                                {q.status === 'Occupied' && (
                                                                    <button
                                                                        onClick={() => handleVacateQuarter(q.id)}
                                                                        className="p-2 bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors"
                                                                        title="Vacate"
                                                                    >
                                                                        <CheckCircle2 size={16} />
                                                                    </button>
                                                                )}
                                                                <button
                                                                    onClick={() => {
                                                                        setSelectedQuarter(q);
                                                                        setShowEditModal(true);
                                                                    }}
                                                                    className="p-2 bg-amber-500 hover:bg-amber-600 rounded-lg transition-colors"
                                                                    title="Edit"
                                                                >
                                                                    <Edit3 size={16} />
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        setSelectedQuarter(q);
                                                                        setShowDeleteModal(true);
                                                                    }}
                                                                    className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                                                                    title="Delete"
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            {filteredQuarters.length === 0 && (
                                <div className="text-center py-20 bg-white/5 rounded-[32px]">
                                    <Building2 size={48} className="mx-auto mb-4 text-white/50" />
                                    <p className="text-xl font-bold text-white">No quarters found in this category</p>
                                    <p className="text-cyan-200 mt-2">Adjust your search or add new quarters</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Allotment Modal */}
            {showAllotModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white p-10 rounded-[40px] shadow-2xl w-full max-w-xl animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-8">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl">
                                    <UserPlus size={24} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-gray-900">Allot Quarter</h2>
                                    <p className="text-gray-600 font-medium">Link a vacant quarter to a resident.</p>
                                </div>
                            </div>
                            <button onClick={() => setShowAllotModal(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                                <X size={24} className="text-gray-400" />
                            </button>
                        </div>

                        <form onSubmit={handleAllotmentSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                                <div className="space-y-3">
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Quarter</label>
                                    <select
                                        className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500/20 focus:bg-white p-4 rounded-2xl outline-none transition-all font-black"
                                        value={allotmentData.quarterId}
                                        onChange={(e) => setAllotmentData({ ...allotmentData, quarterId: e.target.value })}
                                        required
                                    >
                                        <option value="">Select Quarter</option>
                                        {quarters.filter(q => q.status === 'Vacant').map(q => (
                                            <option key={q.id} value={q.id}>{q.quarterNumber} ({q.block})</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 mt-3 text-gray-300">
                                    <ArrowRight size={24} />
                                </div>

                                <div className="space-y-3">
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Resident</label>
                                    <select
                                        className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500/20 focus:bg-white p-4 rounded-2xl outline-none transition-all font-black"
                                        value={allotmentData.nonEmployeeId}
                                        onChange={(e) => setAllotmentData({ ...allotmentData, nonEmployeeId: e.target.value })}
                                        required
                                    >
                                        <option value="">Select Resident</option>
                                        {nonEmployees.map(u => (
                                            <option key={u.id} value={u.id}>{u.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="pt-4 flex gap-4">
                                <button type="submit" className="flex-1 py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-[20px] shadow-xl shadow-indigo-100 transition-all hover:scale-[1.02] active:scale-95">
                                    Confirm Allotment
                                </button>
                                <button type="button" onClick={() => setShowAllotModal(false)} className="px-8 bg-gray-100 text-gray-600 font-bold rounded-[20px] hover:bg-gray-200 transition-colors">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && selectedQuarter && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white p-10 rounded-[40px] shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-red-100 text-red-600 rounded-2xl">
                                <Trash2 size={24} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-gray-900">Delete Quarter</h2>
                                <p className="text-gray-600 font-medium">This action cannot be undone.</p>
                            </div>
                        </div>

                        <p className="text-gray-700 mb-8">
                            Are you sure you want to delete quarter <span className="font-black">{selectedQuarter.quarterNumber}</span> from <span className="font-black">{selectedQuarter.block}</span>?
                        </p>

                        <div className="flex gap-4">
                            <button
                                onClick={handleDeleteQuarter}
                                className="flex-1 py-4 bg-red-600 hover:bg-red-700 text-white font-black rounded-2xl shadow-xl shadow-red-100 transition-all"
                            >
                                Delete Quarter
                            </button>
                            <button
                                onClick={() => { setShowDeleteModal(false); setSelectedQuarter(null); }}
                                className="px-8 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && selectedQuarter && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white p-10 rounded-[40px] shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-8">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl">
                                    <Edit3 size={24} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-gray-900">Edit Quarter</h2>
                                    <p className="text-gray-600 font-medium">Update quarter details.</p>
                                </div>
                            </div>
                            <button onClick={() => { setShowEditModal(false); setSelectedQuarter(null); }} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                                <X size={24} className="text-gray-400" />
                            </button>
                        </div>

                        <form onSubmit={handleEditQuarter} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Quarter Number</label>
                                <input
                                    value={selectedQuarter.quarterNumber}
                                    onChange={(e) => setSelectedQuarter({ ...selectedQuarter, quarterNumber: e.target.value })}
                                    className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500/20 focus:bg-white p-3.5 rounded-2xl outline-none transition-all font-bold"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Block</label>
                                <select
                                    value={selectedQuarter.block}
                                    onChange={(e) => setSelectedQuarter({ ...selectedQuarter, block: e.target.value })}
                                    className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500/20 focus:bg-white p-3.5 rounded-2xl outline-none transition-all font-bold appearance-none"
                                    required
                                >
                                    {blocks.map(b => (
                                        <option key={b} value={b}>{b}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Type</label>
                                <select
                                    value={selectedQuarter.type}
                                    onChange={(e) => setSelectedQuarter({ ...selectedQuarter, type: e.target.value })}
                                    className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500/20 focus:bg-white p-3.5 rounded-2xl outline-none transition-all font-bold appearance-none"
                                    required
                                >
                                    {types.map(t => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Status</label>
                                <select
                                    value={selectedQuarter.status}
                                    onChange={(e) => setSelectedQuarter({ ...selectedQuarter, status: e.target.value })}
                                    className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500/20 focus:bg-white p-3.5 rounded-2xl outline-none transition-all font-bold appearance-none"
                                    required
                                >
                                    <option value="Vacant">Vacant</option>
                                    <option value="Occupied">Occupied</option>
                                </select>
                            </div>

                            <div className="pt-4 flex gap-4">
                                <button type="submit" className="flex-1 py-4 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-2xl shadow-xl shadow-amber-100 transition-all">
                                    Update Quarter
                                </button>
                                <button type="button" onClick={() => { setShowEditModal(false); setSelectedQuarter(null); }} className="px-8 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition-colors">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Block Modal */}
            {showAddBlockModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white p-10 rounded-[40px] shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-8">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
                                    <Building2 size={24} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-gray-900">Add Block</h2>
                                    <p className="text-gray-600 font-medium">Create a new residential block.</p>
                                </div>
                            </div>
                            <button onClick={() => setShowAddBlockModal(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                                <X size={24} className="text-gray-400" />
                            </button>
                        </div>

                        <form onSubmit={handleAddBlock} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Block Name</label>
                                <input
                                    placeholder="e.g., Block 6"
                                    value={newBlockName}
                                    onChange={(e) => setNewBlockName(e.target.value)}
                                    className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500/20 focus:bg-white p-4 rounded-2xl outline-none transition-all font-bold"
                                    required
                                />
                            </div>

                            <div className="pt-4 flex gap-4">
                                <button type="submit" className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl shadow-blue-100 transition-all">
                                    Create Block
                                </button>
                                <button type="button" onClick={() => setShowAddBlockModal(false)} className="px-8 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition-colors">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* Delete Block Confirmation Modal */}
            {showDeleteBlockModal && blockToDelete && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white p-10 rounded-[40px] shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-red-100 text-red-600 rounded-2xl">
                                <Trash2 size={24} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-gray-900">Delete Block</h2>
                                <p className="text-gray-600 font-medium">This action cannot be undone.</p>
                            </div>
                        </div>

                        <p className="text-gray-700 mb-8">
                            Are you sure you want to delete <span className="font-black">{blockToDelete}</span>?
                            <br />
                            <span className="text-sm text-red-500 font-bold mt-2 block">Warning: Quarters assigned to this block may become inaccessible via the block filters.</span>
                        </p>

                        <div className="flex gap-4">
                            <button
                                onClick={handleDeleteBlock}
                                className="flex-1 py-4 bg-red-600 hover:bg-red-700 text-white font-black rounded-2xl shadow-xl shadow-red-100 transition-all"
                            >
                                Delete Block
                            </button>
                            <button
                                onClick={() => { setShowDeleteBlockModal(false); setBlockToDelete(null); }}
                                className="px-8 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Quarters;
