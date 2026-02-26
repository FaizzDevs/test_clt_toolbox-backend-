import React, { useState } from 'react';
import api from '../Services/api'; 

function ImportModal({ isOpen, onClose, onSuccess, supplierId }) {
    const [importFile, setImportFile] = useState(null);
    const [resolutionStrategy, setResolutionStrategy] = useState('skip');
    const [dryRun, setDryRun] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setImportFile(file);
    };

    const handleImport = async () => {
        if (!importFile) {
            alert('Please select a file first');
            return;
        }

        const fileExt = importFile.name.split('.').pop().toLowerCase();
        if (!['xlsx', 'xls'].includes(fileExt)) {
            alert('Please select an Excel file (.xlsx or .xls)');
            return;
        }
        
        const formData = new FormData();
        formData.append('file', importFile);
        formData.append('resolution_strategy', resolutionStrategy);
        formData.append('dry_run', dryRun ? 'true' : 'false');

        try {
            const response = await api.post(`/suppliers/${supplierId}/import`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            if (response.data.success) {
                alert('✅ Import Excel berhasil!');
                
                if (onSuccess) {
                    await onSuccess();  
                }
                
                onClose();
                
                setImportFile(null);
                setResolutionStrategy('skip');
                setDryRun(false);
                
            } else {
                alert('Import gagal: ' + (response.data.message || 'Unknown error'));
            }
            
        } catch (error) {
            console.error('Error:', error);
            console.error('Response data:', error.response?.data);
            
            let errorMessage = 'Import Excel gagal: ';
            if (error.response?.data?.errors) {
                errorMessage += JSON.stringify(error.response.data.errors);
            } else if (error.response?.data?.message) {
                errorMessage += error.response.data.message;
            } else {
                errorMessage += error.message || 'Unknown error';
            }
            alert(errorMessage);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="relative w-full max-w-2xl bg-background-light dark:bg-background-dark rounded-xl shadow-2xl overflow-hidden border border-primary/10">
                
                <div className="flex items-center justify-between p-6 border-b border-primary/10">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        Import Layup Data
                    </h1>
                    <button 
                        onClick={onClose}
                        className="text-slate-500 hover:text-primary transition-colors"
                    >
                        <span className="material-symbols-outlined text-2xl">close</span>
                    </button>
                </div>

             
                <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
                
                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-primary/20 bg-primary/5 rounded-xl p-10 group cursor-pointer hover:border-primary/40 transition-all">
                        <div className="bg-primary/10 rounded-full p-4 mb-4 group-hover:bg-primary/20 transition-colors">
                            <span className="material-symbols-outlined text-4xl text-primary">
                                cloud_upload
                            </span>
                        </div>
                        <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                            Click to upload or drag and drop
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Excel files (.xlsx, .xls) or CSV up to 10MB 
                        </p>
                        <input
                            type="file"
                            accept=".csv,.json,.xlsx,.xls"
                            onChange={handleFileChange}
                            className="hidden"
                            id="file-upload"
                        />
                        <label
                            htmlFor="file-upload"
                            className="mt-4 px-6 py-2 bg-white dark:bg-slate-800 border border-primary/20 rounded-lg text-primary text-sm font-bold hover:bg-primary/5 transition-colors cursor-pointer"
                        >
                            Select File
                        </label>
                        {importFile && (
                            <p className="mt-2 text-sm text-primary">
                                Selected: {importFile.name}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                            Conflict Resolution Strategy
                        </label>
                        <div className="relative">
                            <select
                                value={resolutionStrategy}
                                onChange={(e) => setResolutionStrategy(e.target.value)}
                                className="w-full appearance-none bg-white dark:bg-slate-800 border border-primary/20 rounded-lg py-3 px-4 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            >
                                <option value="skip">Skip conflicts (Default)</option>
                                <option value="overwrite">Overwrite existing data</option>
                                <option value="duplicate">Create duplicate entries</option>
                                <option value="manual">Manual review required</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                                <span className="material-symbols-outlined">expand_more</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border border-primary/10">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary">
                                <span className="material-symbols-outlined text-2xl">flare</span>
                            </div>
                            <div>
                                <p className="text-base font-bold text-slate-900 dark:text-slate-100 leading-tight">
                                    Run as Dry Run
                                </p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Simulate the import process without making changes
                                </p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={dryRun}
                                onChange={(e) => setDryRun(e.target.checked)}
                            />
                            <div className="w-11 h-6 bg-slate-300 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-lg">
                        <div className="flex gap-3">
                            <span className="material-symbols-outlined text-rose-600 dark:text-rose-400">
                                warning
                            </span>
                            <div>
                                <p className="text-sm font-bold text-rose-900 dark:text-rose-100">
                                    Potential Conflicts Detected
                                </p>
                                <p className="text-sm text-rose-700 dark:text-rose-300">
                                    3 layups differ from existing records.
                                </p>
                            </div>
                        </div>
                        <button className="flex items-center gap-1 text-sm font-bold text-rose-900 dark:text-rose-100 hover:underline">
                            View details
                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </button>
                    </div>
                </div>

                <div className="flex flex-col-reverse sm:flex-row justify-end items-center gap-3 p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-primary/10">
                    <button
                        onClick={onClose}
                        className="w-full sm:w-auto px-6 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleImport}
                        className="w-full sm:w-auto px-8 py-2.5 bg-primary text-white rounded-lg font-bold hover:bg-opacity-90 transition-all shadow-md shadow-primary/20"
                    >
                        Confirm Import
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ImportModal;