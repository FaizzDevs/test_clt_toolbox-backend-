<?php

namespace App\Http\Controllers\Api;

use App\Models\Layup;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class LayupController extends Controller
{
    public function index($supplierId)
    {
        $layups = Layup::where('supplier_id', $supplierId)->get();
        return response()->json($layups);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'supplier_id' => 'required|exists:suppliers,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $layup = Layup::create($validated);
        return response()->json($layup, 201);
    }

    public function show($id)
    {
        $layup = Layup::with('layers')->findOrFail($id);
        return response()->json($layup);
    }

    public function update(Request $request, $id)
    {
        $layup = Layup::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $layup->update($validated);
        return response()->json($layup);
    }

    public function destroy($id)
    {
        $layup = Layup::findOrFail($id);
        $layup->delete();
        return response()->json(null, 204);
    }
}