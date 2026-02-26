<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\SupplierController;
use App\Http\Controllers\Api\LayupController;
use App\Http\Controllers\Api\LayerController;
use App\Http\Controllers\Api\ImportController;

// Suppliers API
Route::apiResource('suppliers', SupplierController::class);

// Layups API (nested under suppliers)
Route::get('/suppliers/{supplierId}/layups', [LayupController::class, 'index']);
Route::apiResource('layups', LayupController::class)->except(['index']);

// Layers API (nested under layups)
Route::get('/layups/{layupId}/layers', [LayerController::class, 'index']);
Route::apiResource('layers', LayerController::class)->except(['index']);

Route::post('/suppliers/{supplierId}/import', [ImportController::class, 'importLayups']);