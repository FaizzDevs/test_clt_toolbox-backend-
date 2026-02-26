import React, { useState, useEffect } from 'react';
import api from '../Services/api';
import { useNavigate } from 'react-router-dom';

function Suppliers() {
    const navigate = useNavigate()
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        contact_person: '',
        email: '',
        phone: '',
        address: ''
    });

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const fetchSuppliers = async () => {
        try {
            const response = await api.get('/suppliers');
            setSuppliers(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/suppliers', formData);
            fetchSuppliers();
            setShowModal(false);
            setFormData({
                name: '',
                contact_person: '',
                email: '',
                phone: '',
                address: ''
            });
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Yakin ingin menghapus supplier ini?')) {
            try {
                await api.delete(`/suppliers/${id}`);
                fetchSuppliers();
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };

    const filteredSuppliers = suppliers.filter(supplier => 
        supplier.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.id?.toString().includes(searchTerm)
    );

    const getInitials = (name) => {
        return name?.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase() || 'SP';
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen">

            <nav className="bg-white dark:bg-background-dark border-b border-primary/10 px-6 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-2 text-primary">
                            <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white">
                                <span className="material-symbols-outlined">account_tree</span>
                            </div>
                            <h2 className="text-xl font-extrabold">CLT Layup</h2>
                        </div>
                        <nav className="hidden md:flex items-center gap-6">
                            <a className="text-primary border-b-2 border-primary py-4 text-sm font-bold" href="#">Suppliers</a>
                            <a className="text-slate-500 hover:text-primary text-sm font-semibold" href="#">Layups</a>
                            <a className="text-slate-500 hover:text-primary text-sm font-semibold" href="#">Layers</a>
                        </nav>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold">Alex Morgan</p>
                                <p className="text-xs text-slate-500">Engineering Lead</p>
                            </div>
                            <div className="bg-primary/20 rounded-full size-10 flex items-center justify-center">
                                <span className="text-primary font-bold">AM</span>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="py-8 px-6 max-w-7xl mx-auto">

                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold">Suppliers</h1>
                        <p className="text-slate-500 mt-1">Manage timber suppliers for CLT projects.</p>
                    </div>
                    <button 
                        onClick={() => setShowModal(true)}
                        className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-sm">add</span>
                        Add Supplier
                    </button>
                </div>

                <div className="mb-6">
                    <div className="relative max-w-md">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                        <input
                            type="text"
                            placeholder="Search suppliers..."
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Supplier</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Contact Person</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Email</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Phone</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredSuppliers.length > 0 ? (
                                filteredSuppliers.map(supplier => (
                                    <tr key={supplier.id} className="hover:bg-slate-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                    {getInitials(supplier.name)}
                                                </div>
                                                <div>
                                                     <button
                                                        onClick={() => navigate(`/suppliers/${supplier.id}`)}
                                                        className="font-semibold text-left hover:text-primary hover:underline transition-colors"
                                                    >
                                                        {supplier.name}
                                                    </button>
                                                    <p className="text-xs text-slate-500">ID: {supplier.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm">{supplier.contact_person || '-'}</td>
                                        <td className="px-6 py-4 text-sm">{supplier.email || '-'}</td>
                                        <td className="px-6 py-4 text-sm">{supplier.phone || '-'}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-2 text-slate-400 hover:text-primary">
                                                <span className="material-symbols-outlined">edit</span>
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(supplier.id)}
                                                className="p-2 text-slate-400 hover:text-red-500"
                                            >
                                                <span className="material-symbols-outlined">delete</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                                        <p className="text-lg">No suppliers found</p>
                                        <p className="text-sm mt-1">Click "Add Supplier" to create one</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </main>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl max-w-md w-full p-6">
                        <h3 className="text-xl font-bold mb-4">Add New Supplier</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Contact Person</label>
                                    <input
                                        type="text"
                                        value={formData.contact_person}
                                        onChange={(e) => setFormData({...formData, contact_person: e.target.value})}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Phone</label>
                                    <input
                                        type="text"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Address</label>
                                    <textarea
                                        rows="3"
                                        value={formData.address}
                                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 border rounded-lg hover:bg-slate-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Suppliers;