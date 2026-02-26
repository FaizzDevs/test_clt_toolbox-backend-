<?php

namespace App\Http\Controllers\Api;

use App\Models\Layer;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Log;

class LayerController extends Controller
{
    public function index($layupId)
    {
        try {
            $layers = Layer::where('layup_id', $layupId)
                          ->orderBy('layer_order')
                          ->get();
            
            return response()->json($layers);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'layup_id' => 'required|exists:layups,id',
                'layer_order' => 'required|integer|min:1',
                'thickness' => 'required|numeric|min:0',
                'width' => 'required|numeric|min:0',
                'angle' => 'required|numeric|min:0|max:360',
            ]);

            $exists = Layer::where('layup_id', $validated['layup_id'])
                          ->where('layer_order', $validated['layer_order'])
                          ->exists();
            
            if ($exists) {
                return response()->json([
                    'error' => 'Layer order already exists for this layup'
                ], 422);
            }

            $layer = Layer::create($validated);
            
            return response()->json($layer, 201);
            
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function show(string $id)
    {
        try {
            $layer = Layer::findOrFail($id);
            return response()->json($layer);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Layer not found'], 404);
        }
    }

    public function update(Request $request, string $id)
    {
        try {
            $layer = Layer::findOrFail($id);
            
            $validated = $request->validate([
                'layer_order' => 'sometimes|integer|min:1',
                'thickness' => 'sometimes|numeric|min:0',
                'width' => 'sometimes|numeric|min:0',
                'angle' => 'sometimes|numeric|min:0|max:360',
            ]);

            if (isset($validated['layer_order']) && $validated['layer_order'] != $layer->layer_order) {
                $exists = Layer::where('layup_id', $layer->layup_id)
                              ->where('layer_order', $validated['layer_order'])
                              ->where('id', '!=', $id)
                              ->exists();
                
                if ($exists) {
                    return response()->json([
                        'error' => 'Layer order already exists for this layup'
                    ], 422);
                }
            }

            $layer->update($validated);
            return response()->json($layer);
            
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy(string $id)
    {
        try {
            $layer = Layer::findOrFail($id);
            $layer->delete();
            
            return response()->json(null, 204);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}