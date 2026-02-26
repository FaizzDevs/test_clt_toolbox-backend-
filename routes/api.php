<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\SupplierController;
use App\Http\Controllers\Api\LayupController;
use App\Http\Controllers\Api\LayerController;
use App\Http\Controllers\Api\ImportController;

Route::apiResource('suppliers', SupplierController::class);

Route::get('/suppliers/{supplierId}/layups', [LayupController::class, 'index']);
Route::apiResource('layups', LayupController::class)->except(['index']);

Route::get('/layups/{layupId}/layers', [LayerController::class, 'index']);
Route::apiResource('layers', LayerController::class)->except(['index']);

Route::post('/suppliers/{supplierId}/import', [ImportController::class, 'importLayups']);