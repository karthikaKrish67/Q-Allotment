import { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
    const [stats, setStats] = useState({
        quarters: { total: 0, occupied: 0, vacant: 0 },
        unEmployees: 0,
        complaints: { pending: 0, completed: 0 }
    });

    useEffect(() => {
        const fetchStats = async () => {
            // Mocking data for now as backend aggregate endpoints might not exist yet
            try {
                const quartersRes = await axios.get('http://localhost:5000/api/quarters', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                const unEmployeesRes = await axios.get('http://localhost:5000/api/unEmployees', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                const complaintsRes = await axios.get('http://localhost:5000/api/complaints', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });

                const quarters = quartersRes.data;
                const unEmployees = unEmployeesRes.data;
                const complaints = complaintsRes.data;

                setStats({
                    quarters: {
                        total: quarters.length,
                        occupied: quarters.filter(q => q.status === 'Occupied').length,
                        vacant: quarters.filter(q => q.status === 'Vacant').length
                    },
                    unEmployees: unEmployees.length,
                    complaints: {
                        pending: complaints.filter(c => c.status === 'Pending').length,
                        completed: complaints.filter(c => c.status === 'Completed').length
                    }
                });
            } catch (error) {
                console.error("Error fetching stats", error);
            }
        };

        fetchStats();
    }, []);

    const quarterData = {
        labels: ['Occupied', 'Vacant'],
        datasets: [{
            label: 'Quarters Status',
            data: [stats.quarters.occupied, stats.quarters.vacant],
            backgroundColor: ['rgba(255, 99, 132, 0.5)', 'rgba(54, 162, 235, 0.5)'],
            borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
            borderWidth: 1,
        }]
    };

    const complaintData = {
        labels: ['Pending', 'Completed'],
        datasets: [{
            label: 'Complaints Status',
            data: [stats.complaints.pending, stats.complaints.completed],
            backgroundColor: ['rgba(255, 206, 86, 0.5)', 'rgba(75, 192, 192, 0.5)'],
            borderColor: ['rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)'],
            borderWidth: 1,
        }]
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
                    <h3 className="text-gray-500 text-sm">Total Quarters</h3>
                    <p className="text-2xl font-bold">{stats.quarters.total}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
                    <h3 className="text-gray-500 text-sm">Total UnEmployees</h3>
                    <p className="text-2xl font-bold">{stats.unEmployees}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
                    <h3 className="text-gray-500 text-sm">Pending Complaints</h3>
                    <p className="text-2xl font-bold">{stats.complaints.pending}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4">Quarters Occupancy</h2>
                    <div className="h-64 flex justify-center">
                        <Pie data={quarterData} />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4">Complaints Overview</h2>
                    <div className="h-64 flex justify-center">
                        <Bar data={complaintData} options={{ responsive: true, maintainAspectRatio: false }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
