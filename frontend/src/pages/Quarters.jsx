import { useState, useEffect } from 'react';
import axios from 'axios';

const Quarters = () => {
    const [quarters, setQuarters] = useState([]);
    const [unEmployees, setUnEmployees] = useState([]);
    const [formData, setFormData] = useState({ quarterNumber: '', type: '', status: 'Vacant' });
    const [allotmentData, setAllotmentData] = useState({ quarterId: '', unEmployeeId: '' });
    const [showAllotModal, setShowAllotModal] = useState(false);

    const fetchQuarters = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/quarters', { headers: { Authorization: `Bearer ${token}` } });
            setQuarters(res.data);
        } catch (error) {
            console.error('Failed to fetch quarters', error);
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
        fetchQuarters();
        fetchUnEmployees();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await axios.post('http://localhost:5000/api/quarters', formData, { headers: { Authorization: `Bearer ${token}` } });
            setFormData({ quarterNumber: '', type: '', status: 'Vacant' });
            fetchQuarters();
        } catch (error) {
            console.error('Failed to create quarter', error);
        }
    };

    const handleAllotmentSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await axios.post('http://localhost:5000/api/allotments/allot', allotmentData, { headers: { Authorization: `Bearer ${token}` } });
            setShowAllotModal(false);
            setAllotmentData({ quarterId: '', unEmployeeId: '' });
            fetchQuarters();
        } catch (error) {
            alert('Allotment failed: ' + (error.response?.data?.error || error.message));
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Manage Quarters</h1>

            {/* Add Quarter Form */}
            <div className="bg-white p-6 rounded shadow mb-6">
                <h2 className="text-xl font-semibold mb-4">Add New Quarter</h2>
                <form onSubmit={handleSubmit} className="flex gap-4 items-end">
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Number</label>
                        <input name="quarterNumber" value={formData.quarterNumber} onChange={handleChange} className="border p-2 rounded" required />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Type</label>
                        <select name="type" value={formData.type} onChange={handleChange} className="border p-2 rounded w-40" required>
                            <option value="">Select Type</option>
                            <option value="Type I">Type I</option>
                            <option value="Type II">Type II</option>
                            <option value="Type III">Type III</option>
                            <option value="Type IV">Type IV</option>
                        </select>
                    </div>
                    <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mb-0.5">Add Quarter</button>
                    <button type="button" onClick={() => setShowAllotModal(true)} className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 mb-0.5 ml-auto">
                        Allot Quarter
                    </button>
                </form>
            </div>

            {/* Quarters List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {quarters.map((q) => (
                    <div key={q.id} className={`p-4 rounded shadow border-l-4 ${q.status === 'Occupied' ? 'bg-red-50 border-red-500' : 'bg-green-50 border-green-500'}`}>
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-bold text-lg">{q.quarterNumber}</span>
                            <span className={`px-2 py-1 rounded text-xs font-bold ${q.status === 'Occupied' ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>
                                {q.status}
                            </span>
                        </div>
                        <p className="text-gray-600">{q.type}</p>
                    </div>
                ))}
            </div>

            {/* Allotment Modal */}
            {showAllotModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Allot Quarter</h2>
                        <form onSubmit={handleAllotmentSubmit}>
                            <div className="mb-4">
                                <label className="block mb-1">Select Quarter (Vacant Only)</label>
                                <select
                                    className="w-full border p-2 rounded"
                                    value={allotmentData.quarterId}
                                    onChange={(e) => setAllotmentData({ ...allotmentData, quarterId: e.target.value })}
                                    required
                                >
                                    <option value="">-- Select --</option>
                                    {quarters.filter(q => q.status === 'Vacant').map(q => (
                                        <option key={q.id} value={q.id}>{q.quarterNumber} ({q.type})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-6">
                                <label className="block mb-1">Select Resident</label>
                                <select
                                    className="w-full border p-2 rounded"
                                    value={allotmentData.unEmployeeId}
                                    onChange={(e) => setAllotmentData({ ...allotmentData, unEmployeeId: e.target.value })}
                                    required
                                >
                                    <option value="">-- Select --</option>
                                    {unEmployees.map(u => (
                                        <option key={u.id} value={u.id}>{u.name} ({u.privatePartyCode})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => setShowAllotModal(false)} className="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Allot</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Quarters;
