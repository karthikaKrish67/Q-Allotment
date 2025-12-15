import { useState, useEffect } from 'react';
import axios from 'axios';

const UnEmployees = () => {
    const [unEmployees, setUnEmployees] = useState([]);
    const [formData, setFormData] = useState({ name: '', privatePartyCode: '', address: '', phoneNumber: '' });
    const [editingId, setEditingId] = useState(null);

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
        fetchUnEmployees();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            if (editingId) {
                await axios.put(`http://localhost:5000/api/unEmployees/${editingId}`, formData, { headers: { Authorization: `Bearer ${token}` } });
            } else {
                await axios.post('http://localhost:5000/api/unEmployees', formData, { headers: { Authorization: `Bearer ${token}` } });
            }
            setFormData({ name: '', privatePartyCode: '', address: '', phoneNumber: '' });
            setEditingId(null);
            fetchUnEmployees();
        } catch (error) {
            console.error('Failed to save unEmployee', error);
        }
    };

    const handleEdit = (unEmployee) => {
        setFormData({
            name: unEmployee.name,
            privatePartyCode: unEmployee.privatePartyCode,
            address: unEmployee.address,
            phoneNumber: unEmployee.phoneNumber
        });
        setEditingId(unEmployee.id);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:5000/api/unEmployees/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            fetchUnEmployees();
        } catch (error) {
            console.error('Failed to delete unEmployee', error);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Manage UnEmployees</h1>

            <div className="bg-white p-6 rounded shadow mb-6">
                <h2 className="text-xl font-semibold mb-4">{editingId ? 'Edit UnEmployee' : 'Add New UnEmployee'}</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} className="border p-2 rounded" required />
                    <input name="privatePartyCode" placeholder="Private Party Code" value={formData.privatePartyCode} onChange={handleChange} className="border p-2 rounded" required />
                    <input name="address" placeholder="Address" value={formData.address} onChange={handleChange} className="border p-2 rounded" required />
                    <input name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange} className="border p-2 rounded" />
                    <div className="md:col-span-2">
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                            {editingId ? 'Update' : 'Add'}
                        </button>
                    </div>
                </form>
            </div>

            <div className="bg-white rounded shadow overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4">Name</th>
                            <th className="p-4">Code</th>
                            <th className="p-4">Address</th>
                            <th className="p-4">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {unEmployees.map((u) => (
                            <tr key={u.id} className="border-b hover:bg-gray-50">
                                <td className="p-4">{u.name}</td>
                                <td className="p-4">{u.privatePartyCode}</td>
                                <td className="p-4">{u.address}</td>
                                <td className="p-4">
                                    <button onClick={() => handleEdit(u)} className="text-blue-600 mr-2">Edit</button>
                                    <button onClick={() => handleDelete(u.id)} className="text-red-600">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UnEmployees;
