import { useState, useEffect } from 'react';
import axios from 'axios';

const Billing = () => {
    const [bills, setBills] = useState([]);
    const [unEmployees, setUnEmployees] = useState([]);
    const [formData, setFormData] = useState({ unEmployeeId: '', month: '', rentAmount: '', maintenanceAmount: '' });

    const fetchBills = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/bills', { headers: { Authorization: `Bearer ${token}` } });
            setBills(res.data);
        } catch (error) {
            console.error('Failed to fetch bills', error);
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
        fetchBills();
        fetchUnEmployees();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await axios.post('http://localhost:5000/api/bills', formData, { headers: { Authorization: `Bearer ${token}` } });
            setFormData({ unEmployeeId: '', month: '', rentAmount: '', maintenanceAmount: '' });
            fetchBills();
        } catch (error) {
            console.error('Failed to generate bill', error);
        }
    };

    const handlePay = async (id) => {
        const token = localStorage.getItem('token');
        try {
            await axios.put(`http://localhost:5000/api/bills/${id}/pay`, {}, { headers: { Authorization: `Bearer ${token}` } });
            fetchBills();
        } catch (error) {
            console.error('Failed to pay bill', error);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Billing & Payments</h1>

            <div className="bg-white p-6 rounded shadow mb-6">
                <h2 className="text-xl font-semibold mb-4">Generate Bill</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <select
                        className="border p-2 rounded"
                        value={formData.unEmployeeId}
                        onChange={(e) => setFormData({ ...formData, unEmployeeId: e.target.value })}
                        required
                    >
                        <option value="">Select Resident</option>
                        {unEmployees.map(u => (
                            <option key={u.id} value={u.id}>{u.name} ({u.privatePartyCode})</option>
                        ))}
                    </select>
                    <input
                        type="text"
                        placeholder="Month (e.g. January 2024)"
                        value={formData.month}
                        onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                        className="border p-2 rounded"
                        required
                    />
                    <input
                        type="number"
                        placeholder="Rent Amount"
                        value={formData.rentAmount}
                        onChange={(e) => setFormData({ ...formData, rentAmount: e.target.value })}
                        className="border p-2 rounded"
                        required
                    />
                    <input
                        type="number"
                        placeholder="Maintenance Amount"
                        value={formData.maintenanceAmount}
                        onChange={(e) => setFormData({ ...formData, maintenanceAmount: e.target.value })}
                        className="border p-2 rounded"
                        required
                    />
                    <div className="md:col-span-2">
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Generate Bill</button>
                    </div>
                </form>
            </div>

            <div className="bg-white rounded shadow overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4">Resident</th>
                            <th className="p-4">Month</th>
                            <th className="p-4">Total</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bills.map((b) => (
                            <tr key={b.id} className="border-b">
                                <td className="p-4">{b.UnEmployee?.name}</td>
                                <td className="p-4">{b.month}</td>
                                <td className="p-4">${b.totalAmount}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${b.isPaid ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                                        {b.isPaid ? 'Paid' : 'Unpaid'}
                                    </span>
                                </td>
                                <td className="p-4">
                                    {!b.isPaid && (
                                        <button onClick={() => handlePay(b.id)} className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600">
                                            Mark Paid
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Billing;
