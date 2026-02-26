import './bootstrap';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Suppliers from '../js/Pages/Suppliers';
import SupplierDetails from './Pages/SupplierDetails';
import LayupDetails from './Pages/LayupDetails';

ReactDOM.createRoot(document.getElementById('app')).render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Suppliers />} />
                <Route path="/suppliers" element={<Suppliers />} />
                <Route path="/suppliers/:id" element={<SupplierDetails />} />
                <Route path="/layups/:id" element={<LayupDetails />} />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);