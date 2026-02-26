import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../Services/api';
import ImportModal from '../Components/ImportModal';

function SupplierDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [supplier, setSupplier] = useState(null);
    const [layups, setLayups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showImportModal, setShowImportModal] = useState(false);

    const [showLayupModal, setShowLayupModal] = useState(false);
    const [layupForm, setLayupForm] = useState({
        name: '',
        description: ''
    });

    

    const fetchSupplierDetails = async () => {
        try {
            const supplierResponse = await api.get(`/suppliers/${id}`);
            setSupplier(supplierResponse.data);

            const layupsResponse = await api.get(`/suppliers/${id}/layups`);
            setLayups(Array.isArray(layupsResponse.data) ? layupsResponse.data : []);
            
        } catch (error) {
            console.error('Error fetching details:', error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchSupplierDetails();
        setLoading(true);
    }, [id]);

    const handleAddLayup = async (e) => {
        e.preventDefault();
        try {
            await api.post('/layups', {
                supplier_id: parseInt(id),
                name: layupForm.name,
                description: layupForm.description
            });
            
            fetchSupplierDetails();
            setShowLayupModal(false);
            setLayupForm({ name: '', description: '' });
        } catch (error) {
            console.error('Error adding layup:', error);
            alert('Gagal menambah layup: '(error.response?.data?.message || error.message));
        }
    };

    const handleDeleteLayup = async (layupId) => {
        if (window.confirm('Yakin ingin menghapus layup ini?')) {
            try {
                await api.delete(`/layups/${layupId}`);
                fetchSupplierDetails();
            } catch (error) {
                console.error('Error deleting layup:', error);
            }
        }
    };

    const handleImport = async (file, strategy, dryRun) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('resolution_strategy', strategy);
        formData.append('dry_run', dryRun);

        try {
            const response = await api.post(`/suppliers/${id}/import`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            alert('Import successful!');
            setShowImportModal(false);
            fetchSupplierDetails(); 
        } catch (error) {
            console.error('Import error:', error);
            alert('Import failed: ' + (error.response?.data?.message || error.message));
        }
    };

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

    if (!supplier) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p>Supplier not found</p>
            </div>
        );
    }

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen">

            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark px-10 py-3">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-4 text-primary">
                        <div className="size-8">
                            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                <path clipRule="evenodd" d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z" fill="currentColor" fillRule="evenodd" />
                                <path clipRule="evenodd" d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z" fill="currentColor" fillRule="evenodd" />
                            </svg>
                        </div>
                        <h2 className="text-slate-900 dark:text-slate-100 text-lg font-bold">CLT Layup Manager</h2>
                    </div>
                    <nav className="flex items-center gap-9">
                        <a className="text-slate-700 dark:text-slate-300 text-sm font-medium hover:text-primary" href="#">Dashboard</a>
                        <a className="text-primary text-sm font-bold border-b-2 border-primary py-1" href="#">Suppliers</a>
                        <a className="text-slate-700 dark:text-slate-300 text-sm font-medium hover:text-primary" href="#">Layups</a>
                        <a className="text-slate-700 dark:text-slate-300 text-sm font-medium hover:text-primary" href="#">Projects</a>
                    </nav>
                </div>
                <div className="flex flex-1 justify-end gap-4">
                    <label className="flex flex-col min-w-40 !h-10 max-w-64">
                        <div className="flex w-full flex-1 items-stretch rounded-lg h-full bg-slate-100 dark:bg-slate-800">
                            <div className="text-slate-500 flex items-center justify-center pl-4">
                                <span className="material-symbols-outlined text-[20px]">search</span>
                            </div>
                            <input className="w-full min-w-0 flex-1 border-none bg-transparent focus:outline-0 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 px-4 pl-2 text-sm" placeholder="Search" />
                        </div>
                    </label>
                    <div className="flex gap-2">
                        <button className="flex items-center justify-center rounded-lg h-10 w-10 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            <span className="material-symbols-outlined">notifications</span>
                        </button>
                        <button className="flex items-center justify-center rounded-lg h-10 w-10 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            <span className="material-symbols-outlined">settings</span>
                        </button>
                    </div>
                    <div className="bg-primary/20 rounded-full size-10 overflow-hidden border-2 border-primary/10">
                        <div className="w-full h-full bg-primary/30 flex items-center justify-center text-primary font-bold">
                            FZ
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-[1200px] mx-auto w-full px-4 sm:px-6 lg:px-10 py-8">

                <nav className="flex flex-wrap items-center gap-2 mb-6">
                    <button 
                        onClick={() => navigate('/suppliers')}
                        className="text-primary hover:underline text-sm font-medium"
                    >
                        Suppliers
                    </button>
                    <span className="text-slate-400 text-sm">
                        <span className="material-symbols-outlined text-sm align-middle">chevron_right</span>
                    </span>
                    <span className="text-slate-600 dark:text-slate-400 text-sm font-medium">{supplier.name}</span>
                </nav>


                <section className="flex flex-col @container mb-8">
                    <div className="flex w-full flex-col gap-6 @[520px]:flex-row @[520px]:items-center @[520px]:justify-between bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center gap-6">
                            <div className="bg-primary/5 rounded-lg w-24 h-24 flex items-center justify-center border border-primary/10 overflow-hidden">
                                <div className="text-primary text-3xl font-bold">
                                    {getInitials(supplier.name)}
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex items-center gap-3">
                                    <h1 className="text-slate-900 dark:text-slate-100 text-3xl font-extrabold tracking-tight">{supplier.name}</h1>
                                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 uppercase tracking-wider">
                                        Active Partner
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 mt-1">
                                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm">id_card</span>
                                        Supplier ID: {supplier.id}
                                    </p>
                                    {supplier.contact_person && (
                                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium flex items-center gap-1">
                                            <span className="material-symbols-outlined text-sm">person</span>
                                            {supplier.contact_person}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                        <button className="flex items-center justify-center gap-2 px-6 h-11 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-all shadow-md shadow-primary/10">
                            <span className="material-symbols-outlined text-[20px]">edit</span>
                            <span>Edit Supplier</span>
                        </button>
                    </div>
                </section>

                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                    <div className="flex gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
                        <div className="bg-primary/10 text-primary rounded-lg size-12 flex items-center justify-center">
                            <span className="material-symbols-outlined">mail</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase">Email</span>
                            <span className="text-slate-900 dark:text-slate-100 text-sm font-semibold mt-1">
                                {supplier.email || 'Not provided'}
                            </span>
                        </div>
                    </div>
                    <div className="flex gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
                        <div className="bg-primary/10 text-primary rounded-lg size-12 flex items-center justify-center">
                            <span className="material-symbols-outlined">call</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase">Phone</span>
                            <span className="text-slate-900 dark:text-slate-100 text-sm font-semibold mt-1">
                                {supplier.phone || 'Not provided'}
                            </span>
                        </div>
                    </div>
                    <div className="flex gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
                        <div className="bg-primary/10 text-primary rounded-lg size-12 flex items-center justify-center">
                            <span className="material-symbols-outlined">location_on</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase">Address</span>
                            <span className="text-slate-900 dark:text-slate-100 text-sm font-semibold mt-1">
                                {supplier.address || 'Not provided'}
                            </span>
                        </div>
                    </div>
                    <div className="flex gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
                        <div className="bg-primary/10 text-primary rounded-lg size-12 flex items-center justify-center">
                            <span className="material-symbols-outlined">event_available</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase">Created</span>
                            <span className="text-slate-900 dark:text-slate-100 text-sm font-semibold mt-1">
                                {new Date(supplier.created_at).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </section>

                <section className="flex flex-col">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <h2 className="text-slate-900 dark:text-slate-100 text-2xl font-extrabold tracking-tight">Associated Layups</h2>
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <button 
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 h-10 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-bold hover:bg-slate-50"
                                onClick={() => setShowImportModal(true)}
                            >
                                <span className="material-symbols-outlined text-[18px]">file_upload</span>
                                Import
                            </button>
                            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 h-10 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-bold hover:bg-slate-50">
                                <span className="material-symbols-outlined text-[18px]">file_download</span>
                                Export
                            </button>
                            <ImportModal
                                isOpen={showImportModal}
                                onClose={() => setShowImportModal(false)}
                                onSuccess={fetchSupplierDetails}  
                                supplierId={id}
                            />
                            <button 
                                className="flex-[2] sm:flex-none flex items-center justify-center gap-2 px-4 h-10 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90"
                                onClick={() => setShowLayupModal(true)}
                            >
                                <span className="material-symbols-outlined text-[18px]">add</span>
                                Add Layup
                            </button>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-50 dark:bg-slate-800/50">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">Layup ID</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">Name</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">Description</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">Created</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {layups.length > 0 ? (
                                        layups.map((layup) => (
                                            <tr key={layup.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                                                <td className="px-6 py-4 text-sm font-bold text-primary">L-{layup.id}</td>
                                                <td className="px-6 py-4 text-sm font-semibold">
                                                    <button
                                                        onClick={() => navigate(`/layups/${layup.id}`)}
                                                        className="hover:text-primary hover:underline text-left font-semibold"
                                                    >
                                                        {layup.name}
                                                    </button>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                                                    {layup.description || '-'}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                                                    {new Date(layup.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button 
                                                        onClick={() => handleDeleteLayup(layup.id)}
                                                        className="text-slate-400 hover:text-red-500 transition-colors"
                                                    >
                                                        <span className="material-symbols-outlined">delete</span>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                                                <p className="text-lg">No layups found</p>
                                                <p className="text-sm mt-1">Click "Add Layup" to create one</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                                Showing {layups.length} of {layups.length} layups
                            </span>
                            <div className="flex gap-2">
                                <button className="p-1 px-3 border border-slate-300 dark:border-slate-700 rounded text-xs font-bold hover:bg-white dark:hover:bg-slate-900">Prev</button>
                                <button className="p-1 px-3 border border-slate-300 dark:border-slate-700 rounded text-xs font-bold hover:bg-white dark:hover:bg-slate-900">Next</button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {showLayupModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl max-w-md w-full p-6">
                        <h3 className="text-xl font-bold mb-4">Add New Layup</h3>
                        <form onSubmit={handleAddLayup}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Layup Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={layupForm.name}
                                        onChange={(e) => setLayupForm({...layupForm, name: e.target.value})}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                        placeholder="e.g., Standard 3-Ply Wall"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Description</label>
                                    <textarea
                                        rows="3"
                                        value={layupForm.description}
                                        onChange={(e) => setLayupForm({...layupForm, description: e.target.value})}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                        placeholder="Optional description"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowLayupModal(false)}
                                    className="px-4 py-2 border rounded-lg hover:bg-slate-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                                >
                                    Save Layup
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SupplierDetails;