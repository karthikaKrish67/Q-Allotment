import { useEffect, useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { Bar, Pie, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement
} from 'chart.js';
import axios from 'axios';
import { Building2, Users, AlertCircle, TrendingUp, Home, CheckCircle2, XCircle, Layers } from 'lucide-react';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement
);

const Dashboard = () => {
    const { token } = useContext(AuthContext);
    const [stats, setStats] = useState({
        quarters: {
            total: 0,
            occupied: 0,
            vacant: 0,
            typeI: 0,
            typeII: 0,
            typeIII: 0,
            typeIV: 0
        },
        blocks: [],
        nonEmployees: 0,
        complaints: { pending: 0, completed: 0, inProgress: 0, total: 0 },
        allotments: 0,
        bills: { total: 0, paid: 0, pending: 0 }
    });
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            const [qRes, uRes, cRes, aRes, bRes] = await Promise.all([
                axios.get('http://localhost:5000/api/quarters', { headers: { Authorization: `Bearer ${token}` } }),
                axios.get('http://localhost:5000/api/nonEmployees', { headers: { Authorization: `Bearer ${token}` } }),
                axios.get('http://localhost:5000/api/complaints', { headers: { Authorization: `Bearer ${token}` } }),
                axios.get('http://localhost:5000/api/allotments', { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: [] })),
                axios.get('http://localhost:5000/api/bills', { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: [] }))
            ]);

            // Calculate block statistics
            const blocks = ['Block 1', 'Block 2', 'Block 3', 'Block 4', 'Block 5'];
            const blockStats = blocks.map(block => {
                const blockQuarters = qRes.data.filter(q => q.block === block);
                return {
                    name: block,
                    total: blockQuarters.length,
                    vacant: blockQuarters.filter(q => q.status === 'Vacant').length,
                    occupied: blockQuarters.filter(q => q.status === 'Occupied').length
                };
            });

            setStats({
                quarters: {
                    total: qRes.data.length,
                    occupied: qRes.data.filter(q => q.status === 'Occupied').length,
                    vacant: qRes.data.filter(q => q.status === 'Vacant').length,
                    typeI: qRes.data.filter(q => q.type === 'Type I').length,
                    typeII: qRes.data.filter(q => q.type === 'Type II').length,
                    typeIII: qRes.data.filter(q => q.type === 'Type III').length,
                    typeIV: qRes.data.filter(q => q.type === 'Type IV').length
                },
                blocks: blockStats,
                nonEmployees: uRes.data.length,
                complaints: {
                    total: cRes.data.length,
                    pending: cRes.data.filter(c => c.status === 'Pending').length,
                    inProgress: cRes.data.filter(c => c.status === 'In Progress').length,
                    completed: cRes.data.filter(c => c.status === 'Completed').length
                },
                allotments: aRes.data.length,
                bills: {
                    total: bRes.data.length,
                    paid: bRes.data.filter(b => b.isPaid === true).length,
                    pending: bRes.data.filter(b => b.isPaid === false).length
                }
            });
        } catch (error) {
            console.error("Error fetching stats", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, [token]);

    const quarterDistributionData = {
        labels: ['Occupied', 'Vacant'],
        datasets: [{
            data: [stats.quarters.occupied, stats.quarters.vacant],
            backgroundColor: ['#ef4444', '#10b981'],
            hoverOffset: 10,
            borderWidth: 0
        }]
    };

    const housingTypeData = {
        labels: ['Type I', 'Type II', 'Type III', 'Type IV'],
        datasets: [{
            data: [stats.quarters.typeI, stats.quarters.typeII, stats.quarters.typeIII, stats.quarters.typeIV],
            backgroundColor: ['#8b5cf6', '#3b82f6', '#f59e0b', '#ec4899'],
            hoverOffset: 10,
            borderWidth: 0
        }]
    };

    const blockDistributionData = {
        labels: stats.blocks.map(b => b.name.replace('Block ', 'B')),
        datasets: [
            {
                label: 'Occupied',
                data: stats.blocks.map(b => b.occupied),
                backgroundColor: '#ef4444',
                borderRadius: 8,
            },
            {
                label: 'Vacant',
                data: stats.blocks.map(b => b.vacant),
                backgroundColor: '#10b981',
                borderRadius: 8,
            }
        ]
    };

    const complaintData = {
        labels: ['Pending', 'In Progress', 'Completed'],
        datasets: [{
            label: 'Complaints',
            data: [stats.complaints.pending, stats.complaints.inProgress, stats.complaints.completed],
            backgroundColor: ['#f59e0b', '#3b82f6', '#10b981'],
            borderRadius: 8,
        }]
    };

    // Main stat cards
    const statCards = [
        { label: 'Total Quarters', value: stats.quarters.total, icon: Building2, color: 'blue', subtext: '5 Blocks' },
        { label: 'Vacant Quarters', value: stats.quarters.vacant, icon: Home, color: 'green', subtext: 'Available' },
        { label: 'Occupied Quarters', value: stats.quarters.occupied, icon: CheckCircle2, color: 'red', subtext: 'Allocated' },
        { label: 'Occupancy Rate', value: `${stats.quarters.total ? Math.round((stats.quarters.occupied / stats.quarters.total) * 100) : 0}%`, icon: TrendingUp, color: 'cyan', subtext: 'Current' },
    ];

    // Secondary stat cards
    const secondaryCards = [
        { label: 'Registered Residents', value: stats.nonEmployees, icon: Users, color: 'purple' },
        { label: 'Active Allotments', value: stats.allotments, icon: Layers, color: 'indigo' },
        { label: 'Pending Complaints', value: stats.complaints.pending, icon: AlertCircle, color: 'orange' },
        { label: 'Total Complaints', value: stats.complaints.total, icon: XCircle, color: 'amber' },
    ];

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="p-8 min-h-full bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/assets/dashboard_bg.png')" }}>
            <div className="mb-8">
                <h1 className="text-3xl font-black text-white tracking-tight text-shadow-strong">System Overview</h1>
                <p className="text-blue-200 mt-1 font-bold text-shadow-strong">Real-time quarters, occupancy and maintenance analytics.</p>
            </div>

            {/* Main Quarters Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {statCards.map((card, i) => (
                    <div key={i} className="glass-card premium-shadow p-6 rounded-3xl transition-transform hover:scale-[1.02] duration-300">
                        <div className={`w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-4 transition-colors ring-1 ring-white/20`}>
                            <card.icon className={`text-${card.color}-300`} size={24} />
                        </div>
                        <p className="text-sm font-bold text-blue-200 uppercase tracking-widest leading-none">{card.label}</p>
                        <h3 className="text-3xl font-black text-white mt-3">{card.value}</h3>
                        {card.subtext && <p className="text-xs font-bold text-cyan-300 mt-1">{card.subtext}</p>}
                    </div>
                ))}
            </div>

            {/* Housing Type Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="glass-card premium-shadow p-4 rounded-2xl text-center">
                    <p className="text-[10px] font-black text-purple-300 uppercase tracking-widest">Type I</p>
                    <p className="text-2xl font-black text-white mt-1">{stats.quarters.typeI}</p>
                </div>
                <div className="glass-card premium-shadow p-4 rounded-2xl text-center">
                    <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest">Type II</p>
                    <p className="text-2xl font-black text-white mt-1">{stats.quarters.typeII}</p>
                </div>
                <div className="glass-card premium-shadow p-4 rounded-2xl text-center">
                    <p className="text-[10px] font-black text-amber-300 uppercase tracking-widest">Type III</p>
                    <p className="text-2xl font-black text-white mt-1">{stats.quarters.typeIII}</p>
                </div>
                <div className="glass-card premium-shadow p-4 rounded-2xl text-center">
                    <p className="text-[10px] font-black text-pink-300 uppercase tracking-widest">Type IV</p>
                    <p className="text-2xl font-black text-white mt-1">{stats.quarters.typeIV}</p>
                </div>
            </div>

            {/* Secondary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                {secondaryCards.map((card, i) => (
                    <div key={i} className="glass-card premium-shadow p-4 rounded-2xl transition-transform hover:scale-[1.02] duration-300">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center ring-1 ring-white/20`}>
                                <card.icon className={`text-${card.color}-300`} size={18} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-blue-200 uppercase tracking-wider">{card.label}</p>
                                <h4 className="text-xl font-black text-white">{card.value}</h4>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Quarters Occupancy Pie Chart */}
                <div className="glass-card premium-shadow p-8 rounded-3xl">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-black text-white">Occupancy Status</h2>
                        <span className="text-xs font-bold px-3 py-1 bg-green-500/20 text-green-300 border border-green-500/30 rounded-full">LIVE</span>
                    </div>
                    <div className="h-64 flex justify-center">
                        <Pie
                            data={quarterDistributionData}
                            options={{
                                maintainAspectRatio: false,
                                plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, padding: 20, color: 'white', font: { weight: 'bold' } } } }
                            }}
                        />
                    </div>
                </div>

                {/* Housing Type Doughnut Chart */}
                <div className="glass-card premium-shadow p-8 rounded-3xl">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-black text-white">Housing Types</h2>
                        <span className="text-xs font-bold px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full">TYPES</span>
                    </div>
                    <div className="h-64 flex justify-center">
                        <Doughnut
                            data={housingTypeData}
                            options={{
                                maintainAspectRatio: false,
                                plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, padding: 20, color: 'white', font: { weight: 'bold' } } } }
                            }}
                        />
                    </div>
                </div>

                {/* Block Distribution Bar Chart */}
                <div className="glass-card premium-shadow p-8 rounded-3xl">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-black text-white">Block Statistics</h2>
                        <span className="text-xs font-bold px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full">BLOCKS</span>
                    </div>
                    <div className="h-64">
                        <Bar
                            data={blockDistributionData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, padding: 15, color: 'white', font: { weight: 'bold' } } } },
                                scales: {
                                    y: { beginAtZero: true, stacked: true, grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: 'rgba(255,255,255,0.7)', font: { weight: 'bold' } } },
                                    x: { stacked: true, grid: { display: false }, ticks: { color: 'white', font: { weight: 'bold' } } }
                                }
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Charts Row 2 - Complaints */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass-card premium-shadow p-8 rounded-3xl">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-black text-white">Maintenance Pipeline</h2>
                        <span className="text-xs font-bold px-3 py-1 bg-orange-500/20 text-orange-300 border border-orange-500/30 rounded-full">COMPLAINTS</span>
                    </div>
                    <div className="h-72">
                        <Bar
                            data={complaintData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: { legend: { display: false } },
                                scales: {
                                    y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: 'rgba(255,255,255,0.7)', font: { weight: 'bold' } } },
                                    x: { grid: { display: false }, ticks: { color: 'white', font: { weight: 'bold' } } }
                                }
                            }}
                        />
                    </div>
                </div>

                {/* Quick Stats Summary */}
                <div className="glass-card premium-shadow p-8 rounded-3xl">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-black text-white">Summary</h2>
                        <span className="text-xs font-bold px-3 py-1 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-full">OVERVIEW</span>
                    </div>

                    <div className="space-y-4">
                        {/* Quarters Summary */}
                        <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-bold text-cyan-200">Quarters Availability</span>
                                <span className="text-lg font-black text-white">{stats.quarters.vacant}/{stats.quarters.total}</span>
                            </div>
                            <div className="w-full bg-white/10 rounded-full h-3">
                                <div
                                    className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-3 rounded-full transition-all duration-500"
                                    style={{ width: `${stats.quarters.total ? (stats.quarters.vacant / stats.quarters.total) * 100 : 0}%` }}
                                ></div>
                            </div>
                            <p className="text-xs text-gray-400 mt-2">{stats.quarters.total ? Math.round((stats.quarters.vacant / stats.quarters.total) * 100) : 0}% available for allocation</p>
                        </div>

                        {/* Complaints Summary */}
                        <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-bold text-cyan-200">Complaints Resolved</span>
                                <span className="text-lg font-black text-white">{stats.complaints.completed}/{stats.complaints.total}</span>
                            </div>
                            <div className="w-full bg-white/10 rounded-full h-3">
                                <div
                                    className="bg-gradient-to-r from-green-500 to-green-400 h-3 rounded-full transition-all duration-500"
                                    style={{ width: `${stats.complaints.total ? (stats.complaints.completed / stats.complaints.total) * 100 : 0}%` }}
                                ></div>
                            </div>
                            <p className="text-xs text-gray-400 mt-2">{stats.complaints.total ? Math.round((stats.complaints.completed / stats.complaints.total) * 100) : 0}% resolution rate</p>
                        </div>

                        {/* In Progress */}
                        <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-cyan-200">In Progress</span>
                                <span className="text-lg font-black text-blue-400">{stats.complaints.inProgress}</span>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">Actively being addressed</p>
                        </div>

                        {/* Bills Summary */}
                        <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-bold text-cyan-200">Bills Collection</span>
                                <span className="text-lg font-black text-white">{stats.bills.paid}/{stats.bills.total}</span>
                            </div>
                            <div className="w-full bg-white/10 rounded-full h-3">
                                <div
                                    className="bg-gradient-to-r from-purple-500 to-purple-400 h-3 rounded-full transition-all duration-500"
                                    style={{ width: `${stats.bills.total ? (stats.bills.paid / stats.bills.total) * 100 : 0}%` }}
                                ></div>
                            </div>
                            <p className="text-xs text-gray-400 mt-2">{stats.bills.total ? Math.round((stats.bills.paid / stats.bills.total) * 100) : 0}% collected</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
