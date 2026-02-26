<?php

namespace App\Imports;

use App\Models\Layup;
use App\Models\Layer;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Concerns\Importable;

class LayupsSimpleImport implements ToModel, WithHeadingRow, WithValidation
{
    use Importable;

    protected $supplierId;
    protected $strategy;
    protected $dryRun;
    protected $conflicts = [];
    protected $processedLayups = [];

    public function __construct($supplierId, $strategy = 'skip', $dryRun = false)
    {
        $this->supplierId = $supplierId;
        $this->strategy = $strategy;
        $this->dryRun = $dryRun;
    }

    public function model(array $row)
    {
        if ($this->dryRun) {
            return null;
        }

        $layup = Layup::firstOrCreate(
            [
                'supplier_id' => $this->supplierId,
                'name' => $row['layup_name']
            ],
            [
                'description' => $row['description'] ?? null
            ]
        );

        Layer::create([
            'layup_id' => $layup->id,
            'layer_order' => $row['layer_order'],
            'thickness' => $row['thickness'],
            'width' => $row['width'],
            'angle' => $row['angle']
        ]);

        return null;
    }

    public function rules(): array
    {
        return [
            'layup_name' => 'required|string',
            'description' => 'nullable|string',
            'layer_order' => 'required|integer|min:1',
            'thickness' => 'required|numeric|min:0',
            'width' => 'required|numeric|min:0',
            'angle' => 'required|numeric|min:0|max:360',
        ];
    }

    public function customValidationMessages()
    {
        return [
            'layup_name.required' => 'Nama layup harus diisi',
            'layer_order.required' => 'Urutan layer harus diisi',
            'thickness.required' => 'Ketebalan harus diisi',
            'width.required' => 'Lebar harus diisi',
            'angle.required' => 'Sudut harus diisi',
        ];
    }

    public function getConflicts()
    {
        return $this->conflicts;
    }
}