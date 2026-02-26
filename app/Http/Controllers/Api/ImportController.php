<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Imports\LayupsSimpleImport;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class ImportController extends Controller
{
    public function importLayups(Request $request, $supplierId)
    {
        $validator = Validator::make($request->all(), [
            'file' => 'required|file|mimes:xlsx,xls,csv|max:10240',
            'resolution_strategy' => 'required|in:skip,overwrite,duplicate,manual',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $strategy = $request->input('resolution_strategy', 'skip');
            
            $dryRunInput = $request->input('dry_run', 'false');
            $dryRun = filter_var($dryRunInput, FILTER_VALIDATE_BOOLEAN);

            Log::info('Starting import', [
                'supplier_id' => $supplierId,
                'file_name' => $request->file('file')->getClientOriginalName(),
                'strategy' => $strategy,
                'dry_run_raw' => $dryRunInput,
                'dry_run_parsed' => $dryRun
            ]);

            $import = new LayupsSimpleImport($supplierId, $strategy, $dryRun);
            Excel::import($import, $request->file('file'));

            $message = $dryRun 
                ? 'Dry run completed. Data validated successfully.'
                : 'Import completed successfully.';

            return response()->json([
                'success' => true,
                'message' => $message,
                'dry_run' => $dryRun
            ]);

        } catch (\Maatwebsite\Excel\Validators\ValidationException $e) {
            $failures = $e->failures();
            
            return response()->json([
                'success' => false,
                'message' => 'File validation failed',
                'errors' => collect($failures)->map(function($failure) {
                    return [
                        'row' => $failure->row(),
                        'attribute' => $failure->attribute(),
                        'errors' => $failure->errors(),
                        'values' => $failure->values()
                    ];
                })
            ], 422);

        } catch (\Exception $e) {
            Log::error('Import error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Import failed: ' . $e->getMessage()
            ], 500);
        }
    }
}