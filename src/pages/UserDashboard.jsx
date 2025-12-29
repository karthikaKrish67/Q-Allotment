import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import UserSidebar from '../components/UserSidebar';
import {
    Bell,
    Search,
    ChevronDown,
    Building2,
    Home,
    User,
    FileText,
    Printer,
    Download,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Copy,
    Share2,
    Layers,
    List,
    CheckCircle,
    ChevronUp,
    Filter,
} from 'lucide-react';

const UserDashboard = () => {
    const { user } = useContext(AuthContext);
    const [activeSection, setActiveSection] = useState('dashboard');
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    // Data State
    const [stats, setStats] = useState({ totalBlocks: 0, vacant: 0, allotted: 0, types: { I: 0, II: 0, III: 0, IV: 0 } });
    const [allBlocks, setAllBlocks] = useState([]);
    const [allQuarters, setAllQuarters] = useState([]);
    const [filterStatus, setFilterStatus] = useState('All');
    const [filterType, setFilterType] = useState('All');
    const [expandedBlocks, setExpandedBlocks] = useState({});
    const [expandedTypes, setExpandedTypes] = useState({});
    const [myAllotment, setMyAllotment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentDate] = useState(new Date().toLocaleDateString('en-IN', {
        day: 'numeric', month: 'long', year: 'numeric'
    }));

    const getSectionBg = () => {
        if (activeSection === 'dashboard') return '/assets/dashboard_bg.png';
        if (activeSection.startsWith('dir-')) return '/assets/quarters_bg.png';
        if (activeSection === 'allotment' || activeSection === 'report') return '/assets/allotment_bg.png';
        return '/assets/dashboard_bg.png';
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch Allotment
                const allotmentRes = await axios.get('http://localhost:5000/api/allotments/my-allotment', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setMyAllotment(allotmentRes.data);

                // Fetch Global Stats
                const [blocksRes, quartersRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/blocks', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }),
                    axios.get('http://localhost:5000/api/quarters', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
                ]);

                setAllBlocks(blocksRes.data);
                const quarters = quartersRes.data;
                setAllQuarters(quarters);

                const totalBS = blocksRes.data.length;
                const totalQ = quarters.length;
                const vacant = quarters.filter(q => q.status === 'Vacant').length;
                const allotted = quarters.filter(q => q.status === 'Occupied').length;

                // Calculate types
                const types = { I: 0, II: 0, III: 0, IV: 0 };
                quarters.forEach(q => {
                    // Extract type properly (assuming "Type I", "Type II" etc.)
                    const t = q.type.includes(' ') ? q.type.split(' ')[1] : q.type;
                    if (types[t] !== undefined) types[t]++;
                    else if (types[q.type]) types[q.type]++; // Fallback
                });

                setStats({
                    totalBlocks: totalBS,
                    totalQuarters: totalQ,
                    vacant,
                    allotted,
                    types
                });

            } catch (err) {
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const handlePrint = () => {
        window.print();
    };

    // --- Content Components ---

    const SystemOverview = () => (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Hero Header */}
            <div className="mb-10">
                <h2 className="text-4xl font-black text-white mb-2 text-shadow-strong">Portal Dashboard</h2>
                <p className="text-blue-200 font-bold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Live Status for {currentDate}
                </p>
            </div>

            {/* Overview Widgets */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-lg transition-all duration-300">
                    <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Total Blocks</p>
                        <p className="text-3xl font-black text-gray-900">{stats.totalBlocks}</p>
                    </div>
                    <div className="p-4 bg-orange-50 text-orange-600 rounded-2xl group-hover:scale-110 transition-transform">
                        <Layers size={28} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-lg transition-all duration-300">
                    <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Total Quarters</p>
                        <p className="text-3xl font-black text-gray-900">{stats.totalQuarters}</p>
                    </div>
                    <div className="p-4 bg-gray-50 text-gray-600 rounded-2xl group-hover:scale-110 transition-transform">
                        <Home size={28} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-lg transition-all duration-300">
                    <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Vacant Quarters</p>
                        <p className="text-3xl font-black text-emerald-600">{stats.vacant}</p>
                    </div>
                    <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:scale-110 transition-transform">
                        <CheckCircle2 size={28} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-lg transition-all duration-300">
                    <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Allotted Quarters</p>
                        <p className="text-3xl font-black text-blue-600">{stats.allotted}</p>
                    </div>
                    <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl group-hover:scale-110 transition-transform">
                        <User size={28} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-lg transition-all duration-300">
                    <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Occupancy Rate</p>
                        <p className="text-3xl font-black text-purple-600">
                            {stats.totalQuarters > 0 ? Math.round((stats.allotted / stats.totalQuarters) * 100) : 0}%
                        </p>
                    </div>
                    <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl group-hover:scale-110 transition-transform">
                        <Building2 size={28} />
                    </div>
                </div>
            </section>

            {/* Quarter Type Stats */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-black text-white uppercase tracking-wider flex items-center gap-2 text-shadow-strong">
                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                        Housing Inventory by Type
                    </h3>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {Object.entries(stats.types).map(([type, count], idx) => {
                        const colors = [
                            'from-blue-500 to-blue-600',
                            'from-indigo-500 to-indigo-600',
                            'from-purple-500 to-purple-600',
                            'from-pink-500 to-pink-600'
                        ];
                        // Handle potential 0 or undefined values cleanly
                        if (type === 'undefined') return null;

                        return (
                            <div key={type} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:-translate-y-1 transition-transform">
                                <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${colors[idx % 4]} opacity-10 rounded-bl-full -mr-4 -mt-4 transition-all group-hover:opacity-20`}></div>
                                <p className="text-xs font-bold text-gray-400 uppercase mb-1">{type}</p>
                                <p className="text-2xl font-black text-gray-800">{count} <span className="text-xs font-medium text-gray-400">quarters</span></p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* My Allotment Summary Panel */}
            <section>
                <div className="flex items-center justify-between mb-6 relative">
                    <h3 className="text-lg font-black text-white uppercase tracking-wider flex items-center gap-2 text-shadow-strong">
                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                        My Allotment Status
                    </h3>
                    <button onClick={() => setActiveSection('allotment')} className="text-sm font-bold text-blue-600 hover:underline">View Details</button>
                </div>
                {myAllotment ? (
                    <div className="bg-white rounded-3xl p-1 shadow-sm border border-gray-100">
                        <div className="bg-gradient-to-r from-gray-900 to-blue-900 rounded-[1.3rem] p-8 text-white relative overflow-hidden">
                            <div className="absolute inset-0 bg-cover bg-center opacity-60 mix-blend-overlay pointer-events-none" style={{ backgroundImage: "url('/assets/allotment_bg.png')" }}></div>
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-transparent pointer-events-none"></div>
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>

                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                                <div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="px-3 py-1 bg-green-500/20 border border-green-500/30 text-green-400 text-xs font-bold uppercase rounded-full flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span> Active
                                        </div>
                                        <span className="text-gray-400 text-sm font-medium">Allocated on {new Date(myAllotment.allotmentDate).toLocaleDateString()}</span>
                                    </div>
                                    <h4 className="text-4xl font-black tracking-tight mb-2">Quarter {myAllotment.Quarter?.quarterNumber}</h4>
                                    <p className="text-blue-200 font-medium text-lg">{myAllotment.Quarter?.block?.startsWith('Block') ? myAllotment.Quarter?.block : `Block ${myAllotment.Quarter?.block}`} • {myAllotment.Quarter?.type}</p>
                                </div>
                                <div className="flex gap-4">
                                    <button onClick={() => setActiveSection('report')} className="px-6 py-3 bg-white text-blue-900 font-bold rounded-xl shadow-lg hover:bg-blue-50 transition-colors flex items-center gap-2">
                                        <FileText size={18} /> Official Report
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl border border-gray-200 border-dashed p-12 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
                            <AlertCircle size={32} />
                        </div>
                        <h4 className="text-xl font-bold text-gray-900">No Active Allotment</h4>
                        <p className="text-gray-500 max-w-md mt-2">There are currently no residential quarters allotted to your account. Please contact the administration office if you believe this is an error.</p>
                    </div>
                )}
            </section>
        </div>
    );

    const MyAllotmentPanel = () => (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">
                <div className="h-64 bg-gradient-to-r from-blue-900 to-slate-900 relative">
                    <div className="absolute inset-0 bg-cover bg-center opacity-50 mix-blend-overlay" style={{ backgroundImage: "url('/assets/allotment_bg.png')" }}></div>
                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
                </div>
                <div className="px-10 pb-10 -mt-16 relative z-10">
                    <div className="bg-white p-2 rounded-2xl shadow-lg inline-block mb-6">
                        <div className="w-24 h-24 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 border border-blue-100">
                            <Home size={40} />
                        </div>
                    </div>

                    <div className="flex justify-between items-end mb-8 border-b border-gray-100 pb-8">
                        <div>
                            <h2 className="text-4xl font-black text-gray-900 mb-2">Quarter {myAllotment?.Quarter?.quarterNumber}</h2>
                            <p className="text-xl text-gray-500 font-medium">{myAllotment?.Quarter?.block?.startsWith('Block') ? myAllotment?.Quarter?.block : `Block ${myAllotment?.Quarter?.block}`}, {myAllotment?.Quarter?.type}</p>
                        </div>
                        <div className="text-right">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full font-bold text-sm mb-2">
                                <CheckCircle2 size={16} /> Active Allotment
                            </div>
                            <p className="text-sm text-gray-400 font-medium">ID: ALT-{myAllotment?.id}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                            <p className="text-xs font-bold uppercase text-gray-400 mb-3 tracking-widest">Resident Details</p>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <User size={18} className="text-gray-400" />
                                    <span className="font-bold text-gray-700">{myAllotment?.NonEmployee?.name}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 rounded-full bg-gray-300 flex items-center justify-center text-[10px] text-white font-bold">#</div>
                                    <span className="font-semibold text-gray-500">{myAllotment?.NonEmployee?.privatePartyCode}</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                            <p className="text-xs font-bold uppercase text-gray-400 mb-3 tracking-widest">Property Specs</p>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="block text-xs text-gray-400">Type</span>
                                    <span className="font-bold text-gray-700">{myAllotment?.Quarter?.type}</span>
                                </div>
                                <div>
                                    <span className="block text-xs text-gray-400">Block</span>
                                    <span className="font-bold text-gray-700">{myAllotment?.Quarter?.block?.startsWith('Block') ? myAllotment?.Quarter?.block : `Block ${myAllotment?.Quarter?.block}`}</span>
                                </div>
                                <div>
                                    <span className="block text-xs text-gray-400">Furnishing</span>
                                    <span className="font-bold text-gray-700">Unfurnished</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col justify-center gap-3">
                            <button onClick={() => setActiveSection('report')} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2">
                                <FileText size={18} /> View Report
                            </button>
                            <button disabled className="w-full py-3 bg-white border-2 border-gray-200 text-gray-400 font-bold rounded-xl cursor-not-allowed flex items-center justify-center gap-2">
                                <Share2 size={18} /> Share Details
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const ReportPanel = () => (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-[calc(100vh-140px)] flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-black text-gray-800">Confirmation Report</h2>
                    <p className="text-gray-500 font-medium">Official allotment documentation.</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={handlePrint} className="px-5 py-2.5 bg-gray-900 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-transform flex items-center gap-2">
                        <Printer size={18} /> Print
                    </button>
                    <button className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2">
                        <Download size={18} /> PDF
                    </button>
                </div>
            </div>

            <div className="flex-1 bg-gray-200/50 rounded-3xl overflow-hidden p-8 flex justify-center items-start overflow-y-auto custom-scrollbar">
                {/* Paper Preview */}
                <div className="bg-white w-full max-w-3xl min-h-[1000px] shadow-2xl p-16 relative">
                    {/* Watermark */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
                        <Building2 size={400} />
                    </div>

                    {/* Report Content */}
                    <div className="border-b-4 border-double border-gray-800 pb-8 mb-10 text-center relative z-10">
                        <h1 className="text-4xl font-black uppercase tracking-widest text-gray-900 mb-2">ResidencyHub</h1>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-[0.3em]">Government Housing Authority</p>
                    </div>

                    <div className="flex justify-between items-start mb-12">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Date of Issue</p>
                            <p className="font-mono font-bold text-lg">{currentDate}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Certificate No</p>
                            <p className="font-mono font-bold text-lg text-blue-600">RH-{myAllotment?.id?.toString().padStart(6, '0')}</p>
                        </div>
                    </div>

                    <h2 className="text-2xl font-serif font-bold text-center underline decoration-2 underline-offset-8 mb-12">OFFICIAL ALLOTMENT LETTER</h2>

                    <div className="space-y-6 text-justify text-gray-700 leading-relaxed font-serif text-lg mb-12">
                        <p>
                            This is to certify that Mr./Ms. <span className="font-bold text-black">{myAllotment?.NonEmployee?.name}</span> (ID: {myAllotment?.NonEmployee?.privatePartyCode}),
                            has been officially allotted the residential accommodation described in the schedule below.
                        </p>
                        <p>
                            The allotment is effective from <span className="font-bold text-black">{new Date(myAllotment?.allotmentDate).toLocaleDateString()}</span> and is subject to the
                            terms and conditions stipulated in the Residency Maintenance Agreement.
                        </p>
                    </div>

                    <div className="border border-gray-200 p-8 bg-gray-50 mb-12 rounded-lg">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6 border-b border-gray-200 pb-2">Schedule of Premises</h3>
                        <div className="grid grid-cols-2 gap-y-6 gap-x-12">
                            <div>
                                <span className="block text-xs text-gray-500 uppercase font-bold">Block Number</span>
                                <span className="text-xl font-bold text-gray-900">{myAllotment?.Quarter?.block?.startsWith('Block') ? myAllotment?.Quarter?.block : `Block ${myAllotment?.Quarter?.block}`}</span>
                            </div>
                            <div>
                                <span className="block text-xs text-gray-500 uppercase font-bold">Quarter Number</span>
                                <span className="text-xl font-bold text-gray-900">{myAllotment?.Quarter?.quarterNumber}</span>
                            </div>
                            <div>
                                <span className="block text-xs text-gray-500 uppercase font-bold">Housing Type</span>
                                <span className="text-xl font-bold text-gray-900">{myAllotment?.Quarter?.type}</span>
                            </div>
                            <div>
                                <span className="block text-xs text-gray-500 uppercase font-bold">Condition</span>
                                <span className="text-xl font-bold text-gray-900">Standard</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between items-end pt-12">
                        <div className="text-center">
                            <div className="h-16 w-32 border-b border-gray-400 mb-2"></div>
                            <p className="text-[10px] font-bold uppercase tracking-widest">Resident Signature</p>
                        </div>
                        <div className="text-center opacity-80 rotate-12">
                            <div className="w-24 h-24 border-4 border-double border-blue-900 rounded-full flex items-center justify-center p-2">
                                <div className="text-[10px] font-bold text-blue-900 uppercase text-center leading-tight">
                                    Official<br />Residency<br />Seal
                                </div>
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="font-script text-3xl mb-[-5px] text-blue-900">Administrator</div>
                            <div className="h-16 w-48 border-b border-gray-400 mb-2"></div>
                            <p className="text-[10px] font-bold uppercase tracking-widest">Issuing Authority</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const DirectoryFilters = () => (
        <div className="flex flex-wrap items-center gap-4 mb-8 bg-white/80 backdrop-blur-md p-6 rounded-[2.5rem] border border-white/20 shadow-xl animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <Filter size={20} />
                </div>
                <span className="font-black text-gray-900 text-sm uppercase tracking-widest">Directory Filters</span>
            </div>

            <div className="h-8 w-px bg-gray-200 mx-2 hidden md:block"></div>

            <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2.5 bg-gray-100/50 border-none rounded-xl text-xs font-black uppercase tracking-[0.1em] text-gray-700 focus:ring-2 focus:ring-blue-500/30 transition-all outline-none cursor-pointer"
            >
                <option value="All">All Statuses</option>
                <option value="Vacant">Vacant Only</option>
                <option value="Occupied">Allotted Only</option>
            </select>

            <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2.5 bg-gray-100/50 border-none rounded-xl text-xs font-black uppercase tracking-[0.1em] text-gray-700 focus:ring-2 focus:ring-blue-500/30 transition-all outline-none cursor-pointer"
            >
                <option value="All">All Types</option>
                <option value="Type I">Type I</option>
                <option value="Type II">Type II</option>
                <option value="Type III">Type III</option>
                <option value="Type IV">Type IV</option>
            </select>

            <div className="flex-1"></div>

            <div className="flex items-center gap-6 px-4">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">Vacant</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]"></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">Allotted</span>
                </div>
            </div>
        </div>
    );

    const filterQuartersData = (quarters) => {
        return quarters.filter(q => {
            const matchStatus = filterStatus === 'All' || q.status === filterStatus;
            const matchType = filterType === 'All' || q.type === filterType;
            return matchStatus && matchType;
        });
    };

    const DirectoryBlocks = () => {
        const toggleBlock = (blockId) => {
            setExpandedBlocks(prev => ({ ...prev, [blockId]: !prev[blockId] }));
        };

        const blocksWithData = allBlocks.map(block => {
            const blockQuarters = filterQuartersData(allQuarters.filter(q => q.block === (block.name || block)));
            const groupedByType = blockQuarters.reduce((acc, q) => {
                const qType = q.type || 'Unknown';
                if (!acc[qType]) acc[qType] = [];
                acc[qType].push(q);
                return acc;
            }, {});
            return { name: block.name || block, id: block.id || block, groupedByType, total: blockQuarters.length };
        });

        if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

        const visibleBlocks = blocksWithData.filter(b => b.total > 0 || (filterStatus === 'All' && filterType === 'All'));

        if (visibleBlocks.length === 0) {
            const emptyMessage = filterStatus === 'Vacant'
                ? "No vacant quarters found matching selected filters."
                : filterStatus === 'Occupied'
                    ? "No allotted quarters found matching selected filters."
                    : "There are currently no blocks match your filter criteria.";

            return (
                <div>
                    <DirectoryFilters />
                    <div className="bg-white rounded-[2.5rem] border border-gray-200 border-dashed p-12 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
                            <Layers size={32} />
                        </div>
                        <h4 className="text-xl font-bold text-gray-900">No Quarters Available</h4>
                        <p className="text-gray-500 max-w-md mt-2">{emptyMessage}</p>
                    </div>
                </div>
            );
        }

        return (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <DirectoryFilters />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {visibleBlocks.map(block => {
                        const isExpanded = expandedBlocks[block.id] !== false; // Default to expanded
                        return (
                            <div key={block.id} className="group bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 transition-all duration-300 overflow-hidden relative flex flex-col h-fit">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-bl-[5rem] -mr-8 -mt-8 group-hover:bg-blue-600/10 transition-colors"></div>

                                <div className="flex items-center justify-between mb-8 relative z-10">
                                    <div className="flex items-center gap-5">
                                        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                                            <Building2 size={30} />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black text-gray-900 tracking-tight">{block.name?.startsWith('Block') ? block.name : `Block ${block.name}`}</h3>
                                            <p className="text-blue-600 font-bold text-sm uppercase tracking-widest">{block.total} Quarters Available</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => toggleBlock(block.id)}
                                        className="p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                                    >
                                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                    </button>
                                </div>

                                {isExpanded && (
                                    <div className="space-y-6 relative z-10 animate-in fade-in slide-in-from-top-2 duration-300">
                                        {Object.entries(block.groupedByType).sort().map(([type, quarters]) => (
                                            <div key={type} className="flex flex-col gap-4">
                                                <div className="flex items-center justify-between px-2">
                                                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">{type}</span>
                                                    <div className="h-px flex-1 bg-gray-100 mx-4"></div>
                                                </div>
                                                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                                                    {quarters.sort((a, b) => a.quarterNumber.localeCompare(b.quarterNumber)).map((q) => (
                                                        <div
                                                            key={q.id}
                                                            title={`Status: ${q.status}`}
                                                            className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all hover:scale-105 cursor-default
                                                                ${q.status === 'Vacant'
                                                                    ? 'bg-emerald-50 border-emerald-100 text-emerald-700 shadow-sm shadow-emerald-500/10'
                                                                    : 'bg-rose-50 border-rose-100 text-rose-700 shadow-sm shadow-rose-500/10'}`}
                                                        >
                                                            <span className="text-xs font-black tracking-tighter">{q.quarterNumber}</span>
                                                            {q.status === 'Vacant' ? <CheckCircle size={10} className="mt-1 opacity-50" /> : <XCircle size={10} className="mt-1 opacity-50" />}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const DirectoryQuarters = () => {
        const filteredQuarters = filterQuartersData(allQuarters);

        if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

        const groupedByBlock = filteredQuarters.reduce((acc, q) => {
            if (!acc[q.block]) acc[q.block] = [];
            acc[q.block].push(q);
            return acc;
        }, {});

        const visibleBlocks = Object.entries(groupedByBlock).sort();

        if (visibleBlocks.length === 0) {
            const emptyMessage = filterStatus === 'Vacant'
                ? "No vacant quarters currently available in the directory."
                : "No quarters found matching your current filter selection.";

            return (
                <div>
                    <DirectoryFilters />
                    <div className="bg-white rounded-[2.5rem] border border-gray-200 border-dashed p-12 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
                            <Home size={32} />
                        </div>
                        <h4 className="text-xl font-bold text-gray-900">No Quarters Available</h4>
                        <p className="text-gray-500 max-w-md mt-2">{emptyMessage}</p>
                    </div>
                </div>
            );
        }

        return (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <DirectoryFilters />
                <div className="space-y-8">
                    {visibleBlocks.map(([blockName, quarters]) => (
                        <div key={blockName} className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-8 py-6 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                                        <Building2 size={24} />
                                    </div>
                                    <h3 className="text-xl font-black text-gray-900 tracking-tight">{blockName?.startsWith('Block') ? blockName : `Block ${blockName}`}</h3>
                                </div>
                                <span className="bg-blue-600/10 text-blue-600 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-blue-100">
                                    {quarters.length} Quarters Listed
                                </span>
                            </div>
                            <div className="p-8">
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                                    {quarters.sort((a, b) => a.quarterNumber.localeCompare(b.quarterNumber)).map((q) => (
                                        <div
                                            key={q.id}
                                            className={`group relative p-4 rounded-3xl border transition-all hover:shadow-lg flex flex-col items-center gap-2
                                                ${q.status === 'Vacant'
                                                    ? 'bg-white border-emerald-100 hover:border-emerald-300'
                                                    : 'bg-white border-rose-100 hover:border-rose-300'}`}
                                        >
                                            <div className={`w-2 h-2 rounded-full absolute top-3 right-3 ${q.status === 'Vacant' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{q.type}</p>
                                            <p className="text-lg font-black text-gray-900">{q.quarterNumber}</p>
                                            <p className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-md
                                                ${q.status === 'Vacant' ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'}`}>
                                                {q.status === 'Vacant' ? 'Vacant' : 'Allotted'}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const DirectoryTypes = () => {
        const types = ['Type I', 'Type II', 'Type III', 'Type IV'];
        const typesData = types.map(type => {
            const typeQuarters = filterQuartersData(allQuarters.filter(q => q.type === type));
            const blocks = [...new Set(typeQuarters.map(q => q.block))];
            const blocksData = blocks.sort().map(b => ({
                name: b,
                quarters: typeQuarters.filter(q => q.block === b).sort((x, y) => x.quarterNumber.localeCompare(y.quarterNumber))
            }));
            return { type, blocksData, total: typeQuarters.length };
        });

        if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

        const visibleTypes = typesData.filter(t => t.total > 0 || (filterStatus === 'All' && filterType === 'All'));

        return (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <DirectoryFilters />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {visibleTypes.map(data => {
                        const isExpanded = expandedTypes[data.type] !== false;
                        return (
                            <div key={data.type} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 transition-all group overflow-hidden relative flex flex-col h-fit">
                                <div className={`absolute top-0 right-0 w-40 h-40 bg-gray-900/[0.02] rounded-bl-full -mr-10 -mt-10 group-hover:bg-gray-900/[0.05] transition-colors`}></div>

                                <div className="flex items-center justify-between mb-8 relative z-10">
                                    <div className="flex items-center gap-5">
                                        <div className="w-16 h-16 bg-gray-900 rounded-[1.25rem] flex items-center justify-center text-white shadow-xl shadow-gray-200">
                                            <List size={28} />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black text-gray-900 tracking-tight">{data.type} Classification</h3>
                                            <p className="text-gray-500 font-bold text-xs uppercase tracking-[0.2em] mt-1">Grade Allocation</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-right mr-2">
                                            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Stock</p>
                                            <p className="text-2xl font-black text-gray-900">{data.total}</p>
                                        </div>
                                        <button
                                            onClick={() => setExpandedTypes(prev => ({ ...prev, [data.type]: !isExpanded }))}
                                            className="p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                                        >
                                            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                        </button>
                                    </div>
                                </div>

                                {isExpanded && (
                                    <div className="space-y-8 relative z-10 animate-in fade-in zoom-in-95 duration-300">
                                        {data.blocksData.map((block) => (
                                            <div key={block.name} className="bg-gray-50/50 rounded-3xl p-6 border border-gray-100">
                                                <div className="flex items-center gap-3 mb-6">
                                                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                                                    <h4 className="font-black text-gray-800 text-sm uppercase tracking-widest">In {block.name?.startsWith('Block') ? block.name : `Block ${block.name}`}</h4>
                                                    <div className="flex-1 h-px bg-gray-200 ml-2"></div>
                                                </div>
                                                <div className="flex flex-wrap gap-2.5">
                                                    {block.quarters.map(q => (
                                                        <div
                                                            key={q.id}
                                                            className={`px-4 py-2.5 rounded-2xl border text-xs font-black transition-all flex items-center gap-2
                                                                ${q.status === 'Vacant'
                                                                    ? 'bg-white border-emerald-100 text-emerald-600 shadow-sm'
                                                                    : 'bg-white border-rose-100 text-rose-600 shadow-sm'}`}
                                                        >
                                                            {q.quarterNumber}
                                                            <div className={`w-1.5 h-1.5 rounded-full ${q.status === 'Vacant' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                        {data.blocksData.length === 0 && (
                                            <div className="text-center py-6 text-gray-400 italic font-bold">No vacancy in this category.</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="flex h-screen bg-[#0f172a] font-sans selection:bg-blue-200">
            {/* Sidebar */}
            <UserSidebar
                activeSection={activeSection}
                setActiveSection={setActiveSection}
                isCollapsed={isSidebarCollapsed}
                className="z-30 relative" // Ensure it's above other layers
            />

            {/* Main Layout */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden relative">

                {/* Top Bar */}
                <header className="h-20 bg-slate-900/40 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-8 z-20">
                    <button
                        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                        className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                    >
                        <Layers size={20} />
                    </button>

                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-medium w-64 text-white focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-gray-500"
                            />
                        </div>
                        <button className="relative p-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-none"></span>
                        </button>
                        <div className="h-8 w-px bg-white/10"></div>
                        <div className="flex items-center gap-4">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-bold text-white leading-none">{user?.username || 'User'}</p>
                                <p className="text-[10px] font-black uppercase tracking-widest text-blue-300 mt-1">Resident</p>
                            </div>
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                                <User size={20} />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dashboard Content Area */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto relative min-h-screen bg-slate-950">
                    {/* Background Graphic - Layered for Depth */}
                    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-in-out scale-110"
                            style={{
                                backgroundImage: `url('${getSectionBg()}')`,
                                filter: 'brightness(0.6) contrast(1.2) saturate(1.2)',
                                backgroundAttachment: 'fixed'
                            }}
                        ></div>
                        {/* Admin Style Overlays */}
                        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[1px]"></div>
                        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-transparent to-slate-900/90"></div>
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/30 via-transparent to-indigo-900/30"></div>
                    </div>

                    <div className="max-w-7xl mx-auto px-8 py-10 relative z-10">
                        {activeSection === 'dashboard' && <SystemOverview />}
                        {activeSection === 'allotment' && (myAllotment ? <MyAllotmentPanel /> : <SystemOverview />)}
                        {activeSection === 'report' && (myAllotment ? <ReportPanel /> : <div className="text-center py-20 text-gray-400 font-bold">No Allotment to Generate Report For</div>)}
                        {activeSection === 'dir-blocks' && <DirectoryBlocks />}
                        {activeSection === 'dir-quarters' && <DirectoryQuarters />}
                        {activeSection === 'dir-types' && <DirectoryTypes />}
                        {activeSection === 'profile' && (
                            <div className="flex items-center justify-center h-96">
                                <div className="text-center">
                                    <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center text-gray-400">
                                        <User size={40} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900">User Profile</h2>
                                    <p className="text-gray-500">Feature coming soon.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* Print Area Overlay */}
            <div className="hidden print:block fixed inset-0 z-[100] bg-white">
                {myAllotment && <ReportPanel />}
            </div>
        </div>
    );
};

export default UserDashboard;
