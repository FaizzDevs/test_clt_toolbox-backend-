import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../Services/api';

function LayupDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [layup, setLayup] = useState(null);
    const [layers, setLayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [layerForm, setLayerForm] = useState({
        layer_order: '',
        thickness: '',
        width: '',
        angle: ''
    });

    useEffect(() => {
        fetchLayupDetails();
    }, [id]);

    const fetchLayupDetails = async () => {
        try {
            const layupResponse = await api.get(`/layups/${id}`);
            setLayup(layupResponse.data);

            const layersResponse = await api.get(`/layups/${id}/layers`);
            setLayers(Array.isArray(layersResponse.data) ? layersResponse.data : []);
        } catch (error) {
            console.error('Error fetching layup details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddLayer = async (e) => {
        e.preventDefault();
        
        try {
            const maxOrder = layers.length > 0 
                ? Math.max(...layers.map(l => l.layer_order)) 
                : 0;
            const nextOrder = maxOrder + 1;
            
            const payload = {
                layup_id: parseInt(id),
                layer_order: nextOrder,
                thickness: parseFloat(layerForm.thickness),
                width: parseFloat(layerForm.width),
                angle: parseFloat(layerForm.angle)
            };
            
            const response = await api.post('/layers', payload);
            
            fetchLayupDetails();
            setShowModal(false);
            setLayerForm({
                layer_order: '',
                thickness: '',
                width: '',
                angle: ''
            });
        } catch (error) {
            console.error('Error:', error);
            console.error('Response:', error.response?.data);
            alert('Gagal: ' (error.response?.data?.message || error.message));
        }
    };

    const handleDeleteLayer = async (layerId) => {
        if (window.confirm('Yakin ingin menghapus layer ini?')) {
            try {
                await api.delete(`/layers/${layerId}`);
                fetchLayupDetails();
            } catch (error) {
                console.error('Error deleting layer:', error);
            }
        }
    };

    const getAngleIcon = (angle) => {
        return angle === 0 || angle === 180 ? 'straight' : 'rotate_right';
    };

    const getGradeColor = (thickness) => {
        if (thickness >= 40) return 'blue';
        if (thickness >= 20) return 'amber';
        return 'gray';
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!layup) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p>Layup not found</p>
            </div>
        );
    }

    const totalThickness = layers.reduce((sum, layer) => sum + parseFloat(layer.thickness), 0);

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen">
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-10 py-3">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-4 text-primary">
                        <div className="size-6">
                            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                <path d="M24 4C25.7818 14.2173 33.7827 22.2182 44 24C33.7827 25.7818 25.7818 33.7827 24 44C22.2182 33.7827 14.2173 25.7818 4 24C14.2173 22.2182 22.2182 14.2173 24 4Z" fill="currentColor" />
                            </svg>
                        </div>
                        <h2 className="text-slate-900 dark:text-slate-100 text-lg font-bold">CLT Management</h2>
                    </div>
                    <nav className="flex items-center gap-8">
                        <a className="text-slate-600 dark:text-slate-400 text-sm font-medium hover:text-primary" href="#">Inventory</a>
                        <a className="text-primary text-sm font-bold border-b-2 border-primary py-1" href="#">Suppliers</a>
                        <a className="text-slate-600 dark:text-slate-400 text-sm font-medium hover:text-primary" href="#">Production</a>
                        <a className="text-slate-600 dark:text-slate-400 text-sm font-medium hover:text-primary" href="#">Analytics</a>
                    </nav>
                </div>
                <div className="flex flex-1 justify-end gap-6 items-center">
                    <label className="flex flex-col min-w-40 h-10 max-w-64">
                        <div className="flex w-full flex-1 items-stretch rounded-lg bg-slate-100 dark:bg-slate-800">
                            <div className="text-slate-500 flex items-center justify-center pl-3">
                                <span className="material-symbols-outlined text-[20px]">search</span>
                            </div>
                            <input className="form-input flex w-full border-none bg-transparent focus:ring-0 text-sm" placeholder="Search specifications..." />
                        </div>
                    </label>
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-slate-600">notifications</span>
                        <div className="bg-primary/10 rounded-full p-1">
                            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-8" style={{ backgroundImage: 'url("https://via.placeholder.com/32")' }}></div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-[1400px] mx-auto w-full px-6 py-6 lg:px-10">
                <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
                    <button onClick={() => navigate('/suppliers')} className="hover:text-primary">Home</button>
                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                    <button onClick={() => navigate('/suppliers')} className="hover:text-primary">Suppliers</button>
                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                    <button onClick={() => navigate(`/suppliers/${layup.supplier_id}`)} className="hover:text-primary">Layups</button>
                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                    <span className="text-slate-900 dark:text-slate-100 font-medium">L-{layup.id}</span>
                </nav>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-black tracking-tight">Layup Specification: L-{layup.id}</h1>
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800 uppercase">
                                Active
                            </span>
                        </div>
                        <p className="text-slate-500">{layup.description || 'No description provided'}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-bold hover:bg-slate-50">
                            <span className="material-symbols-outlined text-[20px]">content_copy</span>
                            Duplicate
                        </button>
                        <button className="flex items-center gap-2 px-6 py-2 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary/90">
                            <span className="material-symbols-outlined text-[20px]">save</span>
                            Save Changes
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                        <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Created</p>
                        <p className="text-base font-bold text-slate-900 dark:text-slate-100">
                            {new Date(layup.created_at).toLocaleDateString()}
                        </p>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                        <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Last Modified</p>
                        <p className="text-base font-bold text-slate-900 dark:text-slate-100">
                            {new Date(layup.updated_at).toLocaleDateString()}
                        </p>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                        <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Total Thickness</p>
                        <p className="text-2xl font-black text-primary">{totalThickness}mm</p>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                        <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Total Layers</p>
                        <p className="text-2xl font-black text-primary">{layers.length} Layers</p>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex-[3] bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
                            <h3 className="font-bold text-slate-900 dark:text-slate-100">Layer Composition</h3>
                            <button 
                                onClick={() => setShowModal(true)}
                                className="text-primary text-xs font-bold flex items-center gap-1 hover:underline"
                            >
                                <span className="material-symbols-outlined text-[16px]">add_circle</span>
                                Add Layer
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-800/50">
                                    <tr>
                                        <th className="px-4 py-3">Order</th>
                                        <th className="px-4 py-3">Thickness</th>
                                        <th className="px-4 py-3">Width</th>
                                        <th className="px-4 py-3">Angle</th>
                                        <th className="px-4 py-3">Grade</th>
                                        <th className="px-4 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {layers.length > 0 ? (
                                        layers.sort((a, b) => a.layer_order - b.layer_order).map((layer) => (
                                            <tr key={layer.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                                                <td className="px-4 py-4 font-bold text-slate-900 dark:text-slate-100">
                                                    L{layer.layer_order}
                                                </td>
                                                <td className="px-4 py-4">{layer.thickness}mm</td>
                                                <td className="px-4 py-4">{layer.width}mm</td>
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className="material-symbols-outlined text-primary text-[18px]">
                                                            {getAngleIcon(layer.angle)}
                                                        </span>
                                                        <span className="text-sm">{layer.angle}°</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className={`inline-flex items-center gap-2 px-2 py-1 rounded bg-${getGradeColor(layer.thickness)}-50 dark:bg-${getGradeColor(layer.thickness)}-900/20 text-${getGradeColor(layer.thickness)}-700 dark:text-${getGradeColor(layer.thickness)}-400 border border-${getGradeColor(layer.thickness)}-100 dark:border-${getGradeColor(layer.thickness)}-800 text-xs font-bold`}>
                                                        <span className={`w-2 h-2 rounded-full bg-${getGradeColor(layer.thickness)}-500`}></span>
                                                        {layer.thickness >= 40 ? 'C24' : layer.thickness >= 20 ? 'C16' : 'C14'}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-right">
                                                    <button 
                                                        onClick={() => handleDeleteLayer(layer.id)}
                                                        className="text-slate-400 hover:text-red-500 transition-colors"
                                                    >
                                                        <span className="material-symbols-outlined text-[20px]">delete</span>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-4 py-12 text-center text-slate-500">
                                                <p className="text-lg">No layers found</p>
                                                <p className="text-sm mt-1">Click "Add Layer" to create one</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col gap-6">
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
                            <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-8">Structure Visualizer</h3>
                            <div className="w-full max-w-[200px] mx-auto flex flex-col items-center">
                                {layers.sort((a, b) => a.layer_order - b.layer_order).map((layer, index) => (
                                    <div 
                                        key={layer.id}
                                        className={`w-full ${index === 0 ? 'rounded-t-lg' : ''} ${index === layers.length - 1 ? 'rounded-b-lg' : ''} h-${Math.max(8, Math.floor(layer.thickness / 5))} bg-primary/${index % 2 === 0 ? '20' : '10'} border-2 border-primary/${index % 2 === 0 ? '40' : '30'} ${index > 0 && index < layers.length - 1 ? 'border-t-0 border-b-0' : ''} relative flex items-center justify-between px-3`}
                                        style={{ height: `${Math.max(32, layer.thickness * 0.8)}px` }}
                                    >
                                        <span className="text-[10px] font-bold text-primary">L{layer.layer_order}</span>
                                        <span className="material-symbols-outlined text-primary/60 text-[18px]">
                                            {getAngleIcon(layer.angle)}
                                        </span>
                                        <div className="absolute -right-16 text-[10px] text-slate-500 font-bold">
                                            {layer.thickness}mm
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-12 w-full grid grid-cols-2 gap-2 text-xs text-slate-500 font-medium">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[14px]">straight</span> 0° (Grain Parallel)
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[14px]">rotate_right</span> 90° (Cross Grain)
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl max-w-md w-full p-6">
                        <h3 className="text-xl font-bold mb-4">Add New Layer</h3>
                        <form onSubmit={handleAddLayer}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Thickness (mm) *</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        required
                                        value={layerForm.thickness}
                                        onChange={(e) => setLayerForm({...layerForm, thickness: e.target.value})}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                        placeholder="e.g., 40"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Width (mm) *</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        required
                                        value={layerForm.width}
                                        onChange={(e) => setLayerForm({...layerForm, width: e.target.value})}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                        placeholder="e.g., 1200"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Angle (°) *</label>
                                    <input
                                        type="number"
                                        step="1"
                                        required
                                        value={layerForm.angle}
                                        onChange={(e) => setLayerForm({...layerForm, angle: e.target.value})}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                        placeholder="e.g., 0 or 90"
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
                                    Save Layer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default LayupDetails;