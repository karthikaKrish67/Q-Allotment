import { useState, useEffect } from 'react';
import axios from 'axios';

const Complaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [unEmployees, setUnEmployees] = useState([]); // Needed to simulate "raising complaint as user" if admin raises it, or filter
    const [description, setDescription] = useState('');
    const [selectedUnEmployee, setSelectedUnEmployee] = useState(''); // Simulating admin selecting who complains

    const fetchComplaints = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/complaints', { headers: { Authorization: `Bearer ${token}` } });
            setComplaints(res.data);
        } catch (error) {
            console.error('Failed to fetch complaints', error);
        }
    };

    const fetchUnEmployees = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/unEmployees', { headers: { Authorization: `Bearer ${token}` } });
            setUnEmployees(res.data);
        } catch (error) {
            console.error('Failed to fetch unEmployees', error);
        }
    };

    useEffect(() => {
        fetchComplaints();
        fetchUnEmployees();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await axios.post('http://localhost:5000/api/complaints', {
                description,
                unEmployeeId: selectedUnEmployee // In real app, this comes from auth context if user is logged in
            }, { headers: { Authorization: `Bearer ${token}` } });
            setDescription('');
            setSelectedUnEmployee('');
            fetchComplaints();
        } catch (error) {
            console.error('Failed to raise complaint', error);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        const token = localStorage.getItem('token');
        try {
            await axios.put(`http://localhost:5000/api/complaints/${id}/status`, { status }, { headers: { Authorization: `Bearer ${token}` } });
            fetchComplaints();
        } catch (error) {
            console.error('Failed to update status', error);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Maintenance Complaints</h1>

            <div className="bg-white p-6 rounded shadow mb-6">
                <h2 className="text-xl font-semibold mb-4">Raise New Complaint</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-1">Resident (Simulated User)</label>
                        <select
                            className="w-full border p-2 rounded"
                            value={selectedUnEmployee}
                            onChange={(e) => setSelectedUnEmployee(e.target.value)}
                            required
                        >
                            <option value="">Select Resident</option>
                            {unEmployees.map(u => (
                                <option key={u.id} value={u.id}>{u.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1">Description</label>
                        <textarea
                            className="w-full border p-2 rounded h-24"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        ></textarea>
                    </div>
                    <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Submit Complaint</button>
                </form>
            </div>

            <div className="bg-white rounded shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Complaint History</h2>
                <div className="space-y-4">
                    {complaints.map(c => (
                        <div key={c.id} className="border p-4 rounded flex justify-between items-center">
                            <div>
                                <p className="font-bold">{c.UnEmployee?.name} <span className="text-gray-500 font-normal">says:</span></p>
                                <p className="text-gray-700 mt-1">{c.description}</p>
                                <p className="text-xs text-gray-500 mt-2">Date: {new Date(c.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className={`text-center px-3 py-1 rounded text-sm font-bold 
                                    ${c.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                        c.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                                    {c.status}
                                </span>
                                <div className="flex gap-1">
                                    <button onClick={() => handleStatusUpdate(c.id, 'In Progress')} className="text-xs bg-gray-200 px-2 py-1 hover:bg-gray-300 rounded">Progress</button>
                                    <button onClick={() => handleStatusUpdate(c.id, 'Completed')} className="text-xs bg-gray-200 px-2 py-1 hover:bg-gray-300 rounded">Complete</button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {complaints.length === 0 && <p className="text-gray-500 italic">No complaints found.</p>}
                </div>
            </div>
        </div>
    );
};

export default Complaints;
